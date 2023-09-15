import { DARK_MODE_STORAGE_KEY } from '../models/theme';

export const getIsDarkMode: () => boolean = () =>
  JSON.parse(localStorage.getItem(DARK_MODE_STORAGE_KEY) ?? 'true');
