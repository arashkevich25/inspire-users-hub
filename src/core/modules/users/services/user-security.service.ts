import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BasicStreamModel } from '../../../models/basic-stream.model';
import {
  UserSecurityRepositoryService,
} from './user-security.repository.service';
import { UsersService } from './users.service';

import {
  UserResetPasswordStorageEntity,
} from '../entities/user-reset-password-storage.entity';

// tslint:disable-next-line:no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqid = require('uniqid');

@Injectable()
export class UserSecurityService extends UserSecurityRepositoryService {
  constructor(
    @InjectRepository(UserResetPasswordStorageEntity)
    resetPasswordRepository: Repository<UserResetPasswordStorageEntity>,
    private readonly usersService: UsersService,
  ) {
    super(resetPasswordRepository);
  }

  async addResetPasswordRequest(email: string): Promise<void> {
    const uniqId = uniqid();
    const user = await this.usersService.getByEmailAuth(email);
    await this.removeResetPasswordRequestByEmail(email);
    await this.add({ email, uniqId });
    BasicStreamModel.resetPassword(user.defaultSociety, email, uniqId);
  }

  async setNewPassword(uniqId: string, password: string): Promise<void> {
    const request = await this.getByUniqIdResetPassword(uniqId);
    await this.usersService.changePassword(password, request.email);
    await this.removeResetPasswordRequestByEmail(request.email);
  }

  async checkRequestIsValid(uniqId: string): Promise<void> {
    const requestIsValid = await this.checkRecordByUniqId(uniqId);
    if (!requestIsValid) {
      throw new HttpException('Password has no set', HttpStatus.BAD_REQUEST);
    }
  }
}
