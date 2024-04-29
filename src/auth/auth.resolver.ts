import { AuthService } from './auth.service'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { LoginResponseDto } from './dto/login-response.dto'
import { RegisterResponseDto } from './dto/register-response.dto'
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponseDto)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(email, password)
  }

  @Mutation(() => LoginResponseDto)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponseDto> {
    return this.authService.login(email, password)
  }

  @Query(() => RefreshAccessTokenDto)
  async refreshAccessToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<RefreshAccessTokenDto> {
    return this.authService.refreshAccessToken(refreshToken)
  }
}
