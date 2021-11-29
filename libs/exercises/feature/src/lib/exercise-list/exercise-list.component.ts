import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';

@Component({
  selector: 'fitness-tracker-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseListComponent {
  @Input() public exerciseList: ExercisesEntity[] | null = null;
  @Output()
  public readonly exerciseEdited = new EventEmitter<string>();
  @Output()
  public readonly exerciseViewed = new EventEmitter<string>();

  public viewExercise({ id }: ExercisesEntity): void {
    this.exerciseViewed.emit(id);
  }

  public editExercise({ id }: ExercisesEntity): void {
    this.exerciseEdited.emit(id);
  }
}
