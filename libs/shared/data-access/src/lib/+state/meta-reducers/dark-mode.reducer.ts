import { Action, ActionReducer, INIT } from '@ngrx/store';
import { getIsDarkMode } from '../../utils/functions';
import { FtState } from '../reducers/app.reduce-map';

export const darkMode = (
  reducer: ActionReducer<FtState>,
): ActionReducer<FtState> => {
  return (state: FtState | undefined, action: Action) => {
    if (action.type === INIT) {
      const isDarkMode = getIsDarkMode();

      state = state
        ? { ...state, settings: { ...state.settings, isDarkMode } }
        : ({ settings: { isDarkMode } } as FtState);
    }

    return reducer(state, action);
  };
};
