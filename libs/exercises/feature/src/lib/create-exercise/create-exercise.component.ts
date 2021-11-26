import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Optional,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExercisesService } from '@fitness-tracker/exercises/data';
import { MUSCLE_LIST, IMuscleList, IMuscle } from '@fitness-tracker/exercises/model';

@Component({
  selector: 'fitness-tracker-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateExerciseComponent implements OnInit {
  public readonly createExerciseForm: FormGroup = this.getForm();
  public readonly muscles: IMuscleList = MUSCLE_LIST;

  constructor(
    private fb: FormBuilder,
    private exercisesService: ExercisesService
  ) { }

  ngOnInit(): void {
    console.log('init');
  }

  public onCreateExercise(): void {
    this.exercisesService.createExercise(this.createExerciseForm.value);
  }

  public trackByMuscle(_: number, muscle: IMuscle): IMuscle {
    return muscle;
  }

  private getForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      musclesCategory: [null, Validators.required],
      targetMuscle: [null, Validators.required],
      loadCategory: [null, Validators.required],
      url: [null],
      description: [null],
    });
  }
}
