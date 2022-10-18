import { Observable } from 'rxjs';
import { PlatformType } from '../constants/platform-type.enum';
import { LoadPwaPayload } from './load-pwa-payload.interface';

export interface AddToHomeScreenStrategy {
  platformType: PlatformType;
  loadPwa$: Observable<LoadPwaPayload | null>;
}
