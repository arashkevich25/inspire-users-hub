import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocietyRepositoryService } from './society.repository.service';

import { SocietiesEntity } from '../entities/society.entity';

@Injectable()
export class SocietyService extends SocietyRepositoryService {
  constructor(
    @InjectRepository(SocietiesEntity)
    societyRepository: Repository<SocietiesEntity>,
  ) {
    super(societyRepository);
  }

  async checkSocietyExist(societyId: string): Promise<SocietiesEntity> {
    const society = await this.getById(societyId);
    if (!society) {
      throw new HttpException('Society doesnt exist', HttpStatus.BAD_REQUEST);
    }
    return society;
  }
}
