import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Subject,
  Observable,
  scan,
  shareReplay,
  pipe,
  catchError,
  EMPTY,
  switchMap,
  tap,
  withLatestFrom,
  UnaryFunction,
} from 'rxjs';
import {
  Actions,
  EnrichAction,
  ProcessAsyncAction,
  ProcessAsyncSuccessAction,
  ProcessAsyncErrorAction,
} from './async-actions';
import { Status, ActionsEnum } from './constants/async-state.constants';

export type AsyncState<CustomState extends object = object> = {
  error: null | string;
  status: Status;
} & CustomState;

const initialLocalState: AsyncState = {
  error: null,
  status: Status.INITIAL,
};

@UntilDestroy()
@Injectable()
export class AsyncStateService<CustomState extends object = object> {
  public readonly statusEnum = Status;
  public readonly actions$ = new Subject<Actions>();

  public readonly localState$: Observable<AsyncState<CustomState>> =
    this.actions$.asObservable().pipe(
      scan(
        (state, action) =>
          this.customUpdaterFn(stateReducer(state, action), action),
        initialLocalState as AsyncState<CustomState>,
      ),
      shareReplay({ bufferSize: 1, refCount: true }),
      untilDestroyed(this),
    );

  private customUpdaterFn: typeof stateReducer = (state) => state;

  constructor() {
    this.localState$.subscribe();
  }

  public enrichState(initialState: Partial<AsyncState<CustomState>>): void {
    this.dispatch(new EnrichAction(initialState));
  }

  public setCustomUpdaterFn(updaterFn: typeof stateReducer): void {
    this.customUpdaterFn = updaterFn;
  }

  public dispatch = (action: Actions): void => {
    this.actions$.next(action);
  };

  public handleAsync(
    fn: (state: AsyncState<CustomState>) => Observable<unknown>,
  ): UnaryFunction<Observable<unknown>, Observable<unknown>> {
    return pipe(
      withLatestFrom(this.localState$),
      tap(() => this.dispatch(new ProcessAsyncAction())),
      switchMap(([, state]) =>
        fn(state).pipe(
          tap(() => this.dispatch(new ProcessAsyncSuccessAction())),
          catchError((error: string) => {
            this.dispatch(new ProcessAsyncErrorAction(error));
            return EMPTY;
          }),
        ),
      ),
      untilDestroyed(this),
    );
  }
}

function stateReducer<T extends object = object>(
  state: AsyncState<T>,
  { type, payload }: Actions,
): AsyncState<T> {
  switch (type) {
    case ActionsEnum.ENRICH:
      return {
        ...state,
        ...payload,
      };
    case ActionsEnum.PROCESS_DATA_ASYNC:
      return {
        ...state,
        error: null,
        status: Status.PENDING,
      };
    case ActionsEnum.PROCESS_DATA_ASYNC_SUCCESS:
      return {
        ...state,
        status: Status.SUCCESS,
      };
    case ActionsEnum.PROCESS_DATA_ASYNC_ERROR:
      return {
        ...state,
        error: payload,
        status: Status.ERROR,
      };
    case ActionsEnum.RESET_STATE:
      return {
        ...state,
        error: null,
        status: Status.INITIAL,
      };
    default:
      return state;
  }
}
