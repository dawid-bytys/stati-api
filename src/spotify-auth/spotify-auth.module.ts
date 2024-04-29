import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpotifyAuthEntity } from './spotify-auth.entity'
import { SpotifyAuthResolver } from './spotify-auth.resolver'
import { SpotifyAuthService } from './spotify-auth.service.'
import { JwtService } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([SpotifyAuthEntity]), UsersModule],
  providers: [SpotifyAuthService, SpotifyAuthResolver, JwtService],
  exports: [SpotifyAuthService],
})
export class SpotifyAuthModule {}
