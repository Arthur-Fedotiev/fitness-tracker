import firebase from 'firebase/compat';

export const toUserInfo = (user: firebase.UserInfo | null) => (!user ? null : {
  displayName: user.displayName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  photoURL: user.photoURL,
  providerId: user.providerId, uid: user.uid
})
