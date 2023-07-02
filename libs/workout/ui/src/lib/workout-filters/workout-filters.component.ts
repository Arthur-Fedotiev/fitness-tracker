import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, TitleCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@angular/flex-layout/flex';
import { E2eDirective } from '@fitness-tracker/shared/utils';

@Component({
  selector: 'ft-workout-filters',
  templateUrl: './workout-filters.component.html',
  styleUrls: ['./workout-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    FlexModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    E2eDirective,
    NgFor,
    MatOptionModule,
    TitleCasePipe,
    TranslateModule,
  ],
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
