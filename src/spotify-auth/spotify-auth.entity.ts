import { UserEntity } from 'src/users/users.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('spotify_auth')
export class SpotifyAuthEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  spdcCookie: string

  @Column({ unique: true })
  accessToken: string

  @Column({ type: 'bigint' })
  accessTokenExpirationTimestampMs: number

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity
}
