import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FirebaseUISignInFailure, FirebaseUIModule } from 'firebaseui-angular';
import { AuthFacadeService } from '@fitness-tracker/auth/data';
import { StyleManagerService } from '@fitness-tracker/shared/data-access';
import { MatIconModule } from '@angular/material/icon';

const FIREBASE_UI_STYLESHEET = 'firebase-ui.css';

@Component({
  selector: 'ft-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule, FirebaseUIModule],
})
export class AuthComponent implements OnInit {
  constructor(
    private readonly authFacade: AuthFacadeService,
    private readonly styleManager: StyleManagerService,
  ) {}

  ngOnInit(): void {
    this.styleManager.loadStylesheet(FIREBASE_UI_STYLESHEET);
  }

  errorCallback(_: FirebaseUISignInFailure): void {
    this.authFacade.loginErrored();
  }
}
