import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
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
import { WorkoutFiltersComponent } from '@fitness-tracker/shared/ui/components';

type TargetMuscles = ExerciseDescriptors['muscles'];

@UntilDestroy()
@Component({
  selector: 'ft-workouts-display',
  templateUrl: './workouts-display.component.html',
  styleUrls: ['./workouts-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WorkoutFiltersComponent,
    NgIf,
    WorkoutListComponent,
    WorkoutPreviewComponent,
    TranslateModule,
    AsyncPipe,
  ],
})
export class WorkoutsDisplayComponent implements OnInit {
  public readonly workoutPreviews$: Observable<WorkoutPreview[]> =
    this.workoutFacade.workoutPreviews$.pipe(filter(Boolean));

  public readonly queryParams$ = this.route.queryParamMap.pipe(
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

  private readonly targetMusclesSubj = new BehaviorSubject<TargetMuscles>([]);
  public readonly targetMuscles$ = this.targetMusclesSubj
    .asObservable()
    .pipe(skip(1), first());

  private readonly openEditWorkout$ = this.workoutFacade.workoutDetails$.pipe(
    filter(Boolean),
    tap(({ content, ...basicInfo }) => {
      this.router.navigate(['workouts', 'compose'], {
        state: { workoutExercisesList: content, workoutBasicInfo: basicInfo },
      });
    }),
    untilDestroyed(this),
  );

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
    this.workoutFacade.loadWorkoutDetails(id);
  }

  public deleteWorkout(id: string): void {
    this.workoutFacade.deleteWorkout(id);
  }

  private initListeners(): void {
    this.queryParams$.subscribe();
    this.openEditWorkout$.subscribe();
  }

  private setMusclesQueryParams(targetMuscles: TargetMuscles): void {
    const currentRoute: string = this.router.url.split('?')[0];

    this.router.navigate([currentRoute], {
      queryParams: { targetMuscles: JSON.stringify(targetMuscles) },
    });
  }
}
