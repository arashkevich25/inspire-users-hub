import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GrpcController } from './grpc-api/grpc.controller';
import { GrpcService } from './grpc-api/grpc.service';
import { CommonController } from './rest-api/common.controller';
import { MonitoringController } from './rest-api/monitoring.controller';

import { AuthModule } from './core/auth/auth.module';
import { AuthMiddleware } from './core/middlewares/auth.middleware';
import {
  LoginHistoryModule,
} from './core/modules/login-history/login-history.module';
import { SocietyModule } from './core/modules/society/society.module';
import { UsersModule } from './core/modules/users/users.module';
import { UserAuthController } from './rest-api/user-auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    HttpModule,
    SocietyModule,
    LoginHistoryModule,
  ],
  controllers: [
    CommonController,
    UserAuthController,
    MonitoringController,
    GrpcController,
  ],
  providers: [GrpcService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('/monitoring/check').forRoutes('/');
  }
}
