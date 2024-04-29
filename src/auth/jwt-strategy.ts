import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Config } from 'src/config/env.validation'
import { JwtPayload } from 'src/types'
import { UserEntity } from 'src/users/users.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<Config, true>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_ACCESS', { infer: true }),
    })
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.usersService.findOne({
      select: ['id'],
      where: { email: payload.email },
    })

    if (!user || !payload.email) {
      throw new UnauthorizedException()
    }

    return user
  }
}
