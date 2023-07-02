import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthFacadeService } from '@fitness-tracker/auth/data';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import { Language, LANGUAGES_LABELS_LIST } from '@fitness-tracker/shared/utils';
import { filter, map, Observable } from 'rxjs';
import { LanguageCodes } from 'shared-package';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutUiComponent } from '../../../../ui/src/lib/layout-ui/layout-ui.component';

@Component({
    selector: 'ft-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        LayoutUiComponent,
        RouterOutlet,
        AsyncPipe,
    ],
})
export class LayoutComponent {
  public readonly isLoggedIn$: Observable<boolean> =
    this.authFacade.isLoggedIn$;
  public readonly isLoggedOut$: Observable<boolean> =
    this.authFacade.isLoggedOut$;
  public readonly photoUrl$: Observable<string | null> =
    this.authFacade.photoUrl$;
  public readonly language$: Observable<Language> =
    this.settingsFacade.language$.pipe(
      map((langCode: LanguageCodes) =>
        LANGUAGES_LABELS_LIST.find((lang) => langCode === lang.value),
      ),
      filter(Boolean),
    );
  public readonly isDarkMode$: Observable<boolean> =
    this.settingsFacade.isDarkMode$;

  constructor(
    private readonly authFacade: AuthFacadeService,
    private readonly settingsFacade: SettingsFacadeService,
  ) {}

  public logOut(): void {
    this.authFacade.logOut();
  }

  public selectLanguage(language: LanguageCodes): void {
    this.settingsFacade.selectLanguage(language);
  }

  public toggleDarkMode(): void {
    this.settingsFacade.toggleDarkMode();
  }
}
