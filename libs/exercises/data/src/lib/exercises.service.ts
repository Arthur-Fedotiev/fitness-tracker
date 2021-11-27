import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Exercise, ExercisesEntity } from "@fitness-tracker/exercises/model";
import { COLLECTIONS, convertSnaps } from "@fitness-tracker/shared/utils";
import firebase from 'firebase/compat';
import { first, from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  constructor(private readonly afs: AngularFirestore) { }

  public createExercise(
    exercise: Exercise,
    exerciseId?: string): Observable<void | DocumentReference<Exercise>> {
    return exerciseId
      ? from(this.afs.doc<Exercise>(`${COLLECTIONS.EXERCISES}/${exerciseId}`).set(exercise)).pipe(first())
      : from(this.afs.collection<Exercise>(`${COLLECTIONS.EXERCISES}`).add(exercise)).pipe(first())
  }

  public getExercises(): Observable<ExercisesEntity[]> {
    return this.afs.collection<ExercisesEntity>(
      COLLECTIONS.EXERCISES,
      (ref: firebase.firestore.CollectionReference) => ref.orderBy('rating', 'desc')
    ).get().pipe(map(convertSnaps), first())
  }
}
