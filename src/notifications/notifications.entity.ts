import { UserEntity } from 'src/users/users.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('notification_tokens')
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
