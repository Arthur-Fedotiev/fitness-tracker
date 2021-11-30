import { Exercise } from "./exercise-model";
import { CollectionReference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';

export interface ExercisesEntity extends Exercise {
  id: string;
}

export interface PaginatedRefOptions {
  ref: CollectionReference;
  sortOrder: firebase.firestore.OrderByDirection;
  pageSize: number;
  firstPage: boolean;
}
