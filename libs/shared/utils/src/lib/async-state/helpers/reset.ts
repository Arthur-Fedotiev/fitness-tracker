import { ResetStateAction } from '../async-actions';
import { AsyncStateService } from '../async-state.service';

export const reset = (
  dispatchFn: typeof AsyncStateService.prototype.dispatch,
): void => dispatchFn(new ResetStateAction());
