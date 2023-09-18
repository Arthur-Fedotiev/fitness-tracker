import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  Signal,
} from '@angular/core';
import { ExerciseVM } from '../models/exercise-vm';
import { ExerciseComponent } from '../exercise/exercise.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'components-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, ExerciseComponent],
})
export class ExerciseListComponent {
  @Input() public exerciseList: ExerciseVM[] | null = null;
  @Input() public isWorkoutCreationMode = false;
  @Input({ required: true }) public selectedForWorkoutIds!: Signal<Set<string>>;

  @Output()
  public readonly exerciseEdited = new EventEmitter<string>();
  @Output()
  public readonly exerciseViewed = new EventEmitter<string>();
  @Output()
  public readonly exerciseDeleted = new EventEmitter<string>();
  @Output()
  public readonly exerciseAddedToWorkout = new EventEmitter<string>();
  @Output()
  public readonly exerciseRemovedFromWorkout = new EventEmitter<string>();

  public viewExercise(id: string): void {
    this.exerciseViewed.emit(id);
  }

  public editExercise(id: string): void {
    this.exerciseEdited.emit(id);
  }

  public deleteExercise(id: string): void {
    this.exerciseDeleted.emit(id);
  }

  public onExerciseClick(id: string): void {
    if (!this.isWorkoutCreationMode) return;

    this.selectedForWorkoutIds().has(id)
      ? this.exerciseRemovedFromWorkout.emit(id)
      : this.exerciseAddedToWorkout.emit(id);
  }

  public trackById(idx: number, item: ExerciseVM): string | number {
    return item.id ?? idx;
  }
}
