import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard'
import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { CurrentUser } from 'src/auth/user.decorator'
import { UserEntity } from 'src/users/users.entity'
import { NonEmptyStringResolver } from 'graphql-scalars'
import { SpotifyAuthService } from './spotify-auth.service.'

@Resolver()
export class SpotifyAuthResolver {
  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NonEmptyStringResolver)
  async upsertSpotifyAuth(
    @CurrentUser() user: UserEntity,
    @Args('spdcCookie') spdcCookie: string,
    @Args('accessToken') accessToken: string,
    @Args('accessTokenExpirationTimestampMs')
    accessTokenExpirationTimestampMs: number,
  ): Promise<string> {
    await this.spotifyAuthService.upsertSpotifyAuth(
      user,
      spdcCookie,
      accessToken,
      accessTokenExpirationTimestampMs,
    )

    return 'success'
  }
}
