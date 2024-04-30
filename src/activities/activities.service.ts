import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/users/users.entity'
import { FindOneOptions, Repository } from 'typeorm'
import { ActivityEntity } from './activities.entity'
import { Cron } from '@nestjs/schedule'
import { FriendsActivityResponse } from './activities.types'
import { NotificationsService } from 'src/notifications/notifications.service'
import { UsersService } from 'src/users/users.service'
import { SpotifyAuthService } from 'src/spotify-auth/spotify-auth.service.'

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

  async addActivity(
    user: UserEntity,
    friendUri: string,
    timestampMs: number,
  ): Promise<string> {
    await this.activitiesRepository.insert({
      user,
      friendUri,
      timestampMs,
    })

    return 'success'
  }

  async updateActivity(
    user: UserEntity,
    friendUri: string,
    timestampMs: number,
  ): Promise<void> {
    await this.activitiesRepository.update(
      {
        user,
        friendUri,
      },
      {
        timestampMs,
      },
    )
  }

  @Cron('*/10 * * * * *')
  async checkAndUpdateActivities() {
    const users = await this.usersService.getUsersWithFriendsAndValidToken()
    await Promise.all(users.map((user) => this.processUserActivities(user)))
  }

  private async processUserActivities(user: UserEntity) {
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
          await this.notificationsService.sendPushNotification(user, {
            title: 'New Friend Activity',
            body: `${activity.user.name} has started listening!`,
          })
        }

        await this.updateActivity(user, activity.user.name, activity.timestamp)
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
