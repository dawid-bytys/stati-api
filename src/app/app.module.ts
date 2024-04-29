import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Config, validate } from 'src/config/env.validation'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { getConfig } from 'src/config/config'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { SpotifyAuthModule } from 'src/spotify-auth/spotify-auth.module'
import { ScheduleModule } from '@nestjs/schedule'
import { ActivitiesModule } from 'src/activities/activities.module'
import { NotificationsModule } from 'src/notifications/notifications.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      envFilePath: '.env.development',
      ignoreEnvFile: getConfig('NODE_ENV') === 'production',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        getConfig('NODE_ENV') === 'development'
          ? 'src/graphql/schema.gql'
          : 'dist/graphql/schema.gql',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    SpotifyAuthModule,
    ActivitiesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
