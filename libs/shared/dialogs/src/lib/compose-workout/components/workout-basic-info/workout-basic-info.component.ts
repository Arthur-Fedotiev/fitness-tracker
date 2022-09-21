import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MetaCollection,
  META_COLLECTIONS,
} from '@fitness-tracker/exercises/model';
import { WorkoutBasicInfo } from '@fitness-tracker/shared/utils';
import { WorkoutLevel } from '@fitness-tracker/workout/model';

@Component({
  selector: 'ft-workout-basic-info',
  templateUrl: './workout-basic-info.component.html',
  styleUrls: ['./workout-basic-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutBasicInfoComponent implements OnInit {
  @Input()
  public basicInfo?: WorkoutBasicInfo | null;
  @Output()
  public readonly workoutBasicInfoSaved = new EventEmitter<WorkoutBasicInfo>();

  public readonly workoutLevels = WorkoutLevel;
  public readonly metaCollections: MetaCollection = META_COLLECTIONS;
  public workoutInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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

  private setForm(workoutBasicInfo?: WorkoutBasicInfo | null): FormGroup {
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
