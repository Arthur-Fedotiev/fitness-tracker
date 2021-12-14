import firebase from 'firebase/compat/app';
import { LanguageCodes } from 'shared-package';
import OrderByDirection = firebase.firestore.OrderByDirection;

export interface WithPayload<T> {
  payload: T;
}

export type WithId<T, P = string> = T & {
  id: P;
};

export interface Pagination {
  firstPage: boolean;
  pageSize: number;
}

export interface SearchOptions extends Pagination {
  sortOrder: OrderByDirection;
}

export interface FtState {
  settings: SettingsState;
}

export interface SettingsState {
  language: LanguageCodes;
}
