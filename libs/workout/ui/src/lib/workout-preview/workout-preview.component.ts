import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
import { ROLES } from 'shared-package';

@Component({
  selector: 'ft-workout-preview',
  templateUrl: './workout-preview.component.html',
  styleUrls: ['./workout-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutPreviewComponent {
  @Input() workout!: WorkoutPreview;

  @Output() public readonly workoutEdited = new EventEmitter<string>();
  @Output() public readonly workoutDeleted = new EventEmitter<string>();

  public readonly roles = ROLES;

  public deleteWorkout(id: string) {
    this.workoutDeleted.emit(id);
  }
  public editWorkout(id: string) {
    this.workoutEdited.emit(id);
  }
}
