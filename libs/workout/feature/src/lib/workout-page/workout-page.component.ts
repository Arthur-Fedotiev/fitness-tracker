import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ft-workout-page',
  templateUrl: './workout-page.component.html',
  styleUrls: ['./workout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
