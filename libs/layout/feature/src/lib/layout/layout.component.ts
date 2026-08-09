import { Component, ViewEncapsulation, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthFacadeService } from '@fitness-tracker/auth/domain';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutUiComponent } from '@fitness-tracker/layout/ui';

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
  private readonly authFacade = inject(AuthFacadeService);
  private readonly settingsFacade = inject(SettingsFacadeService);

  public readonly isLoggedIn$ = this.authFacade.isLoggedIn$;
  public readonly isLoggedOut$ = this.authFacade.isLoggedOut$;
  public readonly photoUrl$ = this.authFacade.photoUrl$;
  public readonly isDarkMode$ = this.settingsFacade.isDarkMode$;

  public logOut(): void {
    this.authFacade.logOut();
  }

  public toggleDarkMode(): void {
    this.settingsFacade.toggleDarkMode();
  }
}
