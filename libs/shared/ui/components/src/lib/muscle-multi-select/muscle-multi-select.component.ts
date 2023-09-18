import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
} from '@angular/core';
import { NgFor, TitleCasePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { E2eDirective } from '@fitness-tracker/shared/utils';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ft-muscle-multi-select',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    E2eDirective,
    NgFor,
    MatOptionModule,
    TitleCasePipe,
    TranslateModule,
  ],
  template: `<form class="filters" [formGroup]="workoutFilters">
    <mat-form-field class="filters__item" appearance="outline">
      <mat-select
        formControlName="targetMuscles"
        multiple
        [placeholder]="'CONTROL_PLACEHOLDERS.selectMuscles' | translate"
        ftE2e="targetMuscles"
      >
        <mat-option
          *ngFor="let muscle of muscleList; trackBy: trackByIndex"
          [value]="muscle"
          ftE2e="muscle"
          >{{ 'MUSCLES.' + muscle | translate | titlecase }}</mat-option
        >
      </mat-select>
    </mat-form-field>
  </form> `,
  styles: [
    `
      .filters {
        display: flex;
        justify-content: center;
        flex: 1;

        &__item {
          flex: 1;
        }
      }

      @media screen and (min-width: 600px) {
        .filters {
          justify-content: flex-start;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MuscleMultiSelectComponent {
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
