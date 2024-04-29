import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ActivityDto {
  @Field()
  username: string
}
