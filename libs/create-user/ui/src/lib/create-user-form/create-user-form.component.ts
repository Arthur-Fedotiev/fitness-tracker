import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface User {
  readonly email: string;
  readonly password: string;
  readonly admin: string;
}

@Component({
  selector: 'ft-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
})
export class CreateUserFormComponent {
  @Output() private readonly userCreated: EventEmitter<User> =
    new EventEmitter<User>();

  public readonly createUserForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    admin: [false],
  });

  constructor(private fb: UntypedFormBuilder) {}

  public onCreateUser(): void {
    this.userCreated.emit(this.createUserForm.value);
  }
}
