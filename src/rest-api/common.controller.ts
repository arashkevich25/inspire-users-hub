import { AddUserDto, LoginHistoryDto } from '@inspire/types';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { BasicStreamModel } from '../core/models';
import {
  LoginHistoryService,
} from '../core/modules/login-history/services/login-history.service';
import {
  SocietyService,
} from '../core/modules/society/services/society.service';
import { AppIdService } from '../core/modules/users/services/app-id.service';
import { UsersService } from '../core/modules/users/services/users.service';

@Controller('')
export class CommonController {
  constructor(
    private readonly loginHistoryService: LoginHistoryService,
    private readonly usersService: UsersService,
    private readonly societyService: SocietyService,
    private readonly appIdService: AppIdService,
  ) {}

  @Post('add-user')
  async addUser(@Body() body: AddUserDto, @Res() res: Response) {
    await this.usersService.checkUserDoesntExist(body.email);
    const society = await this.societyService.checkSocietyExist(body.society);
    const user = await this.usersService.createUser({
      email: body.email,
      facebookUser: false,
      appleUser: false,
      googleUser: false,
      defaultSociety: body.society,
      isBlocked: false,
      societies: [society],
    });
    await BasicStreamModel.applyNewUser(society.societyId, user.id, body.email);
    return res.status(HttpStatus.CREATED).send('Added');
  }

  @Post('login-history')
  async addLoginHistory(@Body() body: LoginHistoryDto) {
    const user = await this.usersService.getByAppId(body.userId, body.society);
    const society = await this.societyService.getById(body.society);
    return this.loginHistoryService.add({ user, society });
  }
}
