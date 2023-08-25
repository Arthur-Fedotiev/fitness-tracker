import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createUser } from '../+state/actions/users.actions';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersFacadeService {
  constructor(private readonly store: Store) {}

  public createUser(payload: User): void {
    this.store.dispatch(createUser({ payload }));
  }
}
