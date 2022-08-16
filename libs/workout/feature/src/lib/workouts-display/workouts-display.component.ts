import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { TargetMuscles } from '@fitness-tracker/shared/utils';
import { MatDialogConfig } from '@angular/material/dialog';
import { ComposeWorkoutComponent } from '@fitness-tracker/shared/dialogs';
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

  constructor(
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
    this.workoutFacade.editWorkout(id);
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
