import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ImgFallbackDirective } from '@fitness-tracker/shared/utils';

import { filter, skip, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExerciseFacade } from '@fitness-tracker/exercise/domain';
import { WorkoutFacadeService } from '@fitness-tracker/workout-domain';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import {
  NgIf,
  NgFor,
  NgTemplateOutlet,
  AsyncPipe,
  UpperCasePipe,
  TitleCasePipe,
} from '@angular/common';
import { getLanguageRefresh$ } from '@fitness-tracker/shared/i18n/domain';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@UntilDestroy()
@Component({
  selector: 'ft-workout-details',
  templateUrl: './workout-details.component.html',
  styleUrls: ['./workout-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgTemplateOutlet,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    MatCardModule,
    MatDividerModule,
    ImgFallbackDirective,
    MatButtonModule,
    AsyncPipe,
    UpperCasePipe,
    TitleCasePipe,
  ],
})
export class WorkoutDetailsComponent implements OnInit {
  private workoutId!: string;

  public readonly workoutDetails$ = this.workoutFacade.workoutDetails$.pipe(
    filter(Boolean),
  );

  public readonly updateWorkoutDetails$ = this.settingsFacade.language$.pipe(
    skip(1),
    tap(() => this.workoutFacade.loadWorkoutDetails(this.workoutId)),
  );

  private readonly refreshLang$ = getLanguageRefresh$().pipe(
    untilDestroyed(this),
  );

  constructor(
    private readonly workoutFacade: WorkoutFacadeService,
    private readonly settingsFacade: SettingsFacadeService,
    private readonly exercisesFacade: ExerciseFacade,
    private readonly route: ActivatedRoute,
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
