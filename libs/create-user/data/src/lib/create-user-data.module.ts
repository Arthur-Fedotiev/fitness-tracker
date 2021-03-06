import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromUsers from './+state/reducers/users.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UsersEffects } from './+state/effects/users.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromUsers.usersFeatureKey, fromUsers.reducer),
    EffectsModule.forFeature([UsersEffects])],
})
export class CreateUserDataModule { }
