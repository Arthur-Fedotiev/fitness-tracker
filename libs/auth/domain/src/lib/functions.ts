import { User } from '@angular/fire/auth';
import { UserInfo } from './application/models';

export const toUserInfo = (user: User) =>
  ({
    displayName: user.displayName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    providerId: user.providerId,
    uid: user.uid,
  } as UserInfo);
