import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { EXERCISE_MODE } from '@fitness-tracker/exercises/model';

@Component({
  selector: 'fitness-tracker-exercises-display',
  templateUrl: './exercises-display.component.html',
  styleUrls: ['./exercises-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesDisplayComponent implements OnInit {
  public readonly exerciseMode = EXERCISE_MODE;
  public readonly allExercises$ = this.exerciseFacade.allExercises$;

  constructor(
    private exerciseFacade: ExercisesFacade,
    private router: Router,
    private route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.exerciseFacade.getAllExercises();
  }

  public navigate(mode: EXERCISE_MODE, id: string): void {
    console.log(mode, id)
    this.router.navigate(['..', id, mode], { relativeTo: this.route });
  }
}
