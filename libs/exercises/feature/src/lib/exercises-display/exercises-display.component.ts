import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { EXERCISE_MODE } from '@fitness-tracker/exercises/model';
import { Pagination, DEFAULT_PAGINATION_STATE } from '@fitness-tracker/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, Observable, Subject, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'fitness-tracker-exercises-display',
  templateUrl: './exercises-display.component.html',
  styleUrls: ['./exercises-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesDisplayComponent implements OnInit, OnDestroy {
  public readonly exerciseMode = EXERCISE_MODE;
  public readonly allExercises$ = this.exerciseFacade.allExercises$;

  private readonly loadExercises: Subject<boolean> = new Subject<boolean>();
  private readonly loadExercises$: Observable<Pagination> = this.loadExercises.asObservable()
    .pipe(
      map((isLoadMore: boolean) => ({ ...DEFAULT_PAGINATION_STATE, firstPage: !isLoadMore })),
      tap(this.findExercises.bind(this)),
      untilDestroyed(this),
    );

  constructor(
    private exerciseFacade: ExercisesFacade,
    private router: Router,
    private route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.loadExercises$.subscribe();
    this.loadExercises.next(false)
  }

  public ngOnDestroy(): void {
    this.releaseResources()
  }

  public navigate(mode: EXERCISE_MODE, id: string): void {
    this.router.navigate(['..', id, mode], { relativeTo: this.route });
  }

  public deleteExercise(id: string): void {
    this.exerciseFacade.deleteExercise(id);
  }

  public loadMoreExercises(isLoadMore: boolean): void {
    this.loadExercises.next(isLoadMore);
  }

  private findExercises(paginationData: Pagination): void {
    this.exerciseFacade.findExercises(paginationData)
  }

  private releaseResources(): void {
    this.exerciseFacade.emptyExercisesList();
  }
}
