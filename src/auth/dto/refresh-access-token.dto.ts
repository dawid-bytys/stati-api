import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RefreshAccessToken')
export class RefreshAccessTokenDto {
  @Field(() => String)
  accessToken: string
}
