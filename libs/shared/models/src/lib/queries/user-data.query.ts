import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserDataQuery {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  photoUrl$: Observable<string | null>;
  destinationUrl$: Observable<string>;
  authJwtToken$: Observable<string | null>;
  isAdmin$: Observable<boolean>;
}

export const USER_DATA_QUERY_TOKEN = new InjectionToken<UserDataQuery>(
  'UserDataQuery provider',
);
