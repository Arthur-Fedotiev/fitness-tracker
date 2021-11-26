import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Exercise } from "@fitness-tracker/exercises/model";

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  constructor(private readonly afs: AngularFirestore) { }

  public createExercise(exercise: Exercise): void {
    console.log(exercise);
  }
}
