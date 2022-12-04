import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocietiesEntity } from './entities/society.entity';
import { SocietyService } from './services/society.service';

@Module({
  imports: [TypeOrmModule.forFeature([SocietiesEntity])],
  providers: [SocietyService],
  exports: [SocietyService],
})
export class SocietyModule {}
