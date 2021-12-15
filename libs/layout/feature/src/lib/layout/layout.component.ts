import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthFacadeService } from '@fitness-tracker/auth/data';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import {
  ComponentNames,
  Language,
  LANGUAGES_LABELS_LIST,
  Locales,
} from '@fitness-tracker/shared/utils';
import { filter, map, Observable, tap } from 'rxjs';
import { LanguageCodes } from 'shared-package';

@Component({
  selector: 'ft-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  public readonly isLoggedIn$: Observable<boolean> =
    this.authFacade.isLoggedIn$;
  public readonly isLoggedOut$: Observable<boolean> =
    this.authFacade.isLoggedOut$;
  public readonly photoUrl$: Observable<string | null> =
    this.authFacade.photoUrl$;
  public readonly navigationBarLocaleData$: Observable<
    Locales[ComponentNames.NavigationBarComponent]
  > = this.settingsFacade.selectLocaleData$.pipe(
    map((selectFn) => selectFn(ComponentNames.NavigationBarComponent)),
    filter(Boolean),
  );
  public readonly language$: Observable<Language> =
    this.settingsFacade.language$.pipe(
      map((langCode) =>
        LANGUAGES_LABELS_LIST.find((lang) => langCode === lang.value),
      ),
      filter(Boolean),
    );

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
}
