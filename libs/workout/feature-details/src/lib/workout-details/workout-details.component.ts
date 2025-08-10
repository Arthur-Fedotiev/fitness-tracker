import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';

import { filter, skip, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ExerciseFacade } from '@fitness-tracker/exercise/domain';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import { WorkoutFacadeService } from '@fitness-tracker/workout-domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';

import { AsyncPipe, NgTemplateOutlet, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getLanguageRefresh$ } from '@fitness-tracker/shared/i18n/domain';

@UntilDestroy()
@Component({
  selector: 'ft-workout-details',
  templateUrl: './workout-details.component.html',
  styleUrls: ['./workout-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    AsyncPipe,
    UpperCasePipe,
    TitleCasePipe,
  ],
})
export class WorkoutDetailsComponent implements OnInit {
  private readonly workoutFacade = inject(WorkoutFacadeService);
  private readonly settingsFacade = inject(SettingsFacadeService);
  private readonly exercisesFacade = inject(ExerciseFacade);

  workoutId = input.required<string>();

  public readonly workoutDetails$ = this.workoutFacade.workoutDetails$.pipe(filter(Boolean));

  public readonly updateWorkoutDetails$ = this.settingsFacade.language$.pipe(
    skip(1),
    tap(() => this.workoutFacade.loadWorkoutDetails(this.workoutId())),
  );

  private readonly refreshLang$ = getLanguageRefresh$().pipe(untilDestroyed(this));

  ngOnInit(): void {
    this.initData();
    this.initListeners();
  }

  public showExerciseDetails(id: string): void {
    this.exercisesFacade.openExerciseDetailsDialog(id);
  }

  private initData(): void {
    this.workoutFacade.loadWorkoutDetails(this.workoutId());
  }

  private initListeners(): void {
    this.updateWorkoutDetails$.subscribe();
    this.refreshLang$.subscribe();
  }
}
