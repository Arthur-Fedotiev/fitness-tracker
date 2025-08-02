import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthFacadeService, AuthFormModel } from '@fitness-tracker/auth/domain';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ft-auth',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
],
  template: `
    <mat-icon
      class="welcome-icon"
      width="50%"
      svgIcon="sign-up"
      [color]="'accent'"
    ></mat-icon>
    @if (selectedAuthFlowStrategy) {
      <form
        #authForm="ngForm"
        class="sing-in-form"
        >
        <mat-form-field appearance="outline">
          <mat-label>{{ 'auth.emailLabel' | translate }}</mat-label>
          <input
            matInput
            placeholder="{{ 'auth.emailLabel' | translate }}"
            name="email"
            [(ngModel)]="authFormModel.email"
            />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'auth.passwordLabel' | translate }}</mat-label>
          <input
            matInput
            placeholder="{{ 'auth.passwordLabel' | translate }}"
            name="password"
            [(ngModel)]="authFormModel.password"
            />
        </mat-form-field>
        <div class="sign-in-actions">
          <button mat-button (click)="cancelEmailLogin()">Cancel</button>
          <button color="primary" mat-raised-button (click)="onSubmit()">
            {{ authTypeStrategies[selectedAuthFlowStrategy].label | translate }}
          </button>
        </div>
      </form>
    } @else {
      <div class="auth-flow-actions">
        <button mat-raised-button (click)="loginWithGoogle()">
          <mat-icon class="google-icon" svgIcon="google-logo"></mat-icon>
          {{ 'auth.loginWithGoogle' | translate }}
        </button>
        <button color="accent" mat-raised-button (click)="startEmailLogin()">
          {{ 'auth.loginWithEmail' | translate }}
        </button>
        <button mat-raised-button color="warn" (click)="startEmailSignup()">
          {{ 'auth.signUpWithEmail' | translate }}
        </button>
      </div>
    }
    
    `,
})
export class AuthComponent {
  protected authFormModel: AuthFormModel = {
    email: '',
    password: '',
  };

  protected authTypeStrategies = {
    signin: {
      type: 'signin',
      label: 'auth.login',
      onSubmit: this.signInWithEmailAndPassword.bind(this),
    },
    signup: {
      type: 'signup',
      label: 'auth.signUp',
      onSubmit: this.signUpWithEmailAndPassword.bind(this),
    },
  } as const;

  protected selectedAuthFlowStrategy:
    | keyof typeof this.authTypeStrategies
    | null = null;

  constructor(private readonly authFacade: AuthFacadeService) {}

  protected loginWithGoogle() {
    this.authFacade.loginWithGoogle();
  }

  protected async signInWithEmailAndPassword() {
    this.authFacade.loginWithEmail(structuredClone(this.authFormModel));
  }

  protected async signUpWithEmailAndPassword() {
    this.authFacade.signUpWithEmail(structuredClone(this.authFormModel));
  }

  protected startEmailLogin() {
    this.selectedAuthFlowStrategy = 'signin';
  }

  protected startEmailSignup() {
    this.selectedAuthFlowStrategy = 'signup';
  }

  protected cancelEmailLogin() {
    this.selectedAuthFlowStrategy = null;
  }

  protected onSubmit() {
    this.authTypeStrategies[this.selectedAuthFlowStrategy!].onSubmit();
  }
}
