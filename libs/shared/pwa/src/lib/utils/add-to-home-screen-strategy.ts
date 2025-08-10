import { Injectable, inject } from '@angular/core';
import { WA_WINDOW } from '@ng-web-apis/common';
import { filter, fromEvent, map, of } from 'rxjs';
import { PlatformType } from '../constants/platform-type.enum';
import { AddToHomeScreenStrategy } from '../models/add-to-home-screen.strategy';
import { BeforeInstallPromptEvent } from './../models/load-pwa-payload.interface';

@Injectable()
export class AndroidAddToHomeScreenStrategy implements AddToHomeScreenStrategy {
  public readonly platformType = PlatformType.Android;

  public readonly loadPwa$ = fromEvent(this.windowRef, 'beforeinstallprompt').pipe(
    filter((event: Event): event is BeforeInstallPromptEvent => !!event && 'prompt' in event),
    map((pwaEvent: BeforeInstallPromptEvent) => ({
      pwaEvent,
      pwaPlatform: PlatformType.Android,
      snackBarData: {
        message: 'Would you like to add this app to <b>Home Screen</b>?',
        actions: { cancel: true, confirm: true },
      },
    })),
  );

  constructor(private readonly windowRef: Window = inject(WA_WINDOW)) {}
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
