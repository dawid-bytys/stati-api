import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt-strategy'
import { AuthResolver } from './auth.resolver'
import { UsersModule } from 'src/users/users.module'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [JwtModule, UsersModule, PassportModule],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
