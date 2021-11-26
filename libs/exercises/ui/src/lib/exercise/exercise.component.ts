import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Input, Output, Optional } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
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
  public readonly exerciseEdited = new EventEmitter<ExercisesEntity>();

  constructor(@Optional() private readonly dialog: MatDialog) {
  }

  editExercise(exercise: ExercisesEntity): void {
    this.exerciseEdited.emit(exercise);
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

  }

}
