import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, computed, signal, effect, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
import {
  toExerciseLoadState,
  toLoadMoreAction,
  toExerciseVM,
} from './utils/mappers';
import {
  ExerciseDescriptors,
  ExerciseFacade,
  EXERCISE_DESCRIPTORS_TOKEN,
  FindExercisesSearchOptions,
  ExerciseListQueryChange,
  ExercisePagination,
  SearchExercisesState,
} from '@fitness-tracker/exercise/domain';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';

import {
  ExerciseListComponent,
  ExerciseVM,
} from '@fitness-tracker/exercise/ui-components';
import { MatButtonModule } from '@angular/material/button';
import { MuscleMultiSelectComponent } from '@fitness-tracker/shared/ui/components';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatFormFieldModule,
    MatButtonToggleModule,
    MatInputModule,
    MatExpansionModule,
    MatBadgeModule,
    MatCardModule,
    ExerciseListComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MuscleMultiSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayPageComponent implements OnInit, OnDestroy {
  protected readonly exerciseDescriptors = inject<ExerciseDescriptors>(EXERCISE_DESCRIPTORS_TOKEN);
  private readonly exerciseFacade = inject(ExerciseFacade);
  private readonly authFacade = inject(AuthFacadeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @ViewChild(MatExpansionPanel) composedWorkoutPanel: MatExpansionPanel | null =
    null;

  protected readonly roles = ROLES;
  protected readonly exerciseMode = EXERCISE_MODE;
  protected readonly ExerciseOwner = ExerciseOwner;
  protected readonly exercisesList = this.exerciseFacade.exercisesList;
  protected readonly areExercisesLoading =
    this.exerciseFacade.areExercisesLoading;
  protected readonly userInfo = this.authFacade.userInfo;
  protected readonly searchQuery = signal('');

  protected readonly isAdmin = toSignal(this.authFacade.isAdmin$, {
    initialValue: false,
  });

  private readonly loadExercisesSubj: Subject<{ isLoadMore: boolean }> =
    new Subject<{ isLoadMore: boolean }>();
  private readonly loadMoreExercises$: Observable<ExercisePagination> =
    this.loadExercisesSubj.asObservable().pipe(map(toLoadMoreAction));

  protected readonly targetMusclesFromQueries$ = this.route.queryParamMap.pipe(
    map((queryParams: ParamMap) => queryParams.get('targetMuscles')),
    debounceTime(500),
    distinctUntilChanged(isEqual),
    map((targetMuscles: string | null) =>
      targetMuscles ? (JSON.parse(targetMuscles) as string[]) : [],
    ),
    tap((targetMuscles) => this.targetMusclesSubj.next(targetMuscles)),
    map((targetMuscles) => new ExerciseListQueryChange({ targetMuscles })),
    untilDestroyed(this),
  );

  protected selectedForWorkoutIds = signal(new Set<string>());
  protected exerciseVMs = computed<ExerciseVM[]>(() =>
    this.exercisesList().map(
      toExerciseVM(
        this.isAdmin(),
        this.userInfo()?.uid,
        this.selectedForWorkoutIds(),
      ),
    ),
  );

  protected filteredExerciseVMs = computed(() =>
    this.exerciseVMs().filter(this.byExerciseOwner).filter(this.bySearchQuery),
  );

  protected selectedForWorkoutExercises = computed(() =>
    this.filteredExerciseVMs().filter((exercise) =>
      this.selectedForWorkoutIds().has(exercise.id),
    ),
  );

  private readonly loadExercises$ = merge(
    this.loadMoreExercises$,
    this.targetMusclesFromQueries$,
  ).pipe(
    scan(toExerciseLoadState, {} as SearchExercisesState),
    skip(1),
    tap(this.findExercises.bind(this)),
    untilDestroyed(this),
  );

  private readonly targetMusclesSubj = new BehaviorSubject<
    FindExercisesSearchOptions['targetMuscles']
  >([]);
  protected readonly targetMuscles$ = this.targetMusclesSubj
    .asObservable()
    .pipe(filter(Boolean), skip(1), first());

  protected exerciseOwner = signal(ExerciseOwner.All);
  protected isWorkoutCreationMode = false;

  constructor() {
    effect(
      () =>
        this.selectedForWorkoutIds().size === 0 &&
        this.composedWorkoutPanel?.close(),
    );
  }

  ngOnInit() {
    this.initListeners();
    this.loadExercisesSubj.next({ isLoadMore: false });
  }

  ngOnDestroy() {
    this.releaseResources();
  }

  protected navigate(mode: EXERCISE_MODE, id: string) {
    this.router.navigate(['..', id, mode], { relativeTo: this.route });
  }

  protected deleteExercise(id: string) {
    this.exerciseFacade.deleteExercise(id);
  }

  protected loadMoreExercises(isLoadMore: boolean) {
    this.loadExercisesSubj.next({ isLoadMore });
  }

  protected addToComposedWorkout(id: string) {
    this.selectedForWorkoutIds.update((ids) => {
      const newIds = new Set(ids);
      newIds.add(id);
      return newIds;
    });
  }

  protected removeFromComposedWorkout(id: string) {
    this.selectedForWorkoutIds.update((ids) => {
      const newIds = new Set(ids);
      newIds.delete(id);
      return newIds;
    });
  }

  protected cancelComposing() {
    this.isWorkoutCreationMode = false;
    this.selectedForWorkoutIds.update(() => new Set<string>());
  }


  protected showExerciseDetails(id: string) {
    this.exerciseFacade.openExerciseDetailsDialog(id);
  }

  protected finishComposing() {
    this.router.navigate(['workouts', 'compose'], {
      state: {
        workoutExercisesList: this.selectedForWorkoutExercises(),
      },
    });
  }

  protected targetMusclesChanges(
    $event: FindExercisesSearchOptions['targetMuscles'],
  ) {
    this.setMusclesQueryParams($event);
  }

  protected onExerciseOwnerChanges({ value }: MatButtonToggleChange) {
    this.exerciseOwner.set(value);
  }

  protected onSearchChanges = debounce((searchQuery: string) => {
    this.searchQuery.set(searchQuery);
  }, 100);

  private initListeners() {
    this.loadExercises$.subscribe();
  }

  private setMusclesQueryParams(
    targetMuscles: FindExercisesSearchOptions['targetMuscles'],
  ) {
    const currentRoute: string = this.router.url.split('?')[0];

    this.router.navigate([currentRoute], {
      queryParams: { targetMuscles: JSON.stringify(targetMuscles) },
    });
  }

  private findExercises(paginationData: FindExercisesSearchOptions) {
    this.exerciseFacade.findExercises(paginationData);
  }

  private readonly byExerciseOwner = ({ userId }: ExerciseVM) => {
    switch (this.exerciseOwner()) {
      case ExerciseOwner.FitnessTracker:
        return !userId || userId !== this.userInfo()?.uid;
      case ExerciseOwner.User:
        return userId === this.userInfo()?.uid;
      case ExerciseOwner.All:
        return true;
    }
  };

  private readonly bySearchQuery: (value: ExerciseVM) => boolean = ({ name }) =>
    name.toLowerCase().includes(this.searchQuery().toLowerCase());

  private releaseResources() {
    this.exerciseFacade.emptyExercisesList();
  }
}
