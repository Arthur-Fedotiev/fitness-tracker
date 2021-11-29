import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { tap } from 'rxjs';

@Component({
  selector: 'fitness-tracker-exercises-page',
  templateUrl: './exercises-page.component.html',
  styleUrls: ['./exercises-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesPageComponent {
  public readonly isLoading$ = this.exercisesFacade.loading$.pipe(tap(console.log));

  constructor(private readonly exercisesFacade: ExercisesFacade) { }

}
