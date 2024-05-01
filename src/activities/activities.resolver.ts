import { UseGuards } from '@nestjs/common'
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { ActivitiesService } from './activities.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard'
import { CurrentUser } from 'src/auth/user.decorator'
import { UserEntity } from 'src/users/users.entity'
import { NonEmptyStringResolver } from 'graphql-scalars'
import { ActivityDto } from './dto/activities.dto'

@Resolver()
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NonEmptyStringResolver)
  async insertActivity(
    @CurrentUser() currentUser: UserEntity,
    @Args('friendUri') friendUri: string,
    @Args('timestampMs') timestampMs: number,
  ): Promise<string> {
    await this.activitiesService.insertActivity(
      currentUser,
      friendUri,
      timestampMs,
    )
    return 'success'
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NonEmptyStringResolver)
  async deleteActivity(
    @CurrentUser() currentUser: UserEntity,
    @Args('friendUri') friendUri: string,
  ): Promise<string> {
    await this.activitiesService.deleteActivity(currentUser, friendUri)
    return 'success'
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [ActivityDto])
  getActivities(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ActivityDto[]> {
    return this.activitiesService.getActivities(currentUser)
  }
}
