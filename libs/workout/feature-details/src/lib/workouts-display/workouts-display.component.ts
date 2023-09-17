import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  signal,
  inject,
  computed,
} from '@angular/core';
import { WorkoutFacadeService } from '@fitness-tracker/workout-domain';
import { WorkoutPreview } from '@fitness-tracker/workout-domain';
import {
  Observable,
  filter,
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
import { NgIf, AsyncPipe } from '@angular/common';
import { MuscleMultiSelectComponent } from '@fitness-tracker/shared/ui/components';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AuthFacadeService } from '@fitness-tracker/auth/domain';
import { WorkoutPreviewVM } from '@fitness-tracker/workout/ui';
import { MAX_WORKOUT_WITH_PRIORITY } from './constants';

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
    NgIf,
    WorkoutListComponent,
    WorkoutPreviewComponent,
    TranslateModule,
    AsyncPipe,
    MatButtonToggleModule,
  ],
})
export class WorkoutsDisplayComponent implements OnInit {
  protected readonly workoutPreviews = this.workoutFacade.workoutPreviews;
  public readonly userInfo = inject(AuthFacadeService).userInfo;

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
      (workoutPreview, idx) =>
        ({
          ...workoutPreview,
          hasPriority: idx <= MAX_WORKOUT_WITH_PRIORITY,
        } satisfies WorkoutPreviewVM),
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
    public readonly exerciseDescriptors: ExerciseDescriptors,
    private readonly workoutFacade: WorkoutFacadeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.initListeners();
  }

  public targetMusclesChanges($event: TargetMuscles): void {
    this.setMusclesQueryParams($event);
  }

  public editWorkout(id: string): void {
    this.router.navigate(['workouts', 'compose'], {
      queryParams: { workoutId: id },
    });
  }

  public deleteWorkout(id: string): void {
    this.workoutFacade.deleteWorkout(id);
  }

  private initListeners(): void {
    this.queryParams$.subscribe();
  }

  private setMusclesQueryParams(targetMuscles: TargetMuscles): void {
    const currentRoute: string = this.router.url.split('?')[0];

    this.router.navigate([currentRoute], {
      queryParams: { targetMuscles: JSON.stringify(targetMuscles) },
    });
  }
}
