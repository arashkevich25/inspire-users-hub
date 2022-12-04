import { Logger } from '@nestjs/common';
import { join } from 'path';

import { AppModule } from './app.module';

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

const logger = new Logger('NestApplication');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.connectMicroservice({
    name: 'USERS_HUB_NAME',
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_ENDPOINT,
      package: 'users',
      protoPath: join(__dirname, 'users.proto'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.APP_PORT);
  logger.log(`APP runs on ${process.env.APP_PORT}`);
  logger.log(`GRPC runs on ${process.env.GRPC_ENDPOINT}`);
}
bootstrap();
