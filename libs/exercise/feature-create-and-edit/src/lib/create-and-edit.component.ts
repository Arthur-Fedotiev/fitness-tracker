import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
  effect,
} from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ExerciseDescriptors,
  ExerciseDetailsQuery,
  EXERCISE_DESCRIPTORS_TOKEN,
  EXERCISE_DETAILS_QUERY,
  ReleaseExerciseDetailsCommand,
  RELEASE_EXERCISE_DETAILS_COMMAND,
  EXERCISE_SAVED_COMMAND,
  ExerciseSavedCommand,
} from '@fitness-tracker/exercise/domain';

import { filter, take } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { toSignal } from '@angular/core/rxjs-interop';

import { TranslateModule } from '@ngx-translate/core';

import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@UntilDestroy()
@Component({
  selector: 'exercise-create-and-edit',
  templateUrl: './create-and-edit.component.html',
  styleUrls: ['./create-and-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAndEditComponent implements OnDestroy {
  public readonly exerciseForm: UntypedFormGroup = this.getForm();

  private readonly exerciseDetails = toSignal(
    this.exerciseQuery.selectedExerciseDetails$.pipe(filter(Boolean), take(1)),
  );

  public get ratingControl(): AbstractControl<number | null, number | null> {
    return this.exerciseForm.get('rating' as const) as AbstractControl<
      number | null,
      number | null
    >;
  }

  constructor(
    @Inject(EXERCISE_DESCRIPTORS_TOKEN)
    public readonly exerciseDescriptors: ExerciseDescriptors,
    @Inject(EXERCISE_DETAILS_QUERY)
    private readonly exerciseQuery: ExerciseDetailsQuery,
    @Inject(RELEASE_EXERCISE_DETAILS_COMMAND)
    private readonly releaseExerciseDetailsCommand: ReleaseExerciseDetailsCommand,
    @Inject(EXERCISE_SAVED_COMMAND)
    private readonly exerciseSavedCommand: ExerciseSavedCommand,
    private readonly fb: UntypedFormBuilder,
  ) {
    effect(() => this.exerciseForm.patchValue(this.exerciseDetails() ?? {}));
  }

  public ngOnDestroy(): void {
    this.releaseExerciseDetailsCommand.releaseExerciseDetails();
  }

  public onSave(): void {
    this.exerciseSavedCommand.exerciseSaved({
      exercise: this.exerciseForm.value,
      id: this.exerciseDetails()?.id,
    });
  }

  public ratingChange(rating: number | null): void {
    this.ratingControl.setValue(rating, { emitEvent: false });
  }

  public trackByIndex(index: number): number {
    return index;
  }

  private getForm(): UntypedFormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      exerciseType: [null, Validators.required],
      targetMuscle: [null, Validators.required],
      equipment: [null, Validators.required],
      coverUrl: [null],
      coverSecondaryUrl: [null],
      avatarUrl: [null, Validators.required],
      avatarSecondaryUrl: [null],
      shortDescription: [null],
      longDescription: [null],
      benefits: [null],
      instructions: [null],
      instructionVideo: [null],
      muscleDiagramUrl: [null],
      rating: [null, Validators.required],
    });
  }
}
