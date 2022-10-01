import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ExerciseDescriptors,
  ExerciseDetailsQuery,
  ExerciseResponseDto,
  EXERCISE_DESCRIPTORS_TOKEN,
  EXERCISE_DETAILS_QUERY,
  ReleaseExerciseDetailsCommand,
  RELEASE_EXERCISE_DETAILS_COMMAND,
  CreateUpdateExerciseRequestDTO,
  EXERCISE_SAVED_COMMAND,
  ExerciseSavedCommand,
} from '@fitness-tracker/exercise/domain';

import { map, Subject, tap, withLatestFrom } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'exercise-create-and-edit',
  templateUrl: './create-and-edit.component.html',
  styleUrls: ['./create-and-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAndEditComponent implements OnInit, OnDestroy {
  public readonly exerciseForm: UntypedFormGroup = this.getForm();

  private readonly pathExerciseFormValue$ =
    this.exerciseQuery.selectedExerciseDetails$.pipe(
      map((exercise) => exercise ?? ({} as ExerciseResponseDto)),
      tap(this.exerciseForm.patchValue.bind(this.exerciseForm)),
      untilDestroyed(this),
    );

  public resolvedExercise: ExerciseResponseDto | null = null;

  private readonly save: Subject<void> = new Subject<void>();

  public readonly onSave$ = this.save.asObservable().pipe(
    withLatestFrom(this.pathExerciseFormValue$),
    tap(([, exercise]) =>
      this.exerciseSavedCommand.exerciseSaved(
        new CreateUpdateExerciseRequestDTO(
          this.exerciseForm.value,
          exercise.id,
        ),
      ),
    ),
    untilDestroyed(this),
  );
  public get ratingControl(): AbstractControl | null {
    return this.exerciseForm.get('rating');
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
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  ngOnDestroy(): void {
    this.releaseExerciseDetailsCommand.releaseExerciseDetails();
  }

  public onSave(): void {
    this.save.next();
  }

  public ratingChange(rating: number | null): void {
    this.ratingControl?.setValue(rating, { emitEvent: false });
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

  private initListeners(): void {
    this.onSave$.subscribe();
  }
}
