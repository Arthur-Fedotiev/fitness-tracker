import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import {
  ExerciseMetaCollectionsDictionaryUnit,
  MUSCLE_KEYS,
} from '@fitness-tracker/exercises/model';
import { WorkoutFacadeService } from '@fitness-tracker/workout/data';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
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
@UntilDestroy()
@Component({
  selector: 'ft-workouts-display',
  templateUrl: './workouts-display.component.html',
  styleUrls: ['./workouts-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutsDisplayComponent implements OnInit {
  public readonly metaCollections$: Observable<ExerciseMetaCollectionsDictionaryUnit> =
    this.exercisesFacade.exercisesMetaCollections$.pipe(filter(Boolean));

  public readonly workoutPreviews$: Observable<WorkoutPreview[]> =
    this.workoutFacade.workoutPreviews$.pipe(filter(Boolean));

  public readonly queryParams$ = this.route.queryParamMap.pipe(
    map((queryParams: ParamMap) => queryParams.get('targetMuscles')),
    debounceTime(500),
    distinctUntilChanged(isEqual),
    map((targetMuscles) => (targetMuscles ? JSON.parse(targetMuscles) : [])),
    tap((filters: typeof MUSCLE_KEYS[number][]) =>
      this.workoutFacade.loadWorkoutPreviews(filters),
    ),
    tap((filters: typeof MUSCLE_KEYS[number][]) =>
      this.targetMusclesSubj.next(filters),
    ),
    untilDestroyed(this),
  );

  private readonly targetMusclesSubj = new BehaviorSubject<
    typeof MUSCLE_KEYS[number][]
  >([]);
  public readonly targetMuscles$ = this.targetMusclesSubj
    .asObservable()
    .pipe(skip(1), first());

  constructor(
    private readonly workoutFacade: WorkoutFacadeService,
    private readonly exercisesFacade: ExercisesFacade,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.initListeners();
    this.exercisesFacade.loadExercisesMeta();
  }

  public targetMusclesChanges($event: typeof MUSCLE_KEYS[number][]): void {
    this.setMusclesQueryParams($event);
  }

  private initListeners(): void {
    this.queryParams$.subscribe();
  }

  private setMusclesQueryParams(
    targetMuscles: typeof MUSCLE_KEYS[number][],
  ): void {
    const currentRoute: string = this.router.url.split('?')[0];

    this.router.navigate([currentRoute], {
      queryParams: { targetMuscles: JSON.stringify(targetMuscles) },
    });
  }
}
