import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'fitness-tracker-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseListComponent implements OnInit {
  public readonly allExercises$ = this.exerciseFacade.allExercises$;

  constructor(private exerciseFacade: ExercisesFacade) { }

  public ngOnInit(): void {
    this.exerciseFacade.getAllExercises();
  }

}
