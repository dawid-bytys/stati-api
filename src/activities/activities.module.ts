import { Module } from '@nestjs/common'
import { ActivityEntity } from './activities.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ActivitiesResolver } from './activities.resolver'
import { ActivitiesService } from './activities.service'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { UsersModule } from 'src/users/users.module'
import { SpotifyAuthModule } from 'src/spotify-auth/spotify-auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityEntity]),
    SpotifyAuthModule,
    NotificationsModule,
    UsersModule,
  ],
  providers: [ActivitiesResolver, ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
