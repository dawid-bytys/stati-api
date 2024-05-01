import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/users/users.entity'
import {
  DeleteResult,
  FindOneOptions,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm'
import { ActivityEntity } from './activities.entity'
import { Cron } from '@nestjs/schedule'
import { FriendsActivityResponse } from './activities.types'
import { NotificationsService } from 'src/notifications/notifications.service'
import { UsersService } from 'src/users/users.service'
import { SpotifyAuthService } from 'src/spotify-auth/spotify-auth.service.'
import { ActivityDto } from './dto/activities.dto'

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activitiesRepository: Repository<ActivityEntity>,
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  findOne(
    options: FindOneOptions<ActivityEntity>,
  ): Promise<ActivityEntity | null> {
    return this.activitiesRepository.findOne(options)
  }

  insertActivity(
    user: UserEntity,
    friendUri: string,
    timestampMs: number,
  ): Promise<InsertResult> {
    return this.activitiesRepository.insert({
      user,
      friendUri,
      timestampMs,
    })
  }

  deleteActivity(user: UserEntity, friendUri: string): Promise<DeleteResult> {
    return this.activitiesRepository.delete({
      user,
      friendUri,
    })
  }

  updateActivity(
    user: UserEntity,
    friendUri: string,
    timestampMs: number,
  ): Promise<UpdateResult> {
    return this.activitiesRepository.update(
      {
        user,
        friendUri,
      },
      {
        timestampMs,
      },
    )
  }

  getActivities(user: UserEntity): Promise<ActivityDto[]> {
    return this.activitiesRepository.find({
      where: {
        user,
      },
    })
  }

  @Cron('*/10 * * * * *')
  async checkAndUpdateActivities(): Promise<void> {
    const users = await this.usersService.getUsersWithFriendsAndValidToken()
    await Promise.allSettled(
      users.map((user) => this.processUserActivities(user)),
    )
  }

  private async processUserActivities(user: UserEntity): Promise<void> {
    const spotifyAuth = await this.spotifyAuthService.findOne({
      select: ['id', 'accessToken'],
      where: {
        user,
      },
    })

    if (!spotifyAuth) {
      return
    }

    const { friends: newActivities } = await this.fetchActivities(
      spotifyAuth.accessToken,
    )

    const notificationTokens =
      await this.notificationsService.getNotificationTokens(user)

    for (const activity of newActivities) {
      const previousActivity = await this.findOne({
        select: ['id', 'timestampMs'],
        where: {
          user,
          friendUri: activity.user.uri,
        },
      })

      if (previousActivity) {
        if (
          this.isNewActivity(previousActivity.timestampMs, activity.timestamp)
        ) {
          await this.notificationsService.sendPushNotification(
            user,
            {
              title: 'New Friend Activity',
              body: `${activity.user.name} has started listening!`,
            },
            notificationTokens,
          )
        }

        await this.updateActivity(user, activity.user.uri, activity.timestamp)
      }
    }
  }

  private async fetchActivities(
    accessToken: string,
  ): Promise<FriendsActivityResponse> {
    const response = await fetch(
      'https://spclient.wg.spotify.com/presence-view/v1/buddylist',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    return response.json()
  }

  private isNewActivity(
    previousTimestamp: number,
    newTimestamp: number,
  ): boolean {
    return newTimestamp - previousTimestamp > 900_000
  }
}
