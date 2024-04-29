import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard'
import { NotificationsService } from './notifications.service'
import { NonEmptyStringResolver } from 'graphql-scalars'
import { CurrentUser } from 'src/auth/user.decorator'
import { UserEntity } from 'src/users/users.entity'

@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NonEmptyStringResolver)
  upsertNotificationToken(
    @CurrentUser() currentUser: UserEntity,
    @Args('value') value: string,
    @Args('deviceId') deviceId: string,
  ): Promise<string> {
    return this.notificationsService.upsertNotificationToken(
      currentUser,
      value,
      deviceId,
    )
  }
}
