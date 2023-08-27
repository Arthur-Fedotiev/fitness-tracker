import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthFacadeService } from '@fitness-tracker/auth/domain';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import { filter, map } from 'rxjs';
import { LanguageCodes } from 'shared-package';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutUiComponent } from '@fitness-tracker/layout/ui';
import { LANGUAGES_LABELS_LIST } from '@fitness-tracker/shared/i18n/utils';

@Component({
  selector: 'ft-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LayoutUiComponent, RouterOutlet, AsyncPipe],
})
export class LayoutComponent {
  public readonly isLoggedIn$ = this.authFacade.isLoggedIn$;
  public readonly isLoggedOut$ = this.authFacade.isLoggedOut$;
  public readonly photoUrl$ = this.authFacade.photoUrl$;
  public readonly language$ = this.settingsFacade.language$.pipe(
    map((langCode: LanguageCodes) =>
      LANGUAGES_LABELS_LIST.find((lang) => langCode === lang.value),
    ),
    filter(Boolean),
  );
  public readonly isDarkMode$ = this.settingsFacade.isDarkMode$;

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
