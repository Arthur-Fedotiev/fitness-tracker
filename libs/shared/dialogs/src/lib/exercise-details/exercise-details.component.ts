import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  Optional,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Exercise, ExerciseVm } from '@fitness-tracker/exercises/model';

@Component({
  selector: 'ft-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseDetailsComponent implements OnInit {
  public exercise: ExerciseVm | null = null;

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { exercise: Exercise },
  ) {}

  ngOnInit(): void {
    this.exercise = this.dialogData.exercise
      ? {
          ...this.dialogData.exercise,
          instructions: this.dialogData.exercise.instructions
            ? this.dialogData.exercise.instructions.split(/\d.\s/g).slice(1)
            : [],
        }
      : null;

    console.log(this.exercise);
  }
}
