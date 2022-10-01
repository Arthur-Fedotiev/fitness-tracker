import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IsLoadingQuery {
  isLoading$: Observable<boolean>;
}

export const IS_LOADING_QUERY = new InjectionToken<IsLoadingQuery>(
  'IsLoadingQuery',
);
