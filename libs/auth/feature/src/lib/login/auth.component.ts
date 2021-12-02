import { Component, ChangeDetectionStrategy, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import { AuthFacadeService } from '@fitness-tracker/auth/data';
@Component({
  selector: 'fitness-tracker-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  constructor(private afAuth: AngularFireAuth, private readonly authFacade: AuthFacadeService) {
  }

  // ngOnInit(): void {
  //   this.afAuth.authState.subscribe(d => console.log(d));
  // }

  // logout() {
  //   this.afAuth.signOut();
  // }

  successCallback({ authResult: { user } }: FirebaseUISignInSuccessWithAuthResult) {
    // this.authFacade.loggedIn(user)
  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

  uiShownCallback() {
    console.log('UI shown');
  }
}

