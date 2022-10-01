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
import { ActivatedRoute } from '@angular/router';
import {
  ExerciseDescriptors,
  ExerciseFacade,
  ExerciseResponseDto,
  EXERCISE_DESCRIPTORS_TOKEN,
  UpdateExerciseRequestDTO,
} from '@fitness-tracker/exercise/domain';

import { filter, ReplaySubject, Subject, tap } from 'rxjs';
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

  private readonly patchExerciseFormValue: ReplaySubject<ExerciseResponseDto | null> =
    new ReplaySubject<ExerciseResponseDto | null>(1);
  private readonly pathExerciseFormValue$ = this.patchExerciseFormValue
    .asObservable()
    .pipe(
      filter(Boolean),
      tap((exercise: ExerciseResponseDto) =>
        this.exerciseForm.patchValue(exercise),
      ),
      untilDestroyed(this),
    );

  public resolvedExercise: ExerciseResponseDto | null = null;

  private readonly save: Subject<void> = new Subject<void>();

  public readonly onSave$ = this.save.asObservable().pipe(
    tap(() =>
      this.resolvedExercise
        ? this.exercisesFacade.updateExercise(
            new UpdateExerciseRequestDTO(
              this.exerciseForm.value,
              this.resolvedExercise.id,
            ),
          )
        : this.exercisesFacade.createExercise(
            new UpdateExerciseRequestDTO(this.exerciseForm.value),
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
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private exercisesFacade: ExerciseFacade,
  ) {}

  ngOnInit(): void {
    this.initData();
    this.initListeners();
  }

  ngOnDestroy(): void {
    this.exercisesFacade.releaseExerciseDetails();
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

  private initData(): void {
    this.resolvedExercise = this.route.snapshot.data['exercise'] ?? null;
    this.patchExerciseFormValue.next(this.resolvedExercise);
  }

  private initListeners(): void {
    this.onSave$.subscribe();
    this.pathExerciseFormValue$.subscribe();
  }
}
