import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RegisterResponse')
export class RegisterResponseDto {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string
}
