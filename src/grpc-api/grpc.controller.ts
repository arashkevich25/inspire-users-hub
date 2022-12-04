import {
  AddDeviceIdDto,
  ProtoBasicStreamMessage,
  SocietyInterface,
  UserAuthDto,
} from '@inspire/types';
import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';

import { GrpcService } from './grpc.service';

import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { AuthService } from '../core/auth/auth.service';
import { BasicStreamModel } from '../core/models';
import {
  SocietyService,
} from '../core/modules/society/services/society.service';
import { AppIdService } from '../core/modules/users/services/app-id.service';
import {
  DeviceIdService,
} from '../core/modules/users/services/device-id.service';

@Controller('')
export class GrpcController {
  constructor(
    private readonly grpcService: GrpcService,
    private readonly societyService: SocietyService,
    private readonly authService: AuthService,
    private readonly deviceIdService: DeviceIdService,
    private readonly appIdService: AppIdService,
  ) {}

  @GrpcStreamMethod('GlobalStream', 'BasicChanel')
  basicChanel(
    messages: Observable<ProtoBasicStreamMessage<string>>,
  ): Observable<ProtoBasicStreamMessage<string>> {
    messages.subscribe({
      next: (message: ProtoBasicStreamMessage<string>) => this.grpcService.switcher(message),
    });
    return BasicStreamModel.basicStreamOutputSubject.asObservable();
  }

  @GrpcMethod('UserAuth', 'ValidateUser')
  async getByEmailAuth(data: UserAuthDto) {
    const user = await this.authService.validateUser(data.email, data.password);
    const loggedUserRaw = await this.authService.login(user);
    const loggedUser = {
      ...loggedUserRaw,
      id: loggedUserRaw.userId.filter(
        (userId) => userId.society === data.societyId,
      )[0].appId,
    };
    return loggedUser;
  }

  @GrpcMethod('Global', 'SetSociety')
  async setSociety(data: SocietyInterface) {
    const society = await this.societyService.getById(data.id);
    if (!society) {
      await this.societyService.add({
        societyId: data.id,
        api: data.api,
        name: data.name,
      });
    }

    return {};
  }

  @GrpcMethod('Global', 'AddUserDevice')
  addUserDevice(data: AddDeviceIdDto) {
    return this.deviceIdService.createOrUpdate(data);
  }

  @GrpcMethod('Global', 'GetUsersDeviceId')
  getUsersDeviceId(data: any) {
    return this.deviceIdService.getByUserIds(data.userId);
  }

  @GrpcMethod('Global', 'GetUserDevice')
  async getUserDevice(data: any) {
    const { user } = await this.appIdService.getByAppId(data.userId);
    return this.deviceIdService.getDevice(user.id);
  }
}
