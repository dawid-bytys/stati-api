import { UserEntity } from './users.entity'
import { Injectable, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
    return this.usersRepository.findOne(options)
  }

  count(options?: FindManyOptions<UserEntity>): Promise<number> {
    return this.usersRepository.count(options)
  }

  async createUser(email: string, password: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      select: ['id'],
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    await this.usersRepository.insert({ email, password })
  }

  async doesUserExist(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      select: ['id'],
      where: { email },
    })

    return user !== null
  }

  getUsersWithFriendsAndValidToken(): Promise<UserEntity[]> {
    return this.usersRepository
      .createQueryBuilder('users')
      .innerJoin('users.activities', 'ac')
      .innerJoin('spotify_auth', 'sa', 'users.id = sa.user.id')
      .where(
        'sa.accessTokenExpirationTimestampMs > extract (epoch from now()) * 1000',
      )
      .getMany()
  }

  getUsersWithFriendsAndInvalidToken(): Promise<UserEntity[]> {
    return this.usersRepository
      .createQueryBuilder('users')
      .innerJoin('users.activities', 'ac')
      .innerJoin('spotify_auth', 'sa', 'users.id = sa.user.id')
      .where(
        'sa.accessTokenExpirationTimestampMs <= extract (epoch from now()) * 1000',
      )
      .getMany()
  }
}
