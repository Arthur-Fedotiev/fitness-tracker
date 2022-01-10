import { Injectable } from '@angular/core';
import { User } from '@fitness-tracker/create-user/models';
import { Store } from '@ngrx/store';
import { createUser } from '../+state/actions/users.actions';

@Injectable({
  providedIn: 'root'
})
export class UsersFacadeService {

  constructor(private readonly store: Store) { }

  public createUser(payload: User): void {
    this.store.dispatch(createUser({ payload }))
  }
}
