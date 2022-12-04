import { SignUpDto } from '@inspire/types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { BasicStreamModel } from '../../../models/basic-stream.model';
import { UsersRepositoryService } from './users.repository.service';

import { SocietyService } from '../../society/services/society.service';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UsersService extends UsersRepositoryService {
  constructor(
    @InjectRepository(UsersEntity)
    userRepository: Repository<UsersEntity>,
    private readonly societyService: SocietyService,
  ) {
    super(userRepository);
  }

  async createUser(userData: Partial<UsersEntity>): Promise<UsersEntity> {
    if (!userData.password) {
      return this.add({
        id: null,
        ...userData,
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(userData.password, salt);

    return this.add({
      id: null,
      ...userData,
      password,
    });
  }

  async signUp(data: SignUpDto): Promise<UsersEntity> {
    const firstSociety = await this.societyService.getFirstSociety();
    const user = await this.createUser({
      email: data.email,
      password: data.password,
      googleUser: false,
      facebookUser: false,
      appleUser: false,
      appId: [],
      defaultSociety: firstSociety.societyId,
      societies: [firstSociety],
    });
    const updateUser$ = BasicStreamModel.applyNewUser(
      firstSociety.societyId,
      user.id,
      data.email,
    );
    await firstValueFrom(updateUser$);
    return user;
  }

  async changePassword(password: string, email: string) {
    const salt = bcrypt.genSaltSync(10);
    const newPassword = bcrypt.hashSync(password, salt);
    const user = await this.getByEmail(email);
    await this.add({
      ...user,
      password: newPassword,
    });
  }

  async checkUserDoesntExist(email: string) {
    const user = await this.getByEmail(email);
    if (user) {
      throw new HttpException('User exist', HttpStatus.CONFLICT);
    }
  }

  async checkUserExist(email: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST);
    }
  }

  async checkUserPasswordHasSet(email: string) {
    const user = await this.getByEmail(email);
    if (!user.password) {
      throw new HttpException('Password has no set', HttpStatus.BAD_REQUEST);
    }
  }

  async checkUserPasswordHasntSet(email: string) {
    const user = await this.getByEmail(email);
    if (user.password) {
      throw new HttpException('Password has set', HttpStatus.BAD_REQUEST);
    }
  }
}
