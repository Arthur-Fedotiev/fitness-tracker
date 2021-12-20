import { Injectable } from '@angular/core';
import { ComponentNames, Locales } from '@fitness-tracker/shared/utils';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';
import { LanguageCodes } from 'shared-package';
import { darkModeChanged, languageSelected } from './actions/settings.actions';
import {
  selectIsDarkMode,
  selectLanguage,
  selectLocaleData,
} from './selectors/settings.selectors';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacadeService {
  public readonly selectLocaleData$: Observable<
    (component: ComponentNames) => Locales[ComponentNames] | null
  > = this.store.select(selectLocaleData).pipe(filter(Boolean));

  public readonly language$: Observable<LanguageCodes> =
    this.store.select(selectLanguage);

  public readonly isDarkMode$: Observable<boolean> =
    this.store.select(selectIsDarkMode);

  constructor(private readonly store: Store) {}

  public selectLanguage(payload: LanguageCodes) {
    this.store.dispatch(languageSelected({ payload }));
  }

  public toggleDarkMode() {
    this.store.dispatch(darkModeChanged());
  }
}
