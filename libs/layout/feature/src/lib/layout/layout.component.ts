import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { AuthFacadeService } from '@fitness-tracker/auth/data';
import { isNotNill } from '@fitness-tracker/shared/utils';
import { Observable, filter } from 'rxjs';

@Component({
  selector: 'fitness-tracker-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  public readonly isLoggedIn$: Observable<boolean> = this.authFacade.isLoggedIn$;
  public readonly isLoggedOut$: Observable<boolean> = this.authFacade.isLoggedOut$;

  constructor(private authFacade: AuthFacadeService) { }

  ngOnInit(): void {
  }

  public logOut(): void {
    this.authFacade.logOut();
  }

}
