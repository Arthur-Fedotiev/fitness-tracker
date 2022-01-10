import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ExerciseMetaCollectionsDictionaryUnit,
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
export class WorkoutBasicInfoComponent {
  @Output()
  public readonly workoutBasicInfoSaved = new EventEmitter<WorkoutBasicInfo>();

  public readonly workoutLevels = WorkoutLevel;
  public readonly metaCollections: MetaCollection = META_COLLECTIONS;
  public readonly workoutInfoForm: FormGroup = this.getForm();

  constructor(private fb: FormBuilder) {}

  public onSave(): void {
    this.workoutBasicInfoSaved.emit(this.workoutInfoForm.value);
  }

  public trackByIndex(index: number): number {
    return index;
  }

  private getForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      targetMuscles: [null, Validators.required],
      avatarUrl: [null, Validators.required],
      coverUrl: [null],
      description: [null],
      level: [null, Validators.required],
      importantNotes: [null],
    });
  }
}
