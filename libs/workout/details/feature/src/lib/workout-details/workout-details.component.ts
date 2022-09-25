import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { loadIsolatedLang } from '@fitness-tracker/shared/utils';
import {
  SerializedWorkout,
  WorkoutFacadeService,
} from '@fitness-tracker/workout/data';
import { filter, Observable, skip, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ft-workout-details',
  templateUrl: './workout-details.component.html',
  styleUrls: ['./workout-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutDetailsComponent implements OnInit {
  private workoutId!: string;

  public readonly workoutDetails$: Observable<SerializedWorkout> =
    this.workoutFacade.workoutDetails$.pipe(filter(Boolean));

  public readonly updateWorkoutDetails$ = this.settingsFacade.language$.pipe(
    skip(1),
    tap(() => this.workoutFacade.loadWorkoutDetails(this.workoutId)),
  );

  private readonly refreshLang$ = this.settingsFacade.language$.pipe(
    loadIsolatedLang(this.translateService),
    untilDestroyed(this),
  );

  constructor(
    private readonly workoutFacade: WorkoutFacadeService,
    private readonly settingsFacade: SettingsFacadeService,
    private readonly exercisesFacade: ExercisesFacade,
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initData();
    this.initListeners();
  }

  public showExerciseDetails(id: string): void {
    this.exercisesFacade.openExerciseDetailsDialog(id);
  }

  private initData(): void {
    this.workoutId = this.route.snapshot.paramMap.get('id') as string;
    this.workoutFacade.loadWorkoutDetails(this.workoutId);
  }

  private initListeners(): void {
    this.updateWorkoutDetails$.subscribe();
    this.refreshLang$.subscribe();
  }
}
