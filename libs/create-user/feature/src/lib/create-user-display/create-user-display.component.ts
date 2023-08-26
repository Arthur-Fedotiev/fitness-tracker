import { Component, ChangeDetectionStrategy } from '@angular/core';
import { User, UsersFacadeService } from '@fitness-tracker/create-user/data';
import { CreateUserFormComponent } from '@fitness-tracker/create-user/ui';

@Component({
  selector: 'ft-create-user-display',
  templateUrl: './create-user-display.component.html',
  styleUrls: ['./create-user-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CreateUserFormComponent],
})
export class CreateUserDisplayComponent {
  constructor(private readonly usersFacade: UsersFacadeService) {}

  public createUser({ password, email, admin }: Omit<User, 'role'>): void {
    this.usersFacade.createUser(new User(password, email, admin));
  }
}
