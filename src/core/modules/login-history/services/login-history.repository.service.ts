import { BaseRepository } from '@inspire/types';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { LoginHistoryEntity } from '../entities/login-history.entity';

@Injectable()
export class LoginHistoryRepositoryService
  implements BaseRepository<LoginHistoryEntity> {
  constructor(
    private readonly loginHistoryRepository: Repository<LoginHistoryEntity>,
  ) {}

  add(item: Partial<LoginHistoryEntity>): Promise<LoginHistoryEntity> {
    return this.loginHistoryRepository.save(item);
  }

  getByUserIdAndSocietyIdCount(
    userId: number,
    societyId: string,
  ): Promise<number> {
    return this.loginHistoryRepository
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.user', 'user')
      .leftJoinAndSelect('user.appId', 'appId')
      .leftJoinAndSelect('user.societies', 'userSocieties')
      .leftJoinAndSelect('history.society', 'society')
      .where('appId.appId = :userId', { userId })
      .andWhere('userSocieties.societyId = :societyId', { userId })
      .andWhere('society.societyId = :societyId', { societyId })
      .getCount();
  }
}
