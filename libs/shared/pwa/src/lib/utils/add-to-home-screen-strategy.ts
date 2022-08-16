import { fromEvent, map, of } from 'rxjs';
import { PlatformType } from '@fitness-tracker/shared/utils';
import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';
import { AddToHomeScreenStrategy } from '../models/pwa.models';

@Injectable()
export class AndroidAddToHomeScreenStrategy implements AddToHomeScreenStrategy {
  public readonly platformType = PlatformType.Android;

  public readonly loadPwa$ = fromEvent(
    this.windowRef,
    'beforeinstallprompt',
  ).pipe(
    map((pwaEvent: Event) => ({
      pwaEvent,
      pwaPlatform: PlatformType.Android,
      snackBarData: {
        message: 'Would you like to add this app to <b>Home Screen</b>?',
        actions: { cancel: true, confirm: true },
      },
    })),
  );

  constructor(@Inject(WINDOW) private readonly windowRef: Window) {}
}

export class IOSAddToHomeScreenStrategy implements AddToHomeScreenStrategy {
  public readonly platformType = PlatformType.IOS;

  public readonly loadPwa$ = of({
    pwaEvent: null,
    pwaPlatform: PlatformType.IOS,
    snackBarData: {
      message: `To install this WEB app on your device, tap the "Menu" button
      <img
        class="ios-action"
        src="/assets/images/ios-action.png"
      />
      and then "Add to home screen" button
      <span class="material-icons ios-add">add</span>`,
      actions: { cancel: true, confirm: true },
    },
  });
}

export class NullAddToHomeStrategy implements AddToHomeScreenStrategy {
  public readonly platformType = PlatformType.Null;

  public readonly loadPwa$ = of(null);
}
