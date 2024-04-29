import { ActivityEntity } from 'src/activities/activities.entity'
import { NotificationTokenEntity } from 'src/notifications/notifications.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @OneToMany(() => ActivityEntity, (activity) => activity.user)
  activities: ActivityEntity[]

  @OneToMany(
    () => NotificationTokenEntity,
    (notificationToken) => notificationToken.user,
  )
  notificationTokens: NotificationTokenEntity[]
}
