import { UserEntity } from 'src/users/users.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

@Entity('activities')
export class ActivityEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  friendUri: string

  @Column({ type: 'bigint' })
  timestampMs: number

  @ManyToOne(() => UserEntity, (user) => user.activities)
  @JoinColumn()
  user: UserEntity
}
