import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import {
  ExerciseListQueryChange,
  ExercisePagination,
  ExercisesEntity,
  ExerciseVM,
  EXERCISE_MODE,
  SearchOptions,
  TargetMuscles,
} from '@fitness-tracker/exercises/model';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import {
  Pagination,
  DEFAULT_PAGINATION_STATE,
  loadIsolatedLang,
} from '@fitness-tracker/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  map,
  merge,
  Observable,
  scan,
  skip,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { ROLES } from 'shared-package';
import { isEqual } from 'lodash-es';
import { toExerciseLoadState, toLoadMoreAction } from './utils/mappers';
import { ConcreteWorkoutItemSerializer } from '@fitness-tracker/workout/data';
import {
  ComposeWorkoutDialogFactory,
  COMPOSE_WORKOUT_DIALOG_FACTORY,
} from '@fitness-tracker/workout-compose-workout-utils';

@UntilDestroy()
@Component({
  selector: 'ft-exercises-display',
  templateUrl: './exercises-display.component.html',
  styleUrls: ['./exercises-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesDisplayComponent implements OnInit, OnDestroy {
  public readonly roles = ROLES;
  public readonly exerciseMode = EXERCISE_MODE;
  public readonly exercisesList$: Observable<ExerciseVM[]> =
    this.exerciseFacade.exercisesList$.pipe(
      tap(() => this.isLoadingProhibited.next(false)),
    );

  private readonly isLoadingProhibited = new BehaviorSubject(false);
  public readonly isLoadingProhibited$ =
    this.isLoadingProhibited.asObservable();

  private readonly loadExercisesSubj: Subject<{ isLoadMore: boolean }> =
    new Subject<{ isLoadMore: boolean }>();
  private readonly loadMoreExercises$: Observable<ExercisePagination> =
    this.loadExercisesSubj.asObservable().pipe(map(toLoadMoreAction));

  public readonly targetMusclesFromQueries$ = this.route.queryParamMap.pipe(
    map((queryParams: ParamMap) => queryParams.get('targetMuscles')),
    debounceTime(500),
    distinctUntilChanged(isEqual),
    map((targetMuscles: string | null) =>
      targetMuscles ? JSON.parse(targetMuscles) : [],
    ),
    tap((filters: TargetMuscles) => this.targetMusclesSubj.next(filters)),
    map((targetMuscles) => new ExerciseListQueryChange({ targetMuscles })),
    untilDestroyed(this),
  );
  private readonly loadExercises$: Observable<Pagination> = merge(
    this.loadMoreExercises$,
    this.targetMusclesFromQueries$,
  ).pipe(
    tap(() => this.isLoadingProhibited.next(true)),
    scan(
      toExerciseLoadState,
      {} as Pick<SearchOptions, 'pageSize' | 'firstPage' | 'targetMuscles'>,
    ),
    skip(1),
    tap(this.findExercises.bind(this)),
    untilDestroyed(this),
  );

  private readonly refreshExercises$ = this.settingsFacade.language$.pipe(
    loadIsolatedLang(this.translateService),
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
  );

  private readonly targetMusclesSubj = new BehaviorSubject<TargetMuscles>([]);
  public readonly targetMuscles$ = this.targetMusclesSubj
    .asObservable()
    .pipe(filter(Boolean), skip(1), first());

  constructor(
    @Inject(COMPOSE_WORKOUT_DIALOG_FACTORY)
    private readonly composeWorkoutDialogFactory: ComposeWorkoutDialogFactory,
    private readonly exerciseFacade: ExercisesFacade,
    private readonly settingsFacade: SettingsFacadeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
    private readonly workoutSerializer: ConcreteWorkoutItemSerializer,
  ) {}

  public ngOnInit(): void {
    this.initListeners();
    this.loadExercisesSubj.next({ isLoadMore: false });
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
    this.loadExercisesSubj.next({ isLoadMore });
  }

  public addToComposedWorkout(id: string): void {
    this.composeWorkout.next({ id, add: true });
  }

  public proceedComposing(
    workoutExercisesList: Pick<ExercisesEntity, 'avatarUrl' | 'id' | 'name'>[],
  ): void {
    const { component, config } =
      this.composeWorkoutDialogFactory.createDialog(workoutExercisesList);

    this.dialog.open(component, config);
  }

  public showExerciseDetails(id: string): void {
    this.exerciseFacade.openExerciseDetailsDialog(id);
  }

  public removeFromComposedWorkout(id: string): void {
    this.composeWorkout.next({ id, add: false });
  }

  public targetMusclesChanges($event: TargetMuscles): void {
    this.setMusclesQueryParams($event);
  }

  private initListeners(): void {
    this.refreshExercises$.subscribe();
    this.loadExercises$.subscribe();
  }

  private setMusclesQueryParams(targetMuscles: TargetMuscles): void {
    const currentRoute: string = this.router.url.split('?')[0];

    this.router.navigate([currentRoute], {
      queryParams: { targetMuscles: JSON.stringify(targetMuscles) },
    });
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
