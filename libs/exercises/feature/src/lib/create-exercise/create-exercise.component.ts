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
  Exercise,
  ExerciseMetaCollectionsDictionaryUnit,
} from '@fitness-tracker/exercises/model';
import {
  combineLatest,
  filter,
  map,
  Observable,
  ReplaySubject,
  Subject,
  tap,
} from 'rxjs';
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

  public readonly metaCollections$: Observable<ExerciseMetaCollectionsDictionaryUnit> =
    this.exercisesFacade.exercisesMetaCollections$.pipe(filter(Boolean));

  private readonly patchExerciseFormValue: ReplaySubject<Exercise> =
    new ReplaySubject<Exercise>(1);
  private readonly pathExerciseFormValue$ = this.patchExerciseFormValue
    .asObservable()
    .pipe(
      tap((exercise: Exercise) => this.exerciseForm.patchValue(exercise)),
      untilDestroyed(this),
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
      this.patchExerciseFormValue.next(this.resolvedExercise);
    this.exercisesFacade.loadExercisesMeta();
  }

  private initListeners(): void {
    this.onSave$.subscribe();
    this.pathExerciseFormValue$.subscribe();
  }
}
