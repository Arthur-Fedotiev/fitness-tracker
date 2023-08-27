import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { first, mapTo, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { SETTINGS_ACTIONS_NAMES } from '../actions/action-names.enum';
import { LanguageCodes } from 'shared-package';
import { Store } from '@ngrx/store';
import { StyleManagerService } from '../../services/style-manager.service';
import {
  selectIsDarkMode,
  selectLanguage,
} from '../selectors/settings.selectors';
import { getIsDarkMode } from '../../utils/functions';
import { DARK_MODE_STORAGE_KEY } from '../../models/theme';
import { TranslateService } from '@ngx-translate/core';
import { LANG_STORAGE_KEY } from '@fitness-tracker/shared/i18n/utils';

@Injectable()
export class SettingsEffects {
  public loadInitialTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        mapTo(getIsDarkMode()),
        tap((isDarkMode: boolean) => {
          this.styleManager.toggleDarkMode(isDarkMode);
        }),
      ),
    { dispatch: false },
  );

  public setInitialLanguage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        switchMapTo(
          this.store.select(selectLanguage).pipe(
            tap((language: LanguageCodes) => {
              this.translateService.use(language);
            }),
            first(),
          ),
        ),
      ),

    { dispatch: false },
  );

  public languageSelected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SETTINGS_ACTIONS_NAMES.LANGUAGE_SELECTED),
        tap(({ payload }: WithPayload<LanguageCodes>) =>
          localStorage.setItem(LANG_STORAGE_KEY, payload),
        ),
        tap(({ payload }: WithPayload<LanguageCodes>) =>
          this.translateService.use(payload),
        ),
      ),
    { dispatch: false },
  );

  public darkModeChanged = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SETTINGS_ACTIONS_NAMES.DARK_MODE_CHANGED),
        withLatestFrom(this.store.select(selectIsDarkMode)),
        tap(([_, isDarkMode]) =>
          localStorage.setItem(
            DARK_MODE_STORAGE_KEY,
            JSON.stringify(isDarkMode),
          ),
        ),
        tap(([_, isDarkMode]) => {
          this.styleManager.toggleDarkMode(isDarkMode);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly styleManager: StyleManagerService,
    private readonly store: Store,
    private readonly translateService: TranslateService,
  ) {}
}
