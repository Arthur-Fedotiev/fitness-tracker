import { Routes } from '@angular/router';
import { createUserDataProviders } from '@fitness-tracker/create-user/data';
import { CreateUserDisplayComponent } from './create-user-display/create-user-display.component';

export const createUserFeatureRoutes: Routes = [
  {
    path: '',
    providers: [createUserDataProviders],
    component: CreateUserDisplayComponent,
  },
];
