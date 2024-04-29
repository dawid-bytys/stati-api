import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { Config } from './config/env.validation'

async function startServer() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<Config, true>)
  const port = configService.get('PORT', { infer: true })
  await app.listen(port)
}

startServer()
