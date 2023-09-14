import { ICON_PROVIDER } from '@fitness-tracker/shared-ui-material';
import { LANG_CODES } from 'shared-package';

export const provideLayout = () => [
  {
    provide: ICON_PROVIDER,
    useValue: { iconKeys: LANG_CODES, iconUrl: '/assets/images/flags' },
    multi: true,
  },
  {
    provide: ICON_PROVIDER,
    useValue: {
      iconKeys: ['exercises', 'add-user', 'blacksmith', 'stud', 'workouts'],
      iconUrl: '/assets/images/navigation',
    },
    multi: true,
  },
  {
    provide: ICON_PROVIDER,
    useValue: {
      iconKeys: ['exit'],
      iconUrl: '/assets/images/settings',
    },
    multi: true,
  },
  {
    provide: ICON_PROVIDER,
    useValue: {
      iconKeys: ['sign-up', 'google-logo'],
      iconUrl: '/assets/images/auth',
    },
    multi: true,
  },
];
