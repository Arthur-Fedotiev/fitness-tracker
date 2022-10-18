import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import {
  Pagination,
  DEFAULT_PAGINATION_STATE,
  loadIsolatedLang,
  WithId,
} from '@fitness-tracker/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import {
  ExerciseDescriptors,
  ExerciseFacade,
  ExerciseListQueryChange,
  ExercisePagination,
  ExerciseResponseDto,
  EXERCISE_DESCRIPTORS_TOKEN,
  SearchOptions,
} from '@fitness-tracker/exercise/domain';
import {
  ComposeWorkoutDialogFactory,
  ComposeWorkoutModule,
  COMPOSE_WORKOUT_DIALOG_FACTORY,
} from '@fitness-tracker/workout/public-api';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RolesModule } from '@fitness-tracker/auth/feature';
import { ExerciseUiComponentsModule } from '@fitness-tracker/exercise/ui-components';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { WorkoutComposeWorkoutUtilsModule } from '@fitness-tracker/workout-compose-workout-utils';
import { WorkoutFiltersModule } from '@fitness-tracker/workout/ui';

enum EXERCISE_MODE {
  'VIEW' = 'view',
  'EDIT' = 'edit',
}

@UntilDestroy()
@Component({
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ExerciseUiComponentsModule,
    FlexLayoutModule,
    MaterialModule,
    ComposeWorkoutModule,
    RolesModule,
    WorkoutFiltersModule,
    WorkoutComposeWorkoutUtilsModule,
    TranslateModule,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayPageComponent implements OnInit, OnDestroy {
  public readonly roles = ROLES;
  public readonly exerciseMode = EXERCISE_MODE;
  public readonly exercisesList$: Observable<ExerciseResponseDto[]> =
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
    tap((filters: SearchOptions['targetMuscles']) =>
      this.targetMusclesSubj.next(filters),
    ),
    map((targetMuscles) => new ExerciseListQueryChange({ targetMuscles })),
    untilDestroyed(this),
  );

  private readonly loadExercises$: Observable<Partial<SearchOptions>> = merge(
    this.loadMoreExercises$,
    this.targetMusclesFromQueries$,
  ).pipe(
    tap(() => this.isLoadingProhibited.next(true)),
    scan(toExerciseLoadState, {} as Partial<SearchOptions>),
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
    Pick<ExerciseResponseDto, 'avatarUrl' | 'id' | 'name'>[]
  > = this.composeWorkout.asObservable().pipe(
    scan((exercisesSet, { id, add }) => {
      add ? exercisesSet.add(id) : exercisesSet.delete(id);
      return exercisesSet;
    }, new Set<string>()),
    switchMap((idsSet) => this.exerciseFacade.exercisePreviews$(idsSet)),
  );

  private readonly targetMusclesSubj = new BehaviorSubject<
    SearchOptions['targetMuscles']
  >([]);
  public readonly targetMuscles$ = this.targetMusclesSubj
    .asObservable()
    .pipe(filter(Boolean), skip(1), first());

  constructor(
    @Inject(COMPOSE_WORKOUT_DIALOG_FACTORY)
    private readonly composeWorkoutDialogFactory: ComposeWorkoutDialogFactory,
    @Inject(EXERCISE_DESCRIPTORS_TOKEN)
    public readonly exerciseDescriptors: ExerciseDescriptors,
    private readonly exerciseFacade: ExerciseFacade,
    private readonly settingsFacade: SettingsFacadeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
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
    workoutExercisesList: Pick<
      ExerciseResponseDto,
      'avatarUrl' | 'id' | 'name'
    >[],
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

  public targetMusclesChanges($event: SearchOptions['targetMuscles']): void {
    this.setMusclesQueryParams($event);
  }

  public trackById(_: number, item: WithId<unknown>): string {
    return item.id;
  }

  private initListeners(): void {
    this.refreshExercises$.subscribe();
    this.loadExercises$.subscribe();
  }

  private setMusclesQueryParams(
    targetMuscles: SearchOptions['targetMuscles'],
  ): void {
    const currentRoute: string = this.router.url.split('?')[0];

    this.router.navigate([currentRoute], {
      queryParams: { targetMuscles: JSON.stringify(targetMuscles) },
    });
  }

  private findExercises(paginationData: Partial<SearchOptions>): void {
    this.exerciseFacade.findExercises(paginationData);
  }

  private refreshExercises(paginationData: Pagination): void {
    this.exerciseFacade.refreshExercises(paginationData);
  }

  private releaseResources(): void {
    this.exerciseFacade.emptyExercisesList();
  }
}
