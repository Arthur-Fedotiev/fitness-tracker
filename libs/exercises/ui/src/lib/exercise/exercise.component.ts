import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ExerciseVM } from '@fitness-tracker/exercises/model';
import { ROLES } from 'shared-package';

@Component({
  selector: 'ft-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseComponent {
  public readonly roles = ROLES;

  @Input()
  public exercise!: ExerciseVM;

  @Output()
  public readonly exerciseEdited = new EventEmitter<string>();
  @Output()
  public readonly exerciseViewed = new EventEmitter<string>();
  @Output()
  public readonly exerciseDeleted = new EventEmitter<string>();
  @Output()
  public readonly exerciseAddedToWorkout = new EventEmitter<string>();

  public viewExercise({ id }: ExerciseVM): void {
    this.exerciseViewed.emit(id);
  }

  public editExercise({ id }: ExerciseVM): void {
    this.exerciseEdited.emit(id);
  }

  public deleteExercise({ id }: ExerciseVM): void {
    this.exerciseDeleted.emit(id);
  }

  public addedToWorkout({ id }: ExerciseVM): void {
    this.exerciseAddedToWorkout.emit(id);
  }
}
