import { Args, Query, Resolver } from '@nestjs/graphql'
import { UsersService } from './users.service'

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Boolean)
  doesUserExist(@Args('email') email: string): Promise<boolean> {
    return this.usersService.doesUserExist(email)
  }
}
