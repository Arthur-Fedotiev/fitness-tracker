import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UsersFacadeService } from '@fitness-tracker/create-user/data';
import { CreateUserFormComponent } from '../../../../ui/src/lib/create-user-form/create-user-form.component';

@Component({
    selector: 'ft-create-user-display',
    templateUrl: './create-user-display.component.html',
    styleUrls: ['./create-user-display.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CreateUserFormComponent]
})
export class CreateUserDisplayComponent {
  constructor(private readonly usersFacade: UsersFacadeService) { }

  public createUser({ password, email, admin }: Omit<User, 'role'>): void {
    this.usersFacade.createUser(new User(password, email, admin));
  }
}
