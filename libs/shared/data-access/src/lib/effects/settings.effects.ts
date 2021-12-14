import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { SETTINGS_ACTIONS_NAMES } from '../actions/action-names.enum';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { LanguageCodes } from 'shared-package';

@Injectable()
export class SettingsEffects {
  public languageSelected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SETTINGS_ACTIONS_NAMES.LANGUAGE_SELECTED),
        tap(({ payload }: WithPayload<LanguageCodes>) =>
          localStorage.setItem('language', payload),
        ),
      ),
    { dispatch: false },
  );

  constructor(private actions$: Actions) {}
}
