import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'fitness-tracker-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateExerciseComponent implements OnInit {

  public readonly createExerciseForm: FormGroup = this.getForm()

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log('init')
  }

  public onCreateExercise(): void {
    console.log(this.createExerciseForm.value);
  }

  private getForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      musclesCategory: [null, Validators.required],
      loadCategory: [null, Validators.required],
      url: [null],
      description: [null]
    });
  }

}
