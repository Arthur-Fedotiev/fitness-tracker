import { environment } from '@fitness-tracker/shared/environments';

import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideSharedState } from './+state/provide-shared-state';
import { providePersistence } from './firebase-persistence/provide-persistence';

export const provideSharedDataAccess = () => [
  provideSharedState(environment),
  providePersistence(environment),
  ScreenTrackingService,
  UserTrackingService,
];
