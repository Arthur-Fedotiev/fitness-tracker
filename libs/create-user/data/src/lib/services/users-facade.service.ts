import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { createUser } from '../+state/actions/users.actions';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersFacadeService {
  private readonly store = inject(Store);


  public createUser(payload: User): void {
    this.store.dispatch(createUser({ payload }));
  }
}
