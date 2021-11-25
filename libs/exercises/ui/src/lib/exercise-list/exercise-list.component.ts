import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'fitness-tracker-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
