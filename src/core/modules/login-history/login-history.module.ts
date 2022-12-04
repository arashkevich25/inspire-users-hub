import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginHistoryEntity } from './entities/login-history.entity';
import { LoginHistoryService } from './services/login-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoginHistoryEntity])],
  providers: [LoginHistoryService],
  exports: [LoginHistoryService],
})
export class LoginHistoryModule {}
