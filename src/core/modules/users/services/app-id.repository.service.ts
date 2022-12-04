import { BaseRepository } from '@inspire/types';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserAppIdEntity } from '../entities/user-app-id.entity';

@Injectable()
export class AppIdRepositoryService implements BaseRepository<UserAppIdEntity> {
  constructor(private readonly appIdRepository: Repository<UserAppIdEntity>) {}

  add(appId: Partial<UserAppIdEntity>) {
    return this.appIdRepository.save(appId);
  }

  getByAppId(appId: number): Promise<UserAppIdEntity> {
    return this.appIdRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user', 'appUser')
      .where('user.appId = :appId', { appId })
      .getOne();
  }

  getByAppIdAndSocietyId(appId: number, societyId: string): Promise<UserAppIdEntity> {
    return this.appIdRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user', 'appUser')
      .leftJoinAndSelect('user.society', 'society')
      .where('user.appId = :appId', { appId })
      .andWhere('society.societyId = :societyId', { societyId })
      .getOne();
  }

  getByUserEmail(email: string): Promise<UserAppIdEntity[]> {
    return this.appIdRepository
      .createQueryBuilder('appId')
      .leftJoinAndSelect('appId.user', 'user')
      .where('user.email = :email', { email })
      .getMany();
  }

  getAllUsers(): Promise<UserAppIdEntity[]> {
    return this.appIdRepository
      .createQueryBuilder('appId')
      .leftJoinAndSelect('appId.user', 'user')
      .getMany();
  }

  getByUserEmailAndSocietyId(
    email: string,
    societyId: string,
  ): Promise<UserAppIdEntity> {
    return this.appIdRepository
      .createQueryBuilder('appId')
      .leftJoinAndSelect('appId.user', 'user')
      .leftJoinAndSelect('appId.society', 'society')
      .where('user.email = :email', { email })
      .andWhere('society.societyId = :societyId', { societyId })
      .getOne();
  }
}
