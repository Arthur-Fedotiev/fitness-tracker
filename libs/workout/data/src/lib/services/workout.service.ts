import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  convertOneSnap,
  convertSnaps,
  LanguagesISO,
  SerializedWorkout,
  WithId,
  WorkoutBasicInfo,
} from '@fitness-tracker/shared/utils';
import { Observable, from, first, map } from 'rxjs';
import firebase from 'firebase/compat/app';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
import { LanguageCodes } from 'shared-package';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(public readonly afs: AngularFirestore) {}

  public createWorkout(
    workout: SerializedWorkout,
    id?: string,
  ): Observable<void | DocumentReference<SerializedWorkout>> {
    return id
      ? from(
          this.afs.doc<SerializedWorkout>(`workouts/${id}`).set(workout),
        ).pipe(first())
      : from(
          this.afs.collection<SerializedWorkout>(`workouts`).add(workout),
        ).pipe(first());
  }

  public getWorkout(
    workoutId: string,
    lang: LanguageCodes = LanguagesISO.ENGLISH,
  ): Observable<SerializedWorkout> {
    return this.afs
      .doc<SerializedWorkout>(`workouts/${workoutId}`)
      .get()
      .pipe(
        map<
          firebase.firestore.DocumentSnapshot<SerializedWorkout>,
          WithId<SerializedWorkout>
        >(convertOneSnap),
      );
  }

  public findWorkouts(
    muscles?: WorkoutBasicInfo['targetMuscles'],
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
      .pipe(map(convertSnaps));
  }

  public getWorkoutPreviews(
    muscles?: WorkoutBasicInfo['targetMuscles'],
  ): Observable<WorkoutPreview[]> {
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
