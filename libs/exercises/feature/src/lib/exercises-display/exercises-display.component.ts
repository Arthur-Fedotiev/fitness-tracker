import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { EXERCISE_MODE } from '@fitness-tracker/exercises/model';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import {
  Pagination,
  DEFAULT_PAGINATION_STATE,
} from '@fitness-tracker/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, Observable, skip, Subject, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ft-exercises-display',
  templateUrl: './exercises-display.component.html',
  styleUrls: ['./exercises-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesDisplayComponent implements OnInit, OnDestroy {
  public readonly exerciseMode = EXERCISE_MODE;
  public readonly allExercises$ = this.exerciseFacade.allExercises$;

  private readonly loadExercises: Subject<boolean> = new Subject<boolean>();
  private readonly loadExercises$: Observable<Pagination> = this.loadExercises
    .asObservable()
    .pipe(
      map((isLoadMore: boolean) => ({
        ...DEFAULT_PAGINATION_STATE,
        firstPage: !isLoadMore,
      })),
      tap(this.findExercises.bind(this)),
      untilDestroyed(this),
    );

  private readonly refreshExercises$ = this.settingsFacade.language$
    .pipe(
      skip(1),
      tap((a) => console.log('[ExercisesDisplayComponent]', a)),
      tap(() => this.refreshExercises(DEFAULT_PAGINATION_STATE)),
    )
    .subscribe();

  constructor(
    private readonly exerciseFacade: ExercisesFacade,
    private readonly settingsFacade: SettingsFacadeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.loadExercises$.subscribe();
    this.loadExercises.next(false);
  }

  public ngOnDestroy(): void {
    this.releaseResources();
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
    this.exerciseFacade.findExercises(paginationData);
  }

  private refreshExercises(paginationData: Pagination): void {
    this.exerciseFacade.refreshExercises(paginationData);
  }

  private releaseResources(): void {
    this.exerciseFacade.emptyExercisesList();
  }
}
