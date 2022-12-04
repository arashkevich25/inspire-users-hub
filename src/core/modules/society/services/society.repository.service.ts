import { BaseRepository } from '@inspire/types';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { SocietiesEntity } from '../entities/society.entity';

@Injectable()
export class SocietyRepositoryService
  implements BaseRepository<SocietiesEntity> {
  constructor(
    private readonly societyRepository: Repository<SocietiesEntity>,
  ) {}

  add(society: Partial<SocietiesEntity>): Promise<SocietiesEntity> {
    return this.societyRepository.save(society);
  }

  getById(societyId: string): Promise<SocietiesEntity> {
    return this.societyRepository
      .createQueryBuilder('society')
      .where('society.societyId = :societyId', { societyId })
      .getOne();
  }

  getFirstSociety(): Promise<SocietiesEntity> {
    return this.societyRepository
      .createQueryBuilder('society')
      .orderBy('society.id', 'ASC')
      .getOne();
  }
}
