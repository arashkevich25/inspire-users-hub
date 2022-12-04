import { ResponseCodes, SuccessSignInResponse } from '@inspire/types';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AxiosResponse } from 'axios';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

import { BasicStreamModel } from '../models';

import appleSignin from 'apple-signin-auth';
import {
  FacebookAuthResponse,
} from '../interfaces/facebook-auth-response.interface';
import {
  GoogleAuthResponse,
} from '../interfaces/google-auth-reponse.interface';
import {
  LoginHistoryService,
} from '../modules/login-history/services/login-history.service';
import { SocietyService } from '../modules/society/services/society.service';
import { UsersService } from '../modules/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly loginHistoryService: LoginHistoryService,
    private readonly societyService: SocietyService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getByEmailAuth(email);

    if (!user) {
      throw new HttpException("User doesn't exist", HttpStatus.UNAUTHORIZED);
    }
    const res = await bcrypt.compare(pass, user.password);

    if (!res) {
      throw new HttpException(
        'Login or password not match',
        HttpStatus.UNAUTHORIZED,
      );
    }
    delete user.password;
    return user;
  }

  async loginByEmail(email: string): Promise<SuccessSignInResponse> {
    const user = await this.usersService.getByEmail(email);
    return this.login(user);
  }

  async login(user: any): Promise<SuccessSignInResponse> {
    const payload = { id: user.id };
    const userId = [];
    for (const userAppId of user.appId) {
      const { appId, society } = userAppId;
      const isFirstLogin = await this.loginHistoryService.isFirstLogin(
        appId,
        society.societyId,
      );
      userId.push({
        appId,
        isFirstLogin,
        society: society.societyId,
      });
      payload[society.societyId] = appId;
    }
    return {
      access_token: this.jwtService.sign(payload),
      statusCode: ResponseCodes.Success,
      userId,
      email: user.email,
      defaultSociety: user.defaultSociety,
      societies: user.societies.map((society) => ({
        id: society.societyId,
        api: society.api,
        name: society.name,
      })),
    };
  }

  async loginOrCreateUser(
    email,
    token,
    googleUser = false,
    facebookUser = false,
    appleUser = false,
  ): Promise<SuccessSignInResponse> {
    let user = await this.usersService.getByEmail(email);
    if (user) {
      return this.login(user);
    }
    const firstSociety = await this.societyService.getFirstSociety();
    const { id: userId } = await this.usersService.createUser({
      email,
      password: token,
      googleUser,
      facebookUser,
      appleUser,
      defaultSociety: firstSociety.societyId,
      societies: [firstSociety],
    });
    const updateUser$ = BasicStreamModel.applyNewUser(firstSociety.societyId, userId, email);
    await firstValueFrom(updateUser$);
    user = await this.usersService.getByEmailAuth(email);
    return this.login(user);
  }

  async googleLogin(token: string): Promise<GoogleAuthResponse> {
    const response: AxiosResponse<GoogleAuthResponse> = await this.httpService
      .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
      .toPromise();

    if (response.status !== HttpStatus.OK) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    return response.data;
  }

  async facebookLogin(token: string): Promise<FacebookAuthResponse> {
    const response: AxiosResponse<FacebookAuthResponse> = await this.httpService
      .get<FacebookAuthResponse>(
        `https://graph.facebook.com/me?fields=email,name&access_token=${token}`,
      )
      .toPromise();

    if (!response.data.email) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    return response.data;
  }

  async appleLogin(token: string): Promise<any> {
    try {
      const { sub: userAppleId, email } = await appleSignin.verifyIdToken(
        token,
        {
          audience: 'org.arrit.be.nspired',
          ignoreExpiration: true,
        },
      );
      return this.loginOrCreateUser(email, userAppleId, false, false, true);
    } catch (err) {
      return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
