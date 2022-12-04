import { BaseRepository } from '@inspire/types';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UsersRepositoryService implements BaseRepository<UsersEntity> {
  constructor(private readonly userRepository: Repository<UsersEntity>) {}

  add(userData: Partial<UsersEntity>): Promise<UsersEntity> {
    return this.userRepository.save(userData);
  }

  getByEmailAuth(email: string): Promise<UsersEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.societies', 'societies')
      .leftJoinAndSelect('user.appId', 'appId')
      .leftJoinAndSelect('appId.society', 'appIdSociety')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  getByEmail(email: string): Promise<UsersEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.societies', 'societies')
      .leftJoinAndSelect('user.appId', 'appId')
      .leftJoinAndSelect('appId.society', 'appIdSociety')
      .where('user.email = :email', { email })
      .getOne();
  }

  getByAppId(id: number, society: string): Promise<UsersEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.appId', 'appId')
      .leftJoinAndSelect('appId.society', 'society')
      .where('appId.appId = :id', { id })
      .andWhere('society.societyId = :society', { society })
      .getOne();
  }

  getById(id: number): Promise<UsersEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }
}
