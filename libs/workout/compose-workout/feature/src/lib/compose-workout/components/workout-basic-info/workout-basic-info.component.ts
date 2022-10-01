import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { WorkoutBasicInfo } from '@fitness-tracker/workout/data';
import { WorkoutLevel } from '@fitness-tracker/workout-domain';
import { ExerciseDescriptors } from '@fitness-tracker/exercise/api-public';

@Component({
  selector: 'ft-workout-basic-info',
  templateUrl: './workout-basic-info.component.html',
  styleUrls: ['./workout-basic-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutBasicInfoComponent implements OnInit {
  @Input()
  public basicInfo?: WorkoutBasicInfo | null;
  @Input()
  public exerciseDescriptors!: ExerciseDescriptors;
  @Output()
  public readonly workoutBasicInfoSaved = new EventEmitter<WorkoutBasicInfo>();

  public readonly workoutLevels = WorkoutLevel;

  public workoutInfoForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.workoutInfoForm = this.setForm(this.basicInfo);
  }

  public onSave(): void {
    this.workoutBasicInfoSaved.emit({
      ...this.basicInfo,
      ...this.workoutInfoForm.value,
    });
  }

  public trackByIndex(index: number): number {
    return index;
  }

  private setForm(
    workoutBasicInfo?: WorkoutBasicInfo | null,
  ): UntypedFormGroup {
    const {
      name,
      description,
      level,
      targetMuscles,
      avatarUrl,
      coverUrl,
      importantNotes,
    } = workoutBasicInfo || {};

    return this.fb.group({
      name: [name ?? '', Validators.required],
      targetMuscles: [targetMuscles, Validators.required],
      avatarUrl: [avatarUrl, Validators.required],
      coverUrl: [coverUrl],
      description: [description],
      level: [level, Validators.required],
      importantNotes: [importantNotes],
    });
  }
}
