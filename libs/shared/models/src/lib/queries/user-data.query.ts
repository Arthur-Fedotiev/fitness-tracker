import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserDataQuery {
  isAdmin$: Observable<boolean>;
}

export const USER_DATA_QUERY_TOKEN = new InjectionToken<UserDataQuery>(
  'UserDataQuery provider',
);
