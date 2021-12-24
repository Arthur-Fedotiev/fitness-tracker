import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import {
  ExerciseMetaCollectionsDictionaryUnit,
  ExercisesEntity,
  ExerciseVM,
  EXERCISE_MODE,
} from '@fitness-tracker/exercises/model';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import {
  Pagination,
  DEFAULT_PAGINATION_STATE,
} from '@fitness-tracker/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  filter,
  map,
  merge,
  Observable,
  scan,
  skip,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ft-exercises-display',
  templateUrl: './exercises-display.component.html',
  styleUrls: ['./exercises-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesDisplayComponent implements OnInit, OnDestroy {
  public readonly exerciseMode = EXERCISE_MODE;
  public readonly exercisesList$: Observable<ExerciseVM[]> =
    this.exerciseFacade.exercisesList$.pipe(
      tap(() => this.isLoadingProhibited.next(false)),
      tap(console.log),
    );
  public readonly metaCollections$: Observable<ExerciseMetaCollectionsDictionaryUnit> =
    this.exerciseFacade.exercisesMetaCollections$.pipe(filter(Boolean));

  private readonly isLoadingProhibited = new BehaviorSubject(false);
  public readonly isLoadingProhibited$ =
    this.isLoadingProhibited.asObservable();

  private readonly loadExercises: Subject<{ isLoadMore: boolean }> =
    new Subject<{ isLoadMore: boolean }>();
  private readonly loadExercises$: Observable<Pagination> = this.loadExercises
    .asObservable()
    .pipe(
      tap(() => this.isLoadingProhibited.next(true)),
      map(({ isLoadMore }: { isLoadMore: boolean }) => ({
        ...DEFAULT_PAGINATION_STATE,
        firstPage: !isLoadMore,
      })),
      tap(this.findExercises.bind(this)),
      untilDestroyed(this),
    );

  private readonly refreshExercises$ = this.settingsFacade.language$.pipe(
    tap((language) => this.translateService.use(language)),
    skip(1),
    tap(() => this.refreshExercises(DEFAULT_PAGINATION_STATE)),
    untilDestroyed(this),
  );

  private readonly composeWorkout = new Subject<{ id: string; add: boolean }>();
  public readonly composeWorkout$: Observable<
    Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[]
  > = this.composeWorkout.asObservable().pipe(
    scan((exercisesSet, { id, add }) => {
      add ? exercisesSet.add(id) : exercisesSet.delete(id);
      return exercisesSet;
    }, new Set<string>()),
    switchMap((idsSet) => this.exerciseFacade.exercisePreviews$(idsSet)),
    tap(console.log),
  );

  constructor(
    private readonly exerciseFacade: ExercisesFacade,
    private readonly settingsFacade: SettingsFacadeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    this.refreshExercises$.subscribe();
    this.loadExercises$.subscribe();
    this.loadExercises.next({ isLoadMore: false });
    this.exerciseFacade.loadExercisesMeta();
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
    this.loadExercises.next({ isLoadMore });
  }

  public addToComposedWorkout(id: string): void {
    this.composeWorkout.next({ id, add: true });
  }

  public removeFromComposedWorkout(id: string): void {
    this.composeWorkout.next({ id, add: false });
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
