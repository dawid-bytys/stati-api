import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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

  async upsertNotificationToken(
    user: UserEntity,
    token: string,
    deviceUniqueId: string,
  ): Promise<string> {
    const existingToken = await this.notificationsRepository.findOne({
      select: ['id'],
      where: {
        user,
        deviceUniqueId,
      },
    })

    if (existingToken) {
      await this.notificationsRepository.update(
        {
          user,
          deviceUniqueId,
        },
        {
          token,
        },
      )
    } else {
      await this.notificationsRepository.save({
        user,
        token,
        deviceUniqueId,
      })
    }

    return 'Notification token saved'
  }

  async sendPushNotification(
    user: UserEntity,
    data: NotificationData,
  ): Promise<void> {
    const tokens = await this.notificationsRepository.find({
      select: ['id', 'token'],
      where: { user },
    })

    if (tokens.length === 0) {
      return
    }

    await getMessaging().sendEachForMulticast({
      tokens: tokens.map(({ token }) => token),
      notification: {
        title: data.title,
        body: data.body,
        imageUrl: 'https://i.imgur.com/nnm7Pxs.png',
      },
      android: {
        priority: 'high',
      },
    })
  }
}