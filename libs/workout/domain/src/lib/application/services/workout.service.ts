import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  convertOneSnap,
  convertSnaps,
  WithId,
} from '@fitness-tracker/shared/utils';
import { Observable, from, first, map } from 'rxjs';
import { WorkoutPreview } from '../../workout-preview';
import { SerializedWorkout } from '../classes/workout-serializer';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(public readonly afs: AngularFirestore) {}

  public createWorkout(
    workout: SerializedWorkout,
  ): Observable<void | DocumentReference<SerializedWorkout>> {
    const id = workout.id;
    return id
      ? from(
          this.afs.doc<SerializedWorkout>(`workouts/${id}`).set(workout),
        ).pipe(first())
      : from(
          this.afs.collection<SerializedWorkout>(`workouts`).add(workout),
        ).pipe(first());
  }

  public getWorkout(workoutId: string): Observable<SerializedWorkout> {
    return this.afs
      .doc<SerializedWorkout>(`workouts/${workoutId}`)
      .get()
      .pipe(map<any, WithId<SerializedWorkout>>(convertOneSnap));
  }

  public deleteWorkout(workoutId: string): Observable<void> {
    return from(
      this.afs.doc<SerializedWorkout>(`workouts/${workoutId}`).delete(),
    );
  }

  public findWorkouts(
    muscles?: string[],
  ): Observable<Required<SerializedWorkout>[]> {
    return this.afs
      .collection<Required<SerializedWorkout>>(
        'workouts',
        (ref: CollectionReference) =>
          !muscles?.length
            ? ref
            : ref.where('targetMuscles', 'array-contains-any', muscles),
      )
      .get()
      .pipe(map((a) => convertSnaps<any>(a)));
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
