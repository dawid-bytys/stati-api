import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { NotificationsService } from './notifications.service'
import { NotificationTokenEntity } from './notifications.entity'
import { NotificationsResolver } from './notifications.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTokenEntity])],
  providers: [NotificationsService, JwtService, NotificationsResolver],
  exports: [NotificationsService],
})
export class NotificationsModule {}
