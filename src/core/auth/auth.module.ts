import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { jwtConstants } from '../config/config';
import {
  LoginHistoryModule,
} from '../modules/login-history/login-history.module';
import { SocietyModule } from '../modules/society/society.module';
import { UsersModule } from '../modules/users/users.module';
import { ApiKeyStrategy } from './api-key.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

import { AuthService } from './auth.service';

@Module({
  imports: [
    SocietyModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
      verifyOptions: { ignoreExpiration: true },
    }),
    UsersModule,
    LoginHistoryModule,
    HttpModule,
  ],
  providers: [ApiKeyStrategy, JwtStrategy, AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
