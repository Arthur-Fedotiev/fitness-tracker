import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
import { from } from 'rxjs';

@Component({
  selector: 'ft-workout-preview',
  templateUrl: './workout-preview.component.html',
  styleUrls: ['./workout-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutPreviewComponent implements OnInit {
  @Input() workout!: WorkoutPreview;

  constructor() {}

  ngOnInit(): void {}
}
