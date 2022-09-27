import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
} from '@angular/core';
import {
  UntypedFormGroup,
  AbstractControl,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  MetaCollection,
  META_COLLECTIONS,
  TargetMuscles,
} from '@fitness-tracker/exercises/model';
import { WorkoutLevel } from '@fitness-tracker/workout-domain';

@Component({
  selector: 'ft-workout-filters',
  templateUrl: './workout-filters.component.html',
  styleUrls: ['./workout-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutFiltersComponent {
  public workoutFilters: UntypedFormGroup = this.getForm();
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

  constructor(private readonly fb: UntypedFormBuilder) {}

  public trackByIndex(index: number): number {
    return index;
  }

  private getForm(): UntypedFormGroup {
    return this.fb.group({
      targetMuscles: [null],
    });
  }
}
