import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { LANG_STORAGE_KEY, WithPayload } from '@fitness-tracker/shared/utils';
import { SETTINGS_ACTIONS_NAMES } from '../actions/action-names.enum';

@Injectable()
export class SettingsEffects {
  public languageSelected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SETTINGS_ACTIONS_NAMES.LANGUAGE_SELECTED),
        tap(({ payload }: WithPayload<tempLang>) =>
          localStorage.setItem(LANG_STORAGE_KEY, payload),
        ),
      ),
    { dispatch: false },
  );
  constructor(private actions$: Actions) {}
}

export type tempLang = 'en' | 'ru';
