import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'fitness-tracker-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateExerciseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
