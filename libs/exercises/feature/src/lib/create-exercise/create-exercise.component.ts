import {
  Component,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { MUSCLE_LIST, EQUIPMENT, MuscleList, Equipment, ExerciseTypes, EXERCISE_TYPES } from '@fitness-tracker/exercises/model';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';

@Component({
  selector: 'fitness-tracker-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateExerciseComponent {
  public readonly exerciseForm: FormGroup = this.getForm();
  public readonly muscles: MuscleList = MUSCLE_LIST;
  public readonly equipment: Equipment = EQUIPMENT;
  public readonly exerciseTypes: ExerciseTypes = EXERCISE_TYPES;

  constructor(
    private fb: FormBuilder,
    private exercisesFacade: ExercisesFacade
  ) { }

  public onSave(): void {
    // this.exercise
    //   ? this.exercisesFacade.updateExercise({ ...this.exercise, ...this.exerciseForm.value })
    //   : this.exercisesFacade.createExercise(this.exerciseForm.value);
  }

  public trackByItem(index: number, item: string | number): string | number {
    return item ?? index;
  }

  private getForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      exerciseType: [null, Validators.required],
      targetMuscle: [null, Validators.required],
      equipment: [null, Validators.required],
      coverUrl: [null],
      avatarUrl: [null, Validators.required],
      shortDescription: [null],
      longDescription: [null],
      benefits: [null],
      instructions: [null],
      rating: [0, Validators.required],
    });
  }
}
