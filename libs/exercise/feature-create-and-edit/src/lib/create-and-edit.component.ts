import { Component, ChangeDetectionStrategy, OnDestroy, effect, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ExerciseDescriptors,
  ExerciseDetailsQuery,
  EXERCISE_DESCRIPTORS_TOKEN,
  EXERCISE_DETAILS_QUERY,
  ReleaseExerciseDetailsCommand,
  RELEASE_EXERCISE_DETAILS_COMMAND,
  EXERCISE_SAVED_COMMAND,
  ExerciseSavedCommand,
  ExerciseFromModel,
} from '@fitness-tracker/exercise/domain';

import { filter, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { TranslateModule } from '@ngx-translate/core';

import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { getLanguageRefresh$ } from '@fitness-tracker/shared/i18n/domain';

@UntilDestroy()
@Component({
  selector: 'exercise-create-and-edit',
  templateUrl: './create-and-edit.component.html',
  styleUrls: ['./create-and-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatSliderModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAndEditComponent implements OnDestroy {
  readonly exerciseDescriptors = inject<ExerciseDescriptors>(EXERCISE_DESCRIPTORS_TOKEN);
  private readonly exerciseQuery = inject<ExerciseDetailsQuery>(EXERCISE_DETAILS_QUERY);
  private readonly releaseExerciseDetailsCommand = inject<ReleaseExerciseDetailsCommand>(RELEASE_EXERCISE_DETAILS_COMMAND);
  private readonly exerciseSavedCommand = inject<ExerciseSavedCommand>(EXERCISE_SAVED_COMMAND);
  private readonly cdr = inject(ChangeDetectorRef);

  public exerciseFormModel: ExerciseFromModel = {
    name: '',
    exerciseType: '',
    targetMuscle: '',
    equipment: '',
    instructions: [''],
  };

  private readonly exerciseDetails = toSignal(
    this.exerciseQuery.selectedExerciseDetails$.pipe(filter(Boolean), take(1)),
  );

  constructor() {
    effect(() => {
      this.exerciseFormModel = {
        ...this.exerciseFormModel,
        ...(structuredClone(this.exerciseDetails()) ?? {}),
      };

      this.cdr.markForCheck();
    });

    getLanguageRefresh$().pipe(untilDestroyed(this)).subscribe();
  }

  ngOnDestroy(): void {
    this.releaseExerciseDetailsCommand.releaseExerciseDetails();
  }

  onSave(): void {
    this.exerciseSavedCommand.exerciseSaved({
      exercise: this.exerciseFormModel,
      id: this.exerciseDetails()?.id,
    });
  }

  removeInstruction(index: number): void {
    this.exerciseFormModel.instructions.splice(index, 1);
  }

  trackByFn(index: number): number {
    return index;
  }
}
