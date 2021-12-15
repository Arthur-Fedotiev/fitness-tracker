import { settingsReducer, SettingsState } from './settings.reducer';

export interface FtState {
  settings: SettingsState;
}

export const appReduceMap = {
  settings: settingsReducer,
} as const;
