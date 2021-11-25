import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'fitness-tracker-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
