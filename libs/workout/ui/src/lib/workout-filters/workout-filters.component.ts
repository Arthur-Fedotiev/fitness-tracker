import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
} from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ft-workout-filters',
  templateUrl: './workout-filters.component.html',
  styleUrls: ['./workout-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutFiltersComponent {
  @Input() public muscleList: string[] = [];
  @Input()
  public set initialTargetMuscles(targetMuscles: string[]) {
    this.workoutFilters.patchValue({ targetMuscles }, { emitEvent: false });
  }

  public readonly workoutFilters = this.fb.group<{
    targetMuscles: null | string[];
  }>({
    targetMuscles: null,
  });

  @Output()
  public readonly targetMusclesFiltersChanges = this.targetMuscles.valueChanges;

  get targetMuscles(): AbstractControl {
    return this.workoutFilters.get('targetMuscles') as AbstractControl;
  }

  constructor(private readonly fb: FormBuilder) {}

  public trackByIndex(index: number): number {
    return index;
  }
}
