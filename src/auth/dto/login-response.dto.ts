import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LoginResponse')
export class LoginResponseDto {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string
}
