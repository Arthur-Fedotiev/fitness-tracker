import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { AuthFacadeService } from '@fitness-tracker/auth/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'ft-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  public readonly isLoggedIn$: Observable<boolean> = this.authFacade.isLoggedIn$;
  public readonly isLoggedOut$: Observable<boolean> = this.authFacade.isLoggedOut$;
  public readonly photoUrl$: Observable<string | null> = this.authFacade.photoUrl$;

  constructor(private authFacade: AuthFacadeService) { }

  public logOut(): void {
    this.authFacade.logOut();
  }
}
