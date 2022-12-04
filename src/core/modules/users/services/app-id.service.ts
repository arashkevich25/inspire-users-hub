import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppIdRepositoryService } from './app-id.repository.service';

import { UserAppIdEntity } from '../entities/user-app-id.entity';

@Injectable()
export class AppIdService extends AppIdRepositoryService {
  constructor(
    @InjectRepository(UserAppIdEntity)
    appIdRepository: Repository<UserAppIdEntity>,
  ) {
    super(appIdRepository);
  }
}
