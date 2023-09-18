import { Injectable, inject } from '@angular/core';

import { convertOneSnap, convertSnaps } from '@fitness-tracker/shared/utils';
import { Observable, from, map } from 'rxjs';
import { WorkoutPreview } from '../../workout-preview';
import { SerializedWorkout } from '../classes/workout-serializer';
import {
  DocumentReference,
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  and,
  or,
} from '@angular/fire/firestore';

export type WorkoutCollection = CollectionReference<SerializedWorkout>;

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly afs = inject(Firestore);
  private readonly workoutCollectionRef = collection(
    this.afs,
    'workouts',
  ) as WorkoutCollection;

  public createWorkout(
    workout: SerializedWorkout,
  ): Observable<void | DocumentReference<SerializedWorkout>> {
    return from(
      workout.id
        ? setDoc(doc(this.workoutCollectionRef, workout.id), workout)
        : addDoc(this.workoutCollectionRef, workout),
    );
  }

  public getWorkout(workoutId: string): Observable<SerializedWorkout> {
    return from(getDoc(doc(this.workoutCollectionRef, workoutId))).pipe(
      map(convertOneSnap),
    );
  }

  public deleteWorkout(workoutId: string): Observable<void> {
    return from(deleteDoc(doc(this.workoutCollectionRef, workoutId)));
  }

  public getWorkoutPreviews(
    userId: string,
    isAdmin: boolean,
    muscles?: string[],
  ): Observable<WorkoutPreview[]> {
    return this.findWorkouts(userId, isAdmin, muscles).pipe(
      map((workouts) =>
        workouts.map(
          ({
            id,
            name,
            coverUrl: img,
            targetMuscles,
            level,
            userId,
            admin,
          }) => ({
            id,
            name,
            img,
            targetMuscles,
            level,
            userId,
            admin,
          }),
        ),
      ),
    );
  }

  private findWorkouts(
    userId: string,
    isAdmin: boolean,
    muscles: string[] = [],
  ) {
    const queryWithOwnership = query(
      this.workoutCollectionRef,
      or(where('userId', '==', userId), where('admin', '==', true)),
    );

    return from(
      getDocs(
        !muscles.length
          ? queryWithOwnership
          : query(
              queryWithOwnership,
              where('targetMuscles', 'array-contains-any', muscles),
            ),
      ),
    ).pipe(map(convertSnaps));
  }
}
