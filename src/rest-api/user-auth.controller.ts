import {
  CheckUserDto,
  SetPasswordDto,
  SignUpDto,
  SuccessSignInResponse,
} from '@inspire/types';
import {
  Body,
  Controller,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { AuthService } from '../core/auth/auth.service';
import {
  DeviceIdService,
} from '../core/modules/users/services/device-id.service';
import {
  UserSecurityService,
} from '../core/modules/users/services/user-security.service';
import { UsersService } from '../core/modules/users/services/users.service';

@Controller('user-auth')
export class UserAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly userSecurityService: UserSecurityService,
    private readonly deviceIdService: DeviceIdService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<SuccessSignInResponse> {
    return this.authService.login(req.user);
  }

  @Post('google-login')
  async googleLogin(@Body() body: any): Promise<SuccessSignInResponse> {
    const { token } = body;
    const { email } = await this.authService.googleLogin(token);
    return this.authService.loginOrCreateUser(email, token, true);
  }

  @Post('fb-login')
  async fbLogin(@Body() body: any): Promise<SuccessSignInResponse> {
    const { token } = body;
    const { email } = await this.authService.facebookLogin(token);
    return this.authService.loginOrCreateUser(email, token, false, true);
  }

  @Post('apple-login')
  async appleLogin(@Body() body: any): Promise<SuccessSignInResponse> {
    const {
      authResponse: { identityToken },
    } = body;
    return this.authService.appleLogin(identityToken);
  }

  @Post('check-user')
  async checkUser(
    @Body() body: CheckUserDto,
    @Res() res: Response,
  ): Promise<any> {
    const { email } = body;
    try {
      await this.usersService.checkUserExist(email);
    } catch(error) {
      throw new HttpException("", HttpStatus.UNAUTHORIZED);
    }
    try {
      await this.usersService.checkUserPasswordHasntSet(email);
    } catch(error) {
      throw new HttpException("", HttpStatus.PARTIAL_CONTENT);
    }
    return res.status(HttpStatus.OK).json({});
  }

  @Post('set-password')
  async setPassword(
    @Body() body: SetPasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password } = body;
    await this.usersService.checkUserExist(email);
    await this.usersService.checkUserPasswordHasntSet(email);
    await this.usersService.changePassword(password, email);
    const loginData = await this.authService.loginByEmail(email);
    return res.status(HttpStatus.OK).json(loginData);
  }

  @Post('signup')
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    const { email } = body;
    await this.usersService.checkUserDoesntExist(email);
    await this.usersService.signUp(body);
    const data = await this.authService.loginByEmail(body.email);
    return res.status(HttpStatus.OK).json(data);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: SetPasswordDto, @Res() res: Response) {
    const { email } = body;
    await this.userSecurityService.addResetPasswordRequest(email);
    return res.status(HttpStatus.OK).json({});
  }

  @Post('logout')
  async logout(@Body() body: { userId: number }, @Res() res: Response) {
    const { userId } = body;
    // TODO change to 'nsp' from api
    await this.deviceIdService.deleteDeviceByUserId(userId, 'nsp');
    return res.status(HttpStatus.OK).json({});
  }

  @Post('set-new-password')
  @Header('Access-Control-Allow-Origin', 'https://web.app-inspire.net')
  async setNewPassword(@Body() body, @Res() res: Response) {
    await this.userSecurityService.setNewPassword(body.uniqId, body.password);
    return res.status(HttpStatus.OK).json({});
  }

  @Post('check-reset-request')
  @Header('Access-Control-Allow-Origin', 'https://web.app-inspire.net')
  async checkRequest(@Body() body, @Res() res: Response) {
    await this.userSecurityService.checkRequestIsValid(body.uniqId);
    return res.status(HttpStatus.OK).json({});
  }
}
