import { Injectable, inject } from '@angular/core';

import {
  convertOneSnap,
  convertSnaps,
  WithId,
} from '@fitness-tracker/shared/utils';
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
    const id = workout.id;

    return from(
      id
        ? setDoc(doc(this.workoutCollectionRef, id), workout)
        : addDoc(this.workoutCollectionRef, workout),
    );
  }

  public getWorkout(workoutId: string): Observable<SerializedWorkout> {
    return from(getDoc(doc(this.workoutCollectionRef, workoutId))).pipe(
      map<any, WithId<SerializedWorkout>>(convertOneSnap),
    );
  }

  public deleteWorkout(workoutId: string): Observable<void> {
    return from(deleteDoc(doc(this.workoutCollectionRef, workoutId)));
  }

  public findWorkouts(
    muscles?: string[],
  ): Observable<Required<SerializedWorkout>[]> {
    return from(
      getDocs(
        !muscles?.length
          ? this.workoutCollectionRef
          : query(
              this.workoutCollectionRef,
              where('targetMuscles', 'array-contains-any', muscles),
            ),
      ),
    ).pipe(map((a) => convertSnaps<any>(a)));
  }

  public getWorkoutPreviews(muscles?: string[]): Observable<WorkoutPreview[]> {
    return this.findWorkouts(muscles).pipe(
      map((workouts: Required<SerializedWorkout>[]) =>
        workouts.map(
          ({
            id,
            name,
            coverUrl: img,
            targetMuscles,
            level,
          }: Required<SerializedWorkout>) => ({
            id,
            name,
            img,
            targetMuscles,
            level,
          }),
        ),
      ),
    );
  }
}
