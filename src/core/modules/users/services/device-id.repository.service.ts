import { BaseRepository } from '@inspire/types';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserDeviceIdEntity } from '../entities/user-device-id.entity';

@Injectable()
export class DeviceIdRepositoryService
  implements BaseRepository<UserDeviceIdEntity> {
  constructor(
    private readonly deviceIdRepository: Repository<UserDeviceIdEntity>,
  ) {}

  add(device: Partial<UserDeviceIdEntity>): Promise<UserDeviceIdEntity> {
    return this.deviceIdRepository.save(device);
  }

  delete(userId: number) {
    return this.deviceIdRepository
      .createQueryBuilder('deviceId')
      .leftJoin('deviceId.user', 'user')
      .delete()
      .where('user.id = :userId', { userId })
      .execute();
  }

  getAll(): Promise<any> {
    return this.deviceIdRepository
      .createQueryBuilder('deviceId')
      .leftJoinAndSelect('deviceId.user', 'user')
      .getMany();
  }

  remove(userId: number): Promise<any> {
    return this.deviceIdRepository
      .createQueryBuilder('deviceId')
      .delete()
      .where('user.id = :userId', { userId })
      .execute();
  }

  getByUserId(userId: number): Promise<UserDeviceIdEntity> {
    return this.deviceIdRepository
      .createQueryBuilder('deviceId')
      .leftJoinAndSelect('deviceId.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  getByUserIds(ids: number[]): Promise<UserDeviceIdEntity[]> {
    return this.deviceIdRepository
      .createQueryBuilder('deviceId')
      .leftJoinAndSelect('deviceId.user', 'user')
      .where('user.id IN (:ids)', { ids })
      .getMany();
  }

  update(deviceId: UserDeviceIdEntity): Promise<any> {
    return this.deviceIdRepository
      .createQueryBuilder('deviceId')
      .leftJoin('deviceId.user', 'user')
      .update()
      .set(deviceId)
      .where('user.id = :id', { id: deviceId.user.id })
      .execute();
  }
}
