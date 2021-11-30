import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesFacade } from '@fitness-tracker/exercises/data';
import { MUSCLE_LIST, EQUIPMENT, MuscleList, Equipment, ExerciseTypes, EXERCISE_TYPES, ExercisesEntity } from '@fitness-tracker/exercises/model';
import { Subject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'fitness-tracker-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateExerciseComponent implements OnInit, OnDestroy {
  public readonly exerciseForm: FormGroup = this.getForm();
  public readonly muscles: MuscleList = MUSCLE_LIST;
  public readonly equipment: Equipment = EQUIPMENT;
  public readonly exerciseTypes: ExerciseTypes = EXERCISE_TYPES;

  public resolvedExercise: ExercisesEntity | null = null;

  private readonly save: Subject<void> = new Subject<void>();
  public readonly onSave$ = this.save.asObservable().pipe(
    tap(() => this.resolvedExercise
      ? this.exercisesFacade.updateExercise({ id: this.resolvedExercise.id, ...this.exerciseForm.value })
      : this.exercisesFacade.createExercise(this.exerciseForm.value)),
    untilDestroyed(this),
  )

  public get ratingControl(): AbstractControl | null {
    return this.exerciseForm.get('rating');
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private exercisesFacade: ExercisesFacade
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initListeners();

    this.exerciseForm.valueChanges.subscribe(console.log)
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

  public trackByItem(index: number, item: string | number): string | number {
    return item ?? index;
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
    this.resolvedExercise && this.exerciseForm.patchValue(this.resolvedExercise);
  }

  private initListeners(): void {
    this.onSave$.subscribe();
  }
}
