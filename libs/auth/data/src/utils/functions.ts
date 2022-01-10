import { UserInfo } from '@fitness-tracker/auth/model'

export const toUserInfo = (user: UserInfo | null) => (!user ? null : {
  displayName: user.displayName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  photoURL: user.photoURL,
  providerId: user.providerId, uid: user.uid
})
