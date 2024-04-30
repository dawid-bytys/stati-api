import { UseGuards } from '@nestjs/common'
import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { ActivitiesService } from './activities.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard'
import { CurrentUser } from 'src/auth/user.decorator'
import { UserEntity } from 'src/users/users.entity'
import { NonEmptyStringResolver } from 'graphql-scalars'

@Resolver()
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NonEmptyStringResolver)
  addActivity(
    @CurrentUser() currentUser: UserEntity,
    @Args('friendUri') friendUri: string,
    @Args('timestampMs') timestampMs: number,
  ): Promise<string> {
    return this.activitiesService.addActivity(
      currentUser,
      friendUri,
      timestampMs,
    )
  }
}
