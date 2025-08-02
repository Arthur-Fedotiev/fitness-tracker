import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  signal,
  computed,
  OnDestroy,
} from '@angular/core';
import { WorkoutFacadeService } from '@fitness-tracker/workout-domain';
import { WorkoutPreview } from '@fitness-tracker/workout-domain';
import {
  tap,
  debounceTime,
  BehaviorSubject,
  map,
  first,
  skip,
  distinctUntilChanged,
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { isEqual } from 'lodash-es';

import {
  ExerciseDescriptors,
  EXERCISE_DESCRIPTORS_TOKEN,
} from '@fitness-tracker/exercise/public-api';
import { TranslateModule } from '@ngx-translate/core';
import {
  WorkoutListComponent,
  WorkoutPreviewComponent,
} from '@fitness-tracker/workout/ui';
import { AsyncPipe } from '@angular/common';
import { MuscleMultiSelectComponent } from '@fitness-tracker/shared/ui/components';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AuthFacadeService } from '@fitness-tracker/auth/domain';
import { WorkoutPreviewVM } from '@fitness-tracker/workout/ui';
import { MAX_WORKOUT_WITH_PRIORITY } from './constants';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toWorkoutPreviewVM } from './mappers';

type TargetMuscles = ExerciseDescriptors['muscles'];

enum WorkoutOwner {
  FitnessTracker = 'FitnessTracker',
  User = 'User',
  All = 'All',
}

@UntilDestroy()
@Component({
  selector: 'ft-workouts-display',
  templateUrl: './workouts-display.component.html',
  styleUrls: ['./workouts-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MuscleMultiSelectComponent,
    WorkoutListComponent,
    WorkoutPreviewComponent,
    TranslateModule,
    AsyncPipe,
    MatButtonToggleModule,
    MatProgressSpinnerModule
],
})
export class WorkoutsDisplayComponent implements OnInit, OnDestroy {
  protected readonly workoutPreviews = this.workoutFacade.workoutPreviews;
  protected readonly areWorkoutsLoading = this.workoutFacade.areWorkoutsLoading;
  protected readonly userInfo = this.authFacade.userInfo;
  protected readonly isAdmin = toSignal(this.authFacade.isAdmin$, {
    initialValue: false,
  });

  protected readonly ExerciseOwner = WorkoutOwner;
  protected readonly workoutOwner = signal(WorkoutOwner.All);
  protected readonly ownerPredicateMap = {
    [WorkoutOwner.FitnessTracker]: (workout: WorkoutPreview) => !workout.userId,
    [WorkoutOwner.User]: (workout: WorkoutPreview) =>
      workout.userId === this.userInfo()?.uid,
    [WorkoutOwner.All]: () => true,
  };

  protected readonly queryParams$ = this.route.queryParamMap.pipe(
    map((queryParams: ParamMap) => queryParams.get('targetMuscles')),
    debounceTime(500),
    distinctUntilChanged(isEqual),
    map((targetMuscles) => (targetMuscles ? JSON.parse(targetMuscles) : [])),
    tap((filters: TargetMuscles) =>
      this.workoutFacade.loadWorkoutPreviews(filters),
    ),
    tap((filters: TargetMuscles) => this.targetMusclesSubj.next(filters)),
    untilDestroyed(this),
  );

  protected workoutPreviewVMs = computed(() =>
    this.workoutPreviews().map(
      toWorkoutPreviewVM(this.isAdmin(), this.userInfo()?.uid),
    ),
  );

  protected workouts = computed(() =>
    this.workoutPreviewVMs().filter(
      this.ownerPredicateMap[this.workoutOwner()],
    ),
  );

  private readonly targetMusclesSubj = new BehaviorSubject<TargetMuscles>([]);
  protected readonly targetMuscles$ = this.targetMusclesSubj
    .asObservable()
    .pipe(skip(1), first());

  constructor(
    @Inject(EXERCISE_DESCRIPTORS_TOKEN)
    protected readonly exerciseDescriptors: ExerciseDescriptors,
    private readonly workoutFacade: WorkoutFacadeService,
    private readonly authFacade: AuthFacadeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.initListeners();
  }

  ngOnDestroy() {
    this.releaseResources();
  }

  protected targetMusclesChanges($event: TargetMuscles) {
    this.setMusclesQueryParams($event);
  }

  protected editWorkout(id: string) {
    this.router.navigate(['workouts', 'compose'], {
      queryParams: { workoutId: id },
    });
  }

  protected deleteWorkout(id: string) {
    this.workoutFacade.deleteWorkout(id);
  }

  private initListeners() {
    this.queryParams$.subscribe();
  }

  private setMusclesQueryParams(targetMuscles: TargetMuscles) {
    const currentRoute: string = this.router.url.split('?')[0];

    this.router.navigate([currentRoute], {
      queryParams: { targetMuscles: JSON.stringify(targetMuscles) },
    });
  }

  protected releaseResources() {
    this.workoutFacade.releaseWorkoutDisplayResources();
  }
}
