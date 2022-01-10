import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import {
  MetaCollection,
  META_COLLECTIONS,
  MUSCLE_KEYS,
} from '@fitness-tracker/exercises/model';
import { TargetMuscles } from '@fitness-tracker/shared/utils';
import { WorkoutLevel } from '@fitness-tracker/workout/model';

@Component({
  selector: 'ft-workout-filters',
  templateUrl: './workout-filters.component.html',
  styleUrls: ['./workout-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutFiltersComponent {
  public workoutFilters: FormGroup = this.getForm();
  public readonly workoutLevels = WorkoutLevel;
  public readonly metaCollections: MetaCollection = META_COLLECTIONS;

  @Input()
  public set initialTargetMuscles(targetMuscles: TargetMuscles) {
    this.workoutFilters.patchValue({ targetMuscles }, { emitEvent: false });
  }
  @Output()
  public readonly targetMusclesFiltersChanges = this.targetMuscles.valueChanges;

  get targetMuscles(): AbstractControl {
    return this.workoutFilters.get('targetMuscles') as AbstractControl;
  }

  constructor(private readonly fb: FormBuilder) {}

  public trackByIndex(index: number): number {
    return index;
  }

  private getForm(): FormGroup {
    return this.fb.group({
      targetMuscles: [null],
    });
  }
}
