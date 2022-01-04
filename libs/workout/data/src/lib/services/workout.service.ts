import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  ConcreteWorkoutItemSerializer,
  convertOneSnap,
  convertSnaps,
  SerializedWorkout,
  WithId,
  WorkoutBasicInfo,
} from '@fitness-tracker/shared/utils';
import { Observable, from, first, map } from 'rxjs';
import firebase from 'firebase/compat/app';
import { WorkoutPreview } from '@fitness-tracker/workout/model';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(
    public readonly afs: AngularFirestore,
    private readonly workoutSerializeStrategy: ConcreteWorkoutItemSerializer,
  ) {
    // this.getWorkout('qvSIdyZgZwRc1sxoDswM')
    //   .pipe(
    //     map(({ content, ...data }) => {
    //       return {
    //         ...data,
    //         content: content.map(
    //           this.workoutSerializeStrategy.deserialize.bind(
    //             this.workoutSerializeStrategy,
    //           ),
    //         ),
    //       };
    //     }),
    //   )
    //   .subscribe(console.log);
  }

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

  public getWorkout(workoutId: string): Observable<SerializedWorkout> {
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
    muscles?: WorkoutBasicInfo['muscles'],
  ): Observable<Required<SerializedWorkout>[]> {
    return this.afs
      .collection<Required<SerializedWorkout>>(
        'workouts',
        (ref: CollectionReference) =>
          !muscles?.length
            ? ref
            : ref.where('muscles', 'array-contains-any', muscles),
      )
      .get()
      .pipe(map(convertSnaps));
  }

  public getWorkoutPreviews(
    muscles?: WorkoutBasicInfo['muscles'],
  ): Observable<WorkoutPreview[]> {
    return this.findWorkouts(muscles).pipe(
      map((workouts: Required<SerializedWorkout>[]) =>
        workouts.map(
          ({
            id,
            name,
            coverUrl: img,
            muscles,
            level,
          }: Required<SerializedWorkout>) => ({
            id,
            name,
            img,
            muscles,
            level,
          }),
        ),
      ),
    );
  }
}
