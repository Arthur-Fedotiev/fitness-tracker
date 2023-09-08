import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
  computed,
  signal,
  effect,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {
  Pagination,
  DEFAULT_PAGINATION_STATE,
} from '@fitness-tracker/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
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
  tap,
} from 'rxjs';

import { ROLES } from 'shared-package';
import { debounce, isEqual } from 'lodash-es';
import { toExerciseLoadState, toLoadMoreAction } from './utils/mappers';
import {
  ExerciseDescriptors,
  ExerciseFacade,
  ExerciseListQueryChange,
  ExercisePagination,
  EXERCISE_DESCRIPTORS_TOKEN,
  SearchOptions,
  ExerciseResponseDto,
} from '@fitness-tracker/exercise/domain';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ExerciseListComponent } from '@fitness-tracker/exercise/ui-components';
import { MatButtonModule } from '@angular/material/button';
import { MuscleMultiSelectComponent } from '@fitness-tracker/shared/ui/components';
import { getLanguageRefresh$ } from '@fitness-tracker/shared/i18n/domain';
import { MatIconModule } from '@angular/material/icon';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { AuthFacadeService } from '@fitness-tracker/auth/domain';
import { selectUserInfo } from '@fitness-tracker/auth/domain';

enum EXERCISE_MODE {
  'VIEW' = 'view',
  'EDIT' = 'edit',
}

enum ExerciseOwner {
  FitnessTracker = 'FitnessTracker',
  User = 'User',
  All = 'All',
}

@UntilDestroy()
@Component({
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatInputModule,
    MatExpansionModule,
    MatBadgeModule,
    MatCardModule,
    ExerciseListComponent,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MuscleMultiSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatExpansionPanel) composedWorkoutPanel: MatExpansionPanel | null =
    null;

  public readonly roles = ROLES;
  public readonly exerciseMode = EXERCISE_MODE;
  public readonly ExerciseOwner = ExerciseOwner;
  public readonly exercisesList = this.exerciseFacade.exercisesList;
  public readonly userInfo = this.authFacade.userInfo;
  public readonly isLoadingProhibited = signal(false);
  public readonly searchQuery = signal('');

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

  protected selectedForWorkoutIds = signal(new Set<string>());
  protected exercises = computed(() =>
    this.exercisesList()
      .filter(this.byExerciseOwner)
      .filter(this.bySearchQuery),
  );

  protected selectedForWorkoutExercises = computed(() =>
    this.exercises().filter((exercise) =>
      this.selectedForWorkoutIds().has(exercise.id),
    ),
  );

  private readonly loadExercises$: Observable<Partial<SearchOptions>> = merge(
    this.loadMoreExercises$,
    this.targetMusclesFromQueries$,
  ).pipe(
    tap(() => this.isLoadingProhibited.set(true)),
    scan(toExerciseLoadState, {} as Partial<SearchOptions>),
    skip(1),
    tap(this.findExercises.bind(this)),
    untilDestroyed(this),
  );

  private readonly refreshExercises$ = getLanguageRefresh$().pipe(
    skip(1),
    tap(() => this.refreshExercises(DEFAULT_PAGINATION_STATE)),
    untilDestroyed(this),
  );

  private readonly targetMusclesSubj = new BehaviorSubject<
    SearchOptions['targetMuscles']
  >([]);
  public readonly targetMuscles$ = this.targetMusclesSubj
    .asObservable()
    .pipe(filter(Boolean), skip(1), first());

  protected exerciseOwner = signal(ExerciseOwner.All);
  protected isWorkoutCreationMode = false;

  constructor(
    @Inject(EXERCISE_DESCRIPTORS_TOKEN)
    public readonly exerciseDescriptors: ExerciseDescriptors,
    private readonly exerciseFacade: ExerciseFacade,
    private readonly authFacade: AuthFacadeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    effect(
      () => this.exercises().length && this.isLoadingProhibited.set(false),
      {
        allowSignalWrites: true,
      },
    );

    effect(
      () =>
        this.selectedForWorkoutIds().size === 0 &&
        this.composedWorkoutPanel?.close(),
    );
  }

  public ngOnInit() {
    this.initListeners();
    this.loadExercisesSubj.next({ isLoadMore: false });
  }

  public ngOnDestroy() {
    this.releaseResources();
  }

  public navigate(mode: EXERCISE_MODE, id: string) {
    this.router.navigate(['..', id, mode], { relativeTo: this.route });
  }

  public deleteExercise(id: string) {
    this.exerciseFacade.deleteExercise(id);
  }

  public loadMoreExercises(isLoadMore: boolean) {
    this.loadExercisesSubj.next({ isLoadMore });
  }

  public addToComposedWorkout(id: string) {
    this.selectedForWorkoutIds.mutate((ids) => ids.add(id));
  }

  public removeFromComposedWorkout(id: string) {
    this.selectedForWorkoutIds.mutate((ids) => ids.delete(id));
  }
  public cancelComposing() {
    this.isWorkoutCreationMode = false;
    this.selectedForWorkoutIds.mutate((ids) => ids.clear());
  }

  public showExerciseDetails(id: string) {
    this.exerciseFacade.openExerciseDetailsDialog(id);
  }

  public finishComposing() {
    this.router.navigate(['workouts', 'compose'], {
      state: {
        workoutExercisesList: this.selectedForWorkoutExercises(),
      },
    });
  }

  public targetMusclesChanges($event: SearchOptions['targetMuscles']) {
    this.setMusclesQueryParams($event);
  }

  protected onExerciseOwnerChanges({ value }: MatButtonToggleChange) {
    this.exerciseOwner.set(value);
  }

  private initListeners() {
    this.refreshExercises$.subscribe();
    this.loadExercises$.subscribe();
  }

  private setMusclesQueryParams(targetMuscles: SearchOptions['targetMuscles']) {
    const currentRoute: string = this.router.url.split('?')[0];

    this.router.navigate([currentRoute], {
      queryParams: { targetMuscles: JSON.stringify(targetMuscles) },
    });
  }

  private findExercises(paginationData: Partial<SearchOptions>) {
    this.exerciseFacade.findExercises(paginationData);
  }

  private refreshExercises(paginationData: Pagination) {
    this.exerciseFacade.refreshExercises(paginationData);
  }

  private releaseResources() {
    this.exerciseFacade.emptyExercisesList();
  }

  protected onSearchChanges = debounce((searchQuery: string) => {
    this.searchQuery.set(searchQuery);
  }, 100);

  private byExerciseOwner = ({ userId }: ExerciseResponseDto) => {
    switch (this.exerciseOwner()) {
      case ExerciseOwner.FitnessTracker:
        return !userId || userId !== this.userInfo()?.uid;
      case ExerciseOwner.User:
        return userId === this.userInfo()?.uid;
      case ExerciseOwner.All:
        return true;
    }
  };

  private bySearchQuery: (value: ExerciseResponseDto) => boolean = ({ name }) =>
    name.toLowerCase().includes(this.searchQuery().toLowerCase());
}
