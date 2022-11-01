import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Inject,
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
  CreateUpdateExerciseRequestDTO,
  EXERCISE_SAVED_COMMAND,
  ExerciseSavedCommand,
  ExerciseResponseDto,
} from '@fitness-tracker/exercise/domain';

import { filter, Subject, take, tap, withLatestFrom } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { TranslateModule } from '@ngx-translate/core';
import {
  Action,
  AsyncState,
  AsyncStateService,
  E2eDirectiveModule,
  reset,
  Status,
} from '@fitness-tracker/shared/utils';

enum CreateAndEditFormActions {
  INITIAL_FORM_DATA_LOADED = 'INITIAL_FORM_DATA_LOADED',
}

class InitialFormDataLoadedAction {
  public readonly type = CreateAndEditFormActions.INITIAL_FORM_DATA_LOADED;
  constructor(public readonly payload: ExerciseResponseDto) {}
}

@UntilDestroy()
@Component({
  selector: 'exercise-create-and-edit',
  templateUrl: './create-and-edit.component.html',
  styleUrls: ['./create-and-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    E2eDirectiveModule,
  ],
  providers: [AsyncStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAndEditComponent implements OnInit, OnDestroy {
  public readonly exerciseForm: UntypedFormGroup = this.getForm();
  public readonly localState$ = this.localStateAdapter.localState$;
  public readonly statusEnum = Status;

  public readonly resetEditedFieldsSubj$ = new Subject<void>();
  private readonly resetEditedFields = this.resetEditedFieldsSubj$.pipe(
    withLatestFrom(this.localStateAdapter.localState$),
    tap(([, { initialFormData }]) => {
      initialFormData
        ? this.exerciseForm.patchValue(initialFormData)
        : this.exerciseForm.reset();
      this.exerciseForm.markAsPristine();
    }),
    tap(() => reset(this.localStateAdapter.dispatch)),
  );

  private readonly formInitialized$ =
    this.exerciseQuery.selectedExerciseDetails$.pipe(
      filter(Boolean),
      tap((exercise) =>
        this.exerciseForm.patchValue(exercise, {
          emitEvent: false,
        }),
      ),
      tap((exercise) =>
        this.localStateAdapter.dispatch(
          new InitialFormDataLoadedAction(exercise) as any,
        ),
      ),
      take(1),
      untilDestroyed(this),
    );

  private readonly save: Subject<void> = new Subject<void>();

  public readonly onSave$ = this.save.asObservable().pipe(
    this.localStateAdapter.handleAsync(({ initialFormData }) =>
      this.exerciseSavedCommand.exerciseSaved(
        new CreateUpdateExerciseRequestDTO(
          this.exerciseForm.value,
          initialFormData?.id,
        ),
      ),
    ),
    untilDestroyed(this),
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
    private readonly localStateAdapter: AsyncStateService<{
      initialFormData: null | ExerciseResponseDto;
    }>,
    private readonly fb: UntypedFormBuilder,
  ) {
    this.localStateAdapter.enrichState({ initialFormData: null });
    this.localStateAdapter.setCustomUpdaterFn(createAndEditFormReducer as any);
  }

  public ngOnInit(): void {
    this.initListeners();
  }

  public ngOnDestroy(): void {
    this.releaseExerciseDetailsCommand.releaseExerciseDetails();
  }

  public onSave(): void {
    this.save.next();
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

  private initListeners(): void {
    this.onSave$.subscribe();
    this.resetEditedFields.subscribe();
    this.formInitialized$.subscribe();
  }
}

function createAndEditFormReducer<
  T = { initialFormData: ExerciseResponseDto } & AsyncState,
>(state: T, action: Action<ExerciseResponseDto>): T {
  switch (action.type) {
    case CreateAndEditFormActions.INITIAL_FORM_DATA_LOADED:
      return {
        ...state,
        initialFormData: action.payload,
      };
    default:
      return state;
  }
}
