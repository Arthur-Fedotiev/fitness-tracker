import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { FormsModule, ControlContainer, NgModelGroup } from '@angular/forms';

import {
  WorkoutBasicInfoFormModel,
  WorkoutBasicInfo,
} from '@fitness-tracker/workout-domain';
import { WorkoutLevel } from '@fitness-tracker/workout-domain';
import { ExerciseDescriptors } from '@fitness-tracker/exercise/public-api';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, TitleCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@angular/flex-layout/flex';
import { formViewProvider } from '@fitness-tracker/shared/utils';

@Component({
  selector: 'ft-workout-basic-info',
  templateUrl: './workout-basic-info.component.html',
  styleUrls: ['./workout-basic-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    FlexModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    TextFieldModule,
    MatButtonModule,
    TitleCasePipe,
    TranslateModule,
  ],
  viewProviders: [formViewProvider],
})
export class WorkoutBasicInfoComponent {
  @Input()
  set basicInfo(basicInfo: WorkoutBasicInfo | null | undefined) {
    this.workoutBasicInfo = {
      ...this.workoutBasicInfo,
      ...(basicInfo ?? {}),
    };
  }
  @Input()
  exerciseDescriptors!: ExerciseDescriptors;

  protected form!: NgModelGroup;
  protected readonly parentForm = inject(ControlContainer).control;
  protected readonly workoutLevels = WorkoutLevel;

  protected workoutBasicInfo: WorkoutBasicInfoFormModel = {
    name: '',
    targetMuscles: [],
    avatarUrl: '',
    coverUrl: '',
    description: '',
    level: WorkoutLevel.BEGINNER,
    importantNotes: '',
  };
}
