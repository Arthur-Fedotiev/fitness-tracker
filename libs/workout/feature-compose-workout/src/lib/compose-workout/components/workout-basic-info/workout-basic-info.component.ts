import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { WorkoutBasicInfo } from '@fitness-tracker/workout-domain';
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
import { distinctUntilChanged, map, startWith, tap } from 'rxjs';

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
})
export class WorkoutBasicInfoComponent implements AfterViewInit {
  @ViewChild('workoutBasicInfoForm', { read: NgForm }) public form!: NgForm;
  @Input()
  set basicInfo(basicInfo: WorkoutBasicInfo | null | undefined) {
    this.workoutBasicInfo = {
      ...this.workoutBasicInfo,
      ...(basicInfo ?? {}),
    };
  }
  @Input()
  public exerciseDescriptors!: ExerciseDescriptors;
  @Output()
  public readonly basicInfoChange = new EventEmitter<WorkoutBasicInfo>();
  @Output()
  public readonly basicInfoValidChange = new EventEmitter<boolean>();

  public readonly workoutLevels = WorkoutLevel;

  public workoutBasicInfo: WorkoutBasicInfo = {
    name: '',
    targetMuscles: [],
    avatarUrl: '',
    coverUrl: '',
    description: '',
    level: WorkoutLevel.BEGINNER,
    importantNotes: '',
  };

  ngAfterViewInit(): void {
    this.form
      .statusChanges!.pipe(
        distinctUntilChanged(),
        map((status) => status === 'VALID'),
        startWith(false),
      )
      .subscribe((isValid) => this.basicInfoValidChange.emit(isValid));
  }

  protected onBasicInfoChange(): void {
    this.basicInfoChange.emit({ ...this.basicInfo, ...this.workoutBasicInfo });
  }
}
