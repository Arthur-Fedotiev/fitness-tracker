import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LanguageCodes } from 'shared-package';
import { darkModeChanged, languageSelected } from './actions/settings.actions';
import {
  selectIsDarkMode,
  selectLanguage,
} from './selectors/settings.selectors';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacadeService {
  private readonly store = inject(Store);

  public readonly language$: Observable<LanguageCodes> =
    this.store.select(selectLanguage);

  public readonly isDarkMode$: Observable<boolean> =
    this.store.select(selectIsDarkMode);

  public selectLanguage(payload: LanguageCodes) {
    this.store.dispatch(languageSelected({ payload }));
  }

  public toggleDarkMode() {
    this.store.dispatch(darkModeChanged());
  }
}
