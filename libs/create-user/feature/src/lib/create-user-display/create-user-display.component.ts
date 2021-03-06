import { Component, ChangeDetectionStrategy } from '@angular/core';
import { User } from '@fitness-tracker/create-user/models';
import { UsersFacadeService } from '@fitness-tracker/create-user/data';

@Component({
  selector: 'ft-create-user-display',
  templateUrl: './create-user-display.component.html',
  styleUrls: ['./create-user-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUserDisplayComponent {
  constructor(private readonly usersFacade: UsersFacadeService) { }

  public createUser({ password, email, admin }: Omit<User, 'role'>): void {
    this.usersFacade.createUser(new User(password, email, admin));
  }
}
