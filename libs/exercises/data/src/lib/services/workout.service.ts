import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  ConcreteWorkoutItemSerializer,
  convertOneSnap,
  SerializedWorkout,
  WithId,
} from '@fitness-tracker/shared/utils';
import { Observable, from, first, map } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(
    public readonly afs: AngularFirestore,
    private readonly serializer: ConcreteWorkoutItemSerializer,
  ) {
    this.getWorkout('qvSIdyZgZwRc1sxoDswM')
      .pipe(
        map(({ content, ...data }) => {
          const strategy = serializer;

          return {
            ...data,
            content: content.map(strategy.deserialize.bind(strategy)),
          };
        }),
      )
      .subscribe(console.log);
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
}
