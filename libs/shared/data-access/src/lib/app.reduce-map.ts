import { settingsReducer } from './reducers/settings.reducer';

export const appReduceMap = {
  settings: settingsReducer,
} as const;
