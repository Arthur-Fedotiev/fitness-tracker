import { PlatformType } from '../constants/platform-type.enum';

export interface BeforeInstallPromptEvent extends Event {
  readonly prompt: () => Promise<void>;
  readonly userChoice: Promise<{
    readonly outcome: 'accepted' | 'dismissed';
  }>;
}

export interface LoadPwaPayload {
  pwaEvent: BeforeInstallPromptEvent | null;
  pwaPlatform: PlatformType;
  snackBarData: {
    message: string;
    actions: {
      cancel: boolean;
      confirm: boolean;
    };
  };
}
