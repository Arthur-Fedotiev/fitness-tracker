import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { User } from '@fitness-tracker/create-user/models';

@Component({
  selector: 'ft-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUserFormComponent {
  @Output() private readonly userCreated: EventEmitter<User> = new EventEmitter<User>();

  public readonly createUserForm: FormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    isAdmin: [false]
  });

  constructor(private fb: FormBuilder) { }

  public onCreateUser(): void {
    this.userCreated.emit(this.createUserForm.value);
  }
}
