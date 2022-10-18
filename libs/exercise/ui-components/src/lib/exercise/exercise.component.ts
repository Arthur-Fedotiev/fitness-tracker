import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ROLES } from 'shared-package';
import { ExerciseVM } from '../models/exercise-vm';

@Component({
  selector: 'components-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseComponent {
  public readonly roles = ROLES;

  @Input()
  public exercise!: ExerciseVM;
  @Input()
  public readonly idx!: number;
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
