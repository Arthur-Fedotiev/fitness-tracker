import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';

@Component({
  selector: 'fitness-tracker-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseComponent {

  @Input()
  public exercise!: ExercisesEntity;

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
  // const dialogConfig = new MatDialogConfig();

  // dialogConfig.disableClose = true;
  // dialogConfig.autoFocus = true;

  // dialogConfig.data = course;

  // this.dialog.open(CourseDialogComponent, dialogConfig)
  //     .afterClosed()
  //     .subscribe(val => {
  //         if (val) {
  //             this.courseEdited.emit();
  //         }
  //     });
  // }

}
