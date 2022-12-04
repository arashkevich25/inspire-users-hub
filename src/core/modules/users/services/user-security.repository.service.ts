import { BaseRepository } from '@inspire/types';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import {
  UserResetPasswordStorageEntity,
} from '../entities/user-reset-password-storage.entity';

@Injectable()
export class UserSecurityRepositoryService
  implements BaseRepository<UserResetPasswordStorageEntity> {
  constructor(
    private readonly resetPasswordRepository: Repository<
      UserResetPasswordStorageEntity
    >,
  ) {}

  add(
    data: Partial<UserResetPasswordStorageEntity>,
  ): Promise<UserResetPasswordStorageEntity> {
    return this.resetPasswordRepository.save(data);
  }

  removeResetPasswordRequestByEmail(email: string) {
    return this.resetPasswordRepository
      .createQueryBuilder('resetPasswordStorage')
      .delete()
      .where('email = :email', { email })
      .execute();
  }

  getByUniqIdResetPassword(uniqId): Promise<UserResetPasswordStorageEntity> {
    return this.resetPasswordRepository.findOne({
      where: { uniqId },
    });
  }

  async checkRecordByUniqId(uniqId: string): Promise<boolean> {
    return (
      (await this.resetPasswordRepository
        .createQueryBuilder('reset')
        .where('reset.uniqId = :uniqId', { uniqId })
        .getCount()) > 0
    );
  }
}
