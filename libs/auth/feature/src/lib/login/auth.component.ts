import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FirebaseUISignInFailure } from 'firebaseui-angular';
import { AuthFacadeService } from '@fitness-tracker/auth/data';
@Component({
  selector: 'fitness-tracker-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  constructor(private readonly authFacade: AuthFacadeService) {
  }

  errorCallback(_: FirebaseUISignInFailure): void {
    this.authFacade.loginErrored();
  }
}
