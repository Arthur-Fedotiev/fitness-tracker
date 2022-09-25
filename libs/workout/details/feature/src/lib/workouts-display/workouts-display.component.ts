import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  WorkoutBasicInfo,
  WorkoutDetails,
  WorkoutFacadeService,
  WorkoutItem,
} from '@fitness-tracker/workout/data';
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

import { ComposeWorkoutComponent } from '@fitness-tracker/workout/compose-workout/feature';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TargetMuscles } from '@fitness-tracker/exercises/model';
import { SerializerStrategy } from '@fitness-tracker/shared/utils';

@UntilDestroy()
@Component({
  selector: 'ft-workouts-display',
  templateUrl: './workouts-display.component.html',
  styleUrls: ['./workouts-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    tap(({ content, ...basicInfo }: WorkoutDetails) =>
      this.dialog.open(
        ComposeWorkoutComponent,
        this.getDialogConfig(
          content.map((item) => this.workoutSerializer.deserialize(item)),
          basicInfo,
        ),
      ),
    ),
    untilDestroyed(this),
  );

  constructor(
    private readonly workoutFacade: WorkoutFacadeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly workoutSerializer: SerializerStrategy,
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

  private getDialogConfig(
    workoutContent: WorkoutItem[],
    workoutBasicInfo?: WorkoutBasicInfo,
  ) {
    const dialogConfig = Object.assign(new MatDialogConfig(), {
      disableClose: true,
      autoFocus: true,
      minWidth: '100vw',
      minHeight: '100vh',
      height: '100%',
      data: { workoutContent, workoutBasicInfo },
    });

    return dialogConfig;
  }
}
