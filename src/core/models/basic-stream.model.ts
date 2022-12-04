import {
  ProtoBasicStreamChanelMessageKinds,
  ProtoBasicStreamMessage,
} from '@inspire/types';
import { Observable, Subject } from 'rxjs';

export class BasicStreamModel {
  static basicStreamOutputSubject = new Subject<
    ProtoBasicStreamMessage<string>
  >();
  static basicStreamUpdateUserSubject = new Subject<any>();

  static applyNewUser(
    societyId: string,
    hubId: number,
    email: string,
  ): Observable<any> {
    BasicStreamModel.basicStreamOutputSubject.next({
      kind: ProtoBasicStreamChanelMessageKinds.CreateAppUser,
      societyId,
      message: JSON.stringify({ hubId, email }),
    });
    return BasicStreamModel.basicStreamUpdateUserSubject;
  }

  static resetPassword(
    societyId: string,
    email: string,
    uniqueId: string,
  ): void {
    BasicStreamModel.basicStreamOutputSubject.next({
      kind: ProtoBasicStreamChanelMessageKinds.ResetUserPassword,
      societyId,
      message: JSON.stringify({ email, uniqueId }),
    });
  }

  static exportUserToMailchimp(
    societyId: string,
    email: string,
    userId: number,
  ): void {
    BasicStreamModel.basicStreamOutputSubject.next({
      kind: ProtoBasicStreamChanelMessageKinds.ExportUsersToMailChimp,
      societyId,
      message: JSON.stringify({ email, userId }),
    });
  }
}
