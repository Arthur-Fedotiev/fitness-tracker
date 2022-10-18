import { PlatformType } from '../constants/platform-type.enum';

export interface LoadPwaPayload {
  pwaEvent: Event | null;
  pwaPlatform: PlatformType;
  snackBarData: {
    message: string;
    actions: {
      cancel: boolean;
      confirm: boolean;
    };
  };
}
