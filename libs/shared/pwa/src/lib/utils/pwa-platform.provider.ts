import { Platform } from '@angular/cdk/platform';
import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';
import {
  AndroidAddToHomeScreenStrategy,
  IOSAddToHomeScreenStrategy,
  NullAddToHomeStrategy,
} from './add-to-home-screen-strategy';

export type AddToHomeScreenProvider =
  | AndroidAddToHomeScreenStrategy
  | IOSAddToHomeScreenStrategy
  | NullAddToHomeStrategy;

export const ADD_TO_HOME_SCREEN_TOKEN =
  new InjectionToken<AddToHomeScreenProvider>('Add to Home Screen provider', {
    providedIn: 'root',
    factory: () => {
      const platform = inject(Platform);
      const windowRef = inject(WINDOW);

      return platform.ANDROID
        ? new AndroidAddToHomeScreenStrategy(windowRef)
        : platform.IOS && platform.SAFARI
        ? new IOSAddToHomeScreenStrategy()
        : new NullAddToHomeStrategy();
    },
  });
