import firebase from 'firebase/compat/app';
import OrderByDirection = firebase.firestore.OrderByDirection;

export interface WithPayload<T> {
  payload: T;
}

export interface Pagination {
  firstPage: boolean;
  pageSize: number;
}

export interface SearchOptions extends Pagination {
  sortOrder: OrderByDirection;
}
