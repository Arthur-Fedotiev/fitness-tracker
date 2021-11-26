import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Exercise } from "@fitness-tracker/exercises/model";
import { COLLECTIONS } from "@fitness-tracker/shared/utils";
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  constructor(private readonly afs: AngularFirestore) { }

  public createExercise(
    exercise: Exercise,
    exerciseId?: number): Observable<void> | Observable<DocumentReference<Exercise>> {
    return exerciseId
      ? from(this.afs.doc(`${COLLECTIONS.EXERCISES}/${exerciseId}`).set(exercise))
      : from(this.afs.collection<Exercise>(`${COLLECTIONS.EXERCISES}`).add(exercise))
  }
}
