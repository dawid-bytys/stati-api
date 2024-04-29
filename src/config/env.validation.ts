import {
  IsNumber,
  IsEnum,
  IsString,
  Min,
  Max,
  validateSync,
} from 'class-validator'
import { plainToInstance } from 'class-transformer'

enum Environment {
  development = 'development',
  production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number

  @IsString()
  JWT_SECRET_ACCESS: string

  @IsString()
  JWT_SECRET_REFRESH: string

  @IsString()
  DB_HOST: string

  @IsNumber()
  DB_PORT: number

  @IsString()
  DB_USER: string

  @IsString()
  DB_PASSWORD: string

  @IsString()
  DB_NAME: string
}

export interface Config {
  NODE_ENV: Environment
  PORT: number
  JWT_SECRET_ACCESS: string
  JWT_SECRET_REFRESH: string
  DB_HOST: string
  DB_PORT: number
  DB_USER: string
  DB_PASSWORD: string
  DB_NAME: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}
