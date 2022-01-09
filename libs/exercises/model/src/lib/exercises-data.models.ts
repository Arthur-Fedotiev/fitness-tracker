import { CollectionReference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { ExercisePagination, ExerciseListQueryChange } from '..';

export interface PaginatedRefOptions {
  ref: CollectionReference;
  sortOrder: firebase.firestore.OrderByDirection;
  pageSize: number;
  firstPage: boolean;
}

export type ExerciseListLoadAction =
  | ExercisePagination
  | ExerciseListQueryChange;
