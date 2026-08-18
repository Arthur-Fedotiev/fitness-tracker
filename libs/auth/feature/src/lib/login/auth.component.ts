import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthFacadeService, AuthFormModel } from '@fitness-tracker/auth/domain';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ft-auth',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-icon class="welcome-icon" width="50%" svgIcon="sign-up" [color]="'accent'"></mat-icon>
    @if (authError(); as authError) {
      <p class="auth-error" role="alert">
        <mat-icon aria-hidden="true">error_outline</mat-icon>
        <span>{{ authError }}</span>
      </p>
    }
    @if (selectedAuthFlowStrategy) {
      <form #authForm="ngForm" class="sing-in-form">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input
            matInput
            type="email"
            placeholder="Email"
            name="email"
            autocomplete="email"
            [(ngModel)]="authFormModel.email"
          />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input
            matInput
            type="password"
            placeholder="Password"
            name="password"
            [autocomplete]="passwordAutocomplete"
            [(ngModel)]="authFormModel.password"
          />
        </mat-form-field>
        <div class="sign-in-actions">
          <button mat-button (click)="cancelEmailLogin()">Cancel</button>
          <button color="primary" mat-raised-button (click)="onSubmit()">
            {{ authTypeStrategies[selectedAuthFlowStrategy].label }}
          </button>
        </div>
      </form>
    } @else {
      <div class="auth-flow-actions">
        <button mat-raised-button (click)="loginWithGoogle()">
          <mat-icon class="google-icon" svgIcon="google-logo"></mat-icon>
          Login with Google
        </button>
        <button color="accent" mat-raised-button (click)="startEmailLogin()">
          Login with Email
        </button>
        <button mat-raised-button color="warn" (click)="startEmailSignup()">
          Sign up with Email
        </button>
      </div>
    }
  `,
})
export class AuthComponent {
  private readonly authFacade = inject(AuthFacadeService);

  protected readonly authError = this.authFacade.authError;

  protected authFormModel: AuthFormModel = {
    email: '',
    password: '',
  };

  protected authTypeStrategies = {
    signin: {
      type: 'signin',
      label: 'Login',
      onSubmit: this.signInWithEmailAndPassword.bind(this),
    },
    signup: {
      type: 'signup',
      label: 'Sign up',
      onSubmit: this.signUpWithEmailAndPassword.bind(this),
    },
  } as const;

  protected selectedAuthFlowStrategy: keyof typeof this.authTypeStrategies | null = null;

  /** Tells a password manager whether to offer a saved password or generate one. */
  protected get passwordAutocomplete(): 'current-password' | 'new-password' {
    return this.selectedAuthFlowStrategy === 'signup'
      ? 'new-password'
      : 'current-password';
  }

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
    this.authFacade.clearAuthError();
    this.selectedAuthFlowStrategy = 'signin';
  }

  protected startEmailSignup() {
    this.authFacade.clearAuthError();
    this.selectedAuthFlowStrategy = 'signup';
  }

  protected cancelEmailLogin() {
    this.authFacade.clearAuthError();
    this.selectedAuthFlowStrategy = null;
  }

  protected onSubmit() {
    if (!this.selectedAuthFlowStrategy) {
      throw new Error('No authentication flow strategy selected');
    }
    this.authTypeStrategies[this.selectedAuthFlowStrategy].onSubmit();
  }
}
