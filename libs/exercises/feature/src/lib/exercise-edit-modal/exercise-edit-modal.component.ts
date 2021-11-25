import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'fitness-tracker-exercise-edit-modal',
  templateUrl: './exercise-edit-modal.component.html',
  styleUrls: ['./exercise-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseEditModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
