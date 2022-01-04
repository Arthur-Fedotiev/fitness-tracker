import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SerializedWorkout } from '@fitness-tracker/shared/utils';
import { WorkoutFacadeService } from '@fitness-tracker/workout/data';
import { filter, Observable, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ft-workout-details',
  templateUrl: './workout-details.component.html',
  styleUrls: ['./workout-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutDetailsComponent implements OnInit {
  public readonly workoutDetails$: Observable<SerializedWorkout> =
    this.workoutFacade.workoutDetails$.pipe(filter(Boolean), tap(console.log));

  constructor(
    private readonly workoutFacade: WorkoutFacadeService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.workoutFacade.loadWorkoutDetails(
      this.route.snapshot.paramMap.get('id') as string,
    );
  }
}
