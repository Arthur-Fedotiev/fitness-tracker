import { InjectionToken } from '@angular/core';

export interface IconProvider {
  iconKeys: ReadonlyArray<string> | string[];
  iconUrl: string;
}

export const ICON_PROVIDER: InjectionToken<IconProvider> =
  new InjectionToken<IconProvider>('Icon provider');
