import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  WorkoutFacadeService,
  WorkoutService,
} from '@fitness-tracker/workout/data';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
import { Observable, filter } from 'rxjs';

@Component({
  selector: 'ft-workouts-display',
  templateUrl: './workouts-display.component.html',
  styleUrls: ['./workouts-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutsDisplayComponent implements OnInit {
  public readonly workoutPreviews$: Observable<WorkoutPreview[]> =
    this.workoutFacade.workoutPreviews$.pipe(filter(Boolean));

  constructor(private readonly workoutFacade: WorkoutFacadeService) {}

  ngOnInit(): void {
    this.workoutFacade.loadWorkoutPreviews();
  }
}
