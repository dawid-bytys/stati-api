import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { getConfig } from 'src/config/config'

config({
  path:
    getConfig('NODE_ENV') === 'development' ? '.env.development' : undefined,
})

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: getConfig('DB_HOST'),
  database: getConfig('DB_NAME'),
  username: getConfig('DB_USER'),
  port: parseInt(getConfig('DB_PORT')),
  entities: [
    getConfig('NODE_ENV') === 'development'
      ? 'src/**/*.entity.ts'
      : 'dist/**/*.entity.js',
  ],
  migrations: [
    getConfig('NODE_ENV') === 'development'
      ? 'src/database/migrations/*-migration.ts'
      : 'dist/database/migrations/*-migration.js',
  ],
}

export const dataSource = new DataSource(dataSourceOptions)
