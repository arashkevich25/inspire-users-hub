import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocietyModule } from '../society/society.module';

import { UserAppIdEntity } from './entities/user-app-id.entity';
import { UserDeviceIdEntity } from './entities/user-device-id.entity';
import {
  UserResetPasswordStorageEntity,
} from './entities/user-reset-password-storage.entity';
import { UsersEntity } from './entities/users.entity';
import { AppIdService } from './services/app-id.service';
import { DeviceIdService } from './services/device-id.service';
import { UserSecurityService } from './services/user-security.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserResetPasswordStorageEntity,
      UserDeviceIdEntity,
      UserAppIdEntity,
      UsersEntity,
    ]),
    SocietyModule,
  ],
  providers: [UsersService, DeviceIdService, AppIdService, UserSecurityService],
  exports: [UsersService, DeviceIdService, AppIdService, UserSecurityService],
})
export class UsersModule {}
