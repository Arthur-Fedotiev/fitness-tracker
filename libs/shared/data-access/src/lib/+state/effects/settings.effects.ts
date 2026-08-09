import { Injectable, inject } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { mapTo, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SETTINGS_ACTIONS_NAMES } from '../actions/action-names.enum';
import { StyleManagerService } from '../../services/style-manager.service';
import { selectIsDarkMode } from '../selectors/settings.selectors';
import { getIsDarkMode } from '../../utils/functions';
import { DARK_MODE_STORAGE_KEY } from '../../models/theme';

@Injectable()
export class SettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly styleManager = inject(StyleManagerService);
  private readonly store = inject(Store);

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
}
