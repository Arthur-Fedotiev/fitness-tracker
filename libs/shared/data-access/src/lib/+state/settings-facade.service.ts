import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { darkModeChanged } from './actions/settings.actions';
import { selectIsDarkMode } from './selectors/settings.selectors';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacadeService {
  private readonly store = inject(Store);

  public readonly isDarkMode$: Observable<boolean> =
    this.store.select(selectIsDarkMode);

  public toggleDarkMode() {
    this.store.dispatch(darkModeChanged());
  }
}
