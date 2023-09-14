import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
} from '@angular/core';
import { FormsModule, ControlContainer } from '@angular/forms';

import {
  WorkoutBasicInfoFormModel,
  WorkoutBasicInfo,
  WorkoutLevel,
} from '@fitness-tracker/workout-domain';
import { ExerciseDescriptors } from '@fitness-tracker/exercise/public-api';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, TitleCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { formViewProvider } from '@fitness-tracker/shared/utils';
import { RolesDirective } from '@fitness-tracker/shared/ui/directives';
import { ROLES } from 'shared-package';

@Component({
  selector: 'ft-workout-basic-info',
  templateUrl: './workout-basic-info.component.html',
  styleUrls: ['./workout-basic-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
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
    RolesDirective,
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

  protected readonly Roles = ROLES;

  protected readonly parentForm = inject(ControlContainer).control;
  protected readonly workoutLevels = WorkoutLevel;

  protected workoutBasicInfo: WorkoutBasicInfoFormModel = {
    name: '',
    targetMuscles: [],
    avatarUrl:
      'https://www.bodybuilding.com/images/2019/august/fyr2.0-comingsoon-header.jpg',
    coverUrl: 'https://i.ytimg.com/vi/ah_vve9bEBI/maxresdefault.jpg',
    level: WorkoutLevel.INTERMEDIATE,
  };
}
