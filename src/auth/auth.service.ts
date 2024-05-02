import { ConfigService } from '@nestjs/config'
import { Config } from 'src/config/env.validation'
import { UsersService } from 'src/users/users.service'
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { LoginResponseDto } from './dto/login-response.dto'
import { RegisterResponseDto } from './dto/register-response.dto'
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto'

@Injectable()
export class AuthService {
  private readonly saltRounds = 10

  constructor(
    private readonly configService: ConfigService<Config, true>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<RegisterResponseDto> {
    const usersCount = await this.usersService.count({ where: { email } })

    if (usersCount > 0) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = this.hashPassword(password)
    const accessToken = this.generateToken(email, '1d')
    const refreshToken = this.generateToken(email)

    await this.usersService.createUser(email, hashedPassword)
    return { accessToken, refreshToken }
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.usersService.findOne({
      select: ['id', 'password'],
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const passwordsMatch = await this.comparePasswords(password, user.password)
    if (!passwordsMatch) {
      throw new ConflictException('Invalid password')
    }

    const accessToken = this.generateToken(email, '1d')
    const refreshToken = this.generateToken(email)

    return { accessToken, refreshToken }
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshAccessTokenDto> {
    const secret = this.configService.get('JWT_SECRET_REFRESH', {
      infer: true,
    })
    const { email } = this.jwtService.verify(refreshToken, { secret })
    const usersCount = await this.usersService.count({ where: { email } })

    if (usersCount === 0) {
      throw new NotFoundException('User not found')
    }

    const accessToken = this.generateToken(email, '1d')
    return { accessToken }
  }

  private generateToken(email: string, expiresIn?: string): string {
    if (expiresIn) {
      const secret = this.configService.get('JWT_SECRET_ACCESS', {
        infer: true,
      })

      return this.jwtService.sign({ email }, { secret, expiresIn })
    }

    const secret = this.configService.get('JWT_SECRET_REFRESH', { infer: true })
    return this.jwtService.sign({ email }, { secret })
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds)
  }

  private comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}
