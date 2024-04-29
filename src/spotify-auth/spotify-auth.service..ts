import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SpotifyAuthEntity } from './spotify-auth.entity'
import { FindOneOptions, Repository } from 'typeorm'
import { UserEntity } from 'src/users/users.entity'
import { Cron } from '@nestjs/schedule'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class SpotifyAuthService {
  constructor(
    @InjectRepository(SpotifyAuthEntity)
    private readonly spotifyAuthRepository: Repository<SpotifyAuthEntity>,
    private readonly usersService: UsersService,
  ) {}

  findOne(
    options: FindOneOptions<SpotifyAuthEntity>,
  ): Promise<SpotifyAuthEntity | null> {
    return this.spotifyAuthRepository.findOne(options)
  }

  async upsertSpotifyAuth(
    user: UserEntity,
    spdcCookie: string,
    accessToken: string,
    accessTokenExpirationTimestampMs: number,
  ): Promise<string> {
    const existingSpotifyAuth = await this.findOne({
      select: ['id'],
      where: {
        user,
      },
    })

    if (existingSpotifyAuth) {
      await this.spotifyAuthRepository.update(existingSpotifyAuth.id, {
        spdcCookie,
        accessToken,
        accessTokenExpirationTimestampMs,
      })
    } else {
      await this.spotifyAuthRepository.insert({
        user,
        spdcCookie,
        accessToken,
        accessTokenExpirationTimestampMs,
      })
    }

    return 'success'
  }

  async updateAccessToken(
    user: UserEntity,
    accessToken: string,
    accessTokenExpirationTimestampMs: number,
  ) {
    await this.spotifyAuthRepository.update(
      {
        user,
      },
      {
        accessToken,
        accessTokenExpirationTimestampMs,
      },
    )
  }

  async refreshToken(user: UserEntity) {
    const spotifyAuth = await this.findOne({
      select: ['id', 'spdcCookie'],
      where: {
        user,
      },
    })

    if (!spotifyAuth) {
      return
    }

    const { accessToken, accessTokenExpirationTimestampMs } =
      await this.fetchAccessToken(spotifyAuth.spdcCookie)

    await this.updateAccessToken(
      user,
      accessToken,
      accessTokenExpirationTimestampMs,
    )
  }

  @Cron('*/5 * * * * *')
  async checkAndRefreshTokens() {
    const users = await this.usersService.getUsersWithFriendsAndInvalidToken()
    await Promise.all(users.map((user) => this.refreshToken(user)))
  }

  private async fetchAccessToken(spdcCookie: string) {
    const response = await fetch('https://open.spotify.com/get_access_token', {
      method: 'GET',
      credentials: 'omit',
      headers: {
        Cookie: `sp_dc=${spdcCookie}`,
      },
    })

    return response.json()
  }
}