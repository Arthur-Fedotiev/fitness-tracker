import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { WorkoutPreview } from '@fitness-tracker/workout/model';

@Component({
  selector: 'ft-workout-preview',
  templateUrl: './workout-preview.component.html',
  styleUrls: ['./workout-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutPreviewComponent {
  @Input() workout!: WorkoutPreview;
}
