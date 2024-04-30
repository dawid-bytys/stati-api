import { UserEntity } from 'src/users/users.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

@Entity('notification_tokens')
@Unique(['deviceUniqueId', 'user'])
export class NotificationTokenEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  token: string

  @Column()
  deviceUniqueId: string

  @ManyToOne(() => UserEntity, (user) => user.notificationTokens)
  @JoinColumn()
  user: UserEntity
}
