import {
  ProtoBasicStreamChanelMessageKinds,
  ProtoBasicStreamMessage,
} from '@inspire/types';
import { Injectable, Logger } from '@nestjs/common';

import { BasicStreamModel } from '../core/models/basic-stream.model';
import {
  SocietyService,
} from '../core/modules/society/services/society.service';
import { AppIdService } from '../core/modules/users/services/app-id.service';
import { UsersService } from '../core/modules/users/services/users.service';

const logger = new Logger('SWITCHER');;

@Injectable()
export class GrpcService {
  constructor(
    private readonly usersService: UsersService,
    private readonly societyService: SocietyService,
    private readonly appIdService: AppIdService,
  ) {}

  async switcher(message: ProtoBasicStreamMessage<string>): Promise<void> {
    switch (message.kind) {
      case ProtoBasicStreamChanelMessageKinds.UpdateUserId: {
        const society = await this.societyService.getById(message.societyId);
        const { hubId, userId } = JSON.parse(message.message);
        const user = await this.usersService.getById(hubId);
        const userById = await this.appIdService.getByAppId(userId);
        if (userById) {
          return;
        }
        const addedUserId = await this.appIdService.add({
          user,
          society,
          appId: userId,
        });
        BasicStreamModel.basicStreamUpdateUserSubject.next(addedUserId.appId);
        logger.log('Message - UpdateUserId');
        break;
      }
      case ProtoBasicStreamChanelMessageKinds.UpdateUserData: {
        const society = await this.societyService.getById(message.societyId);
        const { userId } = JSON.parse(message.message);
        const userById = await this.appIdService.getByAppId(userId);
        const user = await this.usersService.getById(userById.user.id);
        logger.log('Message - UpdateUserData');
        BasicStreamModel.exportUserToMailchimp(society.societyId, user.email, userId);
        break;
      }
      default: {
      }
    }
  }
}
