import { map, pipe, pluck } from 'rxjs';
import { AngularFireAuthGuard, customClaims, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const adminOnly = () => pipe(customClaims, pluck('admin'), map(Boolean));

export const canActivateAdmin = {
  canActivate: [AngularFireAuthGuard],
  data: {
    authGuardPipe: adminOnly
  },
};

export const canActivateAuthorized = {
  canActivate: [AngularFireAuthGuard],
  data: {
    authGuardPipe: redirectUnauthorizedToLogin
  },
}
