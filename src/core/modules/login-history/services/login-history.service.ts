import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  LoginHistoryRepositoryService,
} from './login-history.repository.service';

import { LoginHistoryEntity } from '../entities/login-history.entity';

@Injectable()
export class LoginHistoryService extends LoginHistoryRepositoryService {
  constructor(
    @InjectRepository(LoginHistoryEntity)
    loginHistoryRepository: Repository<LoginHistoryEntity>,
  ) {
    super(loginHistoryRepository);
  }

  async isFirstLogin(userId: number, societyId: string): Promise<boolean> {
    const count = await this.getByUserIdAndSocietyIdCount(userId, societyId);
    return !count;
  }
}
