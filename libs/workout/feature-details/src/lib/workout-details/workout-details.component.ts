import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';

import { filter } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {
  OPEN_EXERCISE_DETAILS_DIALOG_COMMAND,
  OpenExerciseDetailsDialogCommand,
} from '@fitness-tracker/exercise/public-api';
import { WorkoutFacadeService } from '@fitness-tracker/workout-domain';
import { UntilDestroy } from '@ngneat/until-destroy';

import { AsyncPipe, NgTemplateOutlet, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  INSTRUCTION_TYPE_LABELS,
  INSTRUCTION_UNIT_LABELS,
  PROFICIENCY_LEVEL_LABELS,
} from '@fitness-tracker/shared/utils';

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
  private readonly exerciseDetailsDialogCommand =
    inject<OpenExerciseDetailsDialogCommand>(
      OPEN_EXERCISE_DETAILS_DIALOG_COMMAND,
    );

  workoutId = input.required<string>({ alias: 'id' });

  public readonly workoutDetails$ = this.workoutFacade.workoutDetails$.pipe(filter(Boolean));

  protected readonly levelLabels = PROFICIENCY_LEVEL_LABELS;
  protected readonly instructionTypeLabels = INSTRUCTION_TYPE_LABELS;
  protected readonly instructionUnitLabels = INSTRUCTION_UNIT_LABELS;

  ngOnInit(): void {
    this.initData();
  }

  public showExerciseDetails(id: string): void {
    this.exerciseDetailsDialogCommand.openExerciseDetailsDialog(id);
  }

  private initData(): void {
    this.workoutFacade.loadWorkoutDetails(this.workoutId());
  }
}
