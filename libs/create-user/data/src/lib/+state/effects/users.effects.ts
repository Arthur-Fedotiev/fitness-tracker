import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as UsersActions from '../actions/users.actions';
import { USERS_ACTION_NAMES } from '../models/action-names.enums';
import { User } from '@fitness-tracker/create-user/models';
import { UsersService } from '../../services/create-user.service';
import { WithPayload } from '@fitness-tracker/shared/utils';

@Injectable()
export class UsersEffects {
  public createUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(USERS_ACTION_NAMES.CREATE_USER),
      mergeMap(({ payload }: WithPayload<User>) =>
        this.usersService.createUser(payload).pipe(
          map((payload: number) => UsersActions.createUserSuccess({ payload })),
          catchError(() => of(UsersActions.createUserFailure())),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private readonly usersService: UsersService,
  ) {}
}
