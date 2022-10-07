import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  ExerciseDescriptors,
  ExerciseDetailsQuery,
  ExerciseResponseDto,
  ReleaseExerciseDetailsCommand,
  CreateUpdateExerciseRequestDTO,
  ExerciseSavedCommand,
} from '@fitness-tracker/exercise/domain';
import { CreateAndEditComponent } from './create-and-edit.component';

describe('CreateAndEditComponent', () => {
  const selectedExerciseDetailsMock$ =
    new BehaviorSubject<ExerciseResponseDto | null>(null);
  const valueChangesMock = new Subject<ExerciseResponseDto>();

  let component: CreateAndEditComponent;
  let exerciseQuery: ExerciseDetailsQuery;
  let exerciseSavedCommand: ExerciseSavedCommand;
  let releaseExerciseDetailsCommand: ReleaseExerciseDetailsCommand;
  let fb: UntypedFormBuilder;
  let exerciseDescriptors: ExerciseDescriptors;
  let exerciseForm: UntypedFormGroup;

  beforeEach(() => {
    exerciseQuery = {
      selectedExerciseDetails$: selectedExerciseDetailsMock$,
    };

    exerciseSavedCommand = {
      exerciseSaved: jest.fn(),
    };

    releaseExerciseDetailsCommand = {
      releaseExerciseDetails: jest.fn(),
    };

    fb = {
      group: jest.fn().mockReturnValue({
        value: {},
        get: jest.fn().mockReturnValue({
          setValue: jest.fn(),
        }),
        valueChanges: valueChangesMock,
        patchValue: jest.fn(),
      }),
    } as unknown as UntypedFormBuilder;

    exerciseDescriptors = {
      exerciseTypes: [],
      muscles: [],
      equipment: [],
      proficiencyLvls: [],
    };

    component = new CreateAndEditComponent(
      exerciseDescriptors,
      exerciseQuery,
      releaseExerciseDetailsCommand,
      exerciseSavedCommand,

      fb,
    );
    exerciseForm = component.exerciseForm;
  });

  beforeEach(() => {
    component.ngOnInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch the form with the selected exercise details', () => {
    const exercise = {
      id: '1',
      name: 'test',
      description: 'test',
      type: 'test',
      muscles: ['test'],
      equipment: ['test'],
      proficiencyLvl: 'test',
      rating: 1,
    } as unknown as ExerciseResponseDto;

    selectedExerciseDetailsMock$.next(exercise);

    expect(exerciseForm.patchValue).toHaveBeenNthCalledWith(1, exercise);
  });

  it('should save the exercise when creating one', () => {
    const exercise = { id: '1' } as unknown as ExerciseResponseDto;

    selectedExerciseDetailsMock$.next(exercise);
    component.onSave();

    expect(exerciseSavedCommand.exerciseSaved).toHaveBeenNthCalledWith(
      1,
      new CreateUpdateExerciseRequestDTO(exerciseForm.value, exercise.id),
    );
  });

  it('should save the exercise when updating one', () => {
    const component = new CreateAndEditComponent(
      exerciseDescriptors,
      { selectedExerciseDetails$: new BehaviorSubject(null) },
      releaseExerciseDetailsCommand,
      exerciseSavedCommand,
      fb,
    );

    component.ngOnInit();
    component.onSave();

    expect(exerciseSavedCommand.exerciseSaved).toHaveBeenNthCalledWith(
      1,
      new CreateUpdateExerciseRequestDTO(exerciseForm.value, undefined),
    );
  });

  it('should update the rating when the rating changes without emitting event', () => {
    const rating = 5;

    component.ratingChange(rating);

    expect(component.ratingControl.setValue).toHaveBeenNthCalledWith(
      1,
      rating,
      {
        emitEvent: false,
      },
    );
  });

  it('should release the exercise details when destroying the component', () => {
    component.ngOnDestroy();

    expect(
      releaseExerciseDetailsCommand.releaseExerciseDetails,
    ).toHaveBeenCalledTimes(1);
  });
});
