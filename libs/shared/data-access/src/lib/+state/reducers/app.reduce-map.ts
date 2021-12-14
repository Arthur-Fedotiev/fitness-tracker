import { settingsReducer } from './settings.reducer';

export const appReduceMap = {
  settings: settingsReducer,
} as const;
