import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository } from 'typeorm'
import { NotificationTokenEntity } from './notifications.entity'
import admin from 'firebase-admin'
import { getMessaging } from 'firebase-admin/messaging'
import { NotificationData } from './notifications.type'
import { UserEntity } from 'src/users/users.entity'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationTokenEntity)
    private readonly notificationsRepository: Repository<NotificationTokenEntity>,
  ) {
    admin.initializeApp({
      credential: admin.credential.cert('src/firebase/serviceAccountKey.json'),
    })
  }

  getNotificationTokens(user: UserEntity): Promise<NotificationTokenEntity[]> {
    return this.notificationsRepository.find({ where: { user } })
  }

  upsertNotificationToken(
    user: UserEntity,
    token: string,
    deviceUniqueId: string,
  ): Promise<InsertResult> {
    return this.notificationsRepository.upsert(
      { user, token, deviceUniqueId },
      {
        conflictPaths: ['deviceUniqueId', 'user'],
      },
    )
  }

  async sendPushNotification(
    user: UserEntity,
    data: NotificationData,
    notificationTokens?: NotificationTokenEntity[],
  ): Promise<void> {
    let tokens = notificationTokens

    if (tokens === undefined) {
      tokens = await this.getNotificationTokens(user)
    }

    if (tokens.length === 0) {
      return
    }

    await getMessaging().sendEachForMulticast({
      tokens: tokens.map(({ token }) => token),
      notification: {
        title: data.title,
        body: data.body,
      },
      android: {
        priority: 'high',
      },
    })
  }
}
