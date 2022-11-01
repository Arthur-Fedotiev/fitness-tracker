import { ActionsEnum } from './constants/async-state.constants';

export interface Action<T> {
  type: ActionsEnum | string;
  payload?: T;
}
export class EnrichAction {
  public readonly type = ActionsEnum.ENRICH;
  constructor(public readonly payload: object) {}
}

export class ProcessAsyncAction {
  public readonly type = ActionsEnum.PROCESS_DATA_ASYNC;
  public readonly payload = undefined;
}

export class ProcessAsyncSuccessAction {
  public readonly type = ActionsEnum.PROCESS_DATA_ASYNC_SUCCESS;
  public readonly payload = undefined;
}

export class ProcessAsyncErrorAction {
  public readonly type = ActionsEnum.PROCESS_DATA_ASYNC_ERROR;

  constructor(public readonly payload: string) {}
}

export class ResetStateAction {
  public readonly type = ActionsEnum.RESET_STATE;
  public readonly payload = undefined;
}

export type Actions =
  | EnrichAction
  | ProcessAsyncAction
  | ProcessAsyncSuccessAction
  | ProcessAsyncErrorAction
  | ResetStateAction;
