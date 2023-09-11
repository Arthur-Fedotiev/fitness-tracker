import { authDomainProviders } from '@fitness-tracker/auth/domain';
import { ICON_PROVIDER } from '@fitness-tracker/shared-ui-material';

export const authProviders = [
  authDomainProviders,
  {
    provide: ICON_PROVIDER,
    useValue: {
      iconKeys: ['sign-up', 'google-logo'],
      iconUrl: '/assets/images/auth',
    },
    multi: true,
  },
];
