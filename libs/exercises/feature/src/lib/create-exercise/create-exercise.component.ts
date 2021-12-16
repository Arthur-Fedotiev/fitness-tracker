import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import {
  ExercisesEntity,
  ExerciseRequestDTO,
  CollectionsMetaKeys,
  ExerciseCollectionsMeta,
} from '@fitness-tracker/exercises/model';
import { combineLatest, map, Subject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsFacadeService } from '@fitness-tracker/shared/data-access';

@UntilDestroy()
@Component({
  selector: 'ft-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateExerciseComponent implements OnInit, OnDestroy {
  public readonly exerciseForm: FormGroup = this.getForm();
  // public readonly muscles = MUSCLE_KEYS;
  // public readonly equipment: Equipment = EQUIPMENT;
  // public readonly exerciseTypes: ExerciseTypes = EXERCISE_TYPES;

  public readonly metaCollections$ = combineLatest([
    this.exercisesFacade.exercisesMetaCollections$,
    this.settingsFacade.language$,
  ]).pipe(
    map(
      ([metaDictionary, lang]) =>
        metaDictionary &&
        (<Array<CollectionsMetaKeys>>Object.keys(metaDictionary)).reduce(
          (
            acc: ExerciseCollectionsMeta,
            collectionName: CollectionsMetaKeys,
          ) => ({
            ...acc,
            [collectionName]: metaDictionary[collectionName][lang],
          }),
          {} as ExerciseCollectionsMeta,
        ),
    ),
  );

  public resolvedExercise: ExercisesEntity | null = null;

  private readonly save: Subject<void> = new Subject<void>();

  public readonly onSave$ = this.save.asObservable().pipe(
    tap(() =>
      this.resolvedExercise
        ? this.exercisesFacade.updateExercise(
            new ExerciseRequestDTO(
              this.exerciseForm.value,
              this.resolvedExercise.id,
            ),
          )
        : this.exercisesFacade.createExercise(
            new ExerciseRequestDTO(this.exerciseForm.value),
          ),
    ),
    untilDestroyed(this),
  );
  public get ratingControl(): AbstractControl | null {
    return this.exerciseForm.get('rating');
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private exercisesFacade: ExercisesFacade,
    private settingsFacade: SettingsFacadeService,
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

  private getForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      exerciseType: [null, Validators.required],
      targetMuscle: [null, Validators.required],
      equipment: [null, Validators.required],
      coverUrl: [null],
      avatarUrl: [null, Validators.required],
      shortDescription: [null],
      longDescription: [null],
      benefits: [null],
      instructions: [null],
      rating: [null, Validators.required],
    });
  }

  private initData(): void {
    this.resolvedExercise = this.route.snapshot.data['exercise'] ?? null;
    this.resolvedExercise &&
      this.exerciseForm.patchValue(this.resolvedExercise);
    console.log(this.resolvedExercise);

    this.exercisesFacade.loadExercisesMeta();
  }

  private initListeners(): void {
    this.onSave$.subscribe();
  }
}
