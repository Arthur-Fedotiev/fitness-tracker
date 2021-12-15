import firebase from 'firebase/compat/app';
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
