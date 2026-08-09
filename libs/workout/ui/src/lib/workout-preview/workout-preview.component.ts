import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { ROLES } from 'shared-package';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LowerCasePipe, TitleCasePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {
  ImgFallbackDirective,
  MUSCLE_LABELS,
  PROFICIENCY_LEVEL_LABELS,
  WORKOUT_PREVIEW_FALLBACK_IMG,
} from '@fitness-tracker/shared/utils';
import { RolesDirective } from '@fitness-tracker/shared/ui/directives';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { WorkoutPreviewVM } from './models';

@Component({
  selector: 'ft-workout-preview',
  templateUrl: './workout-preview.component.html',
  styleUrls: ['./workout-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    ImgFallbackDirective,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    TitleCasePipe,
    MatMenuModule,
    MatChipsModule,
    NgOptimizedImage
  ],
})
export class WorkoutPreviewComponent {
  @Input({ required: true }) workout!: WorkoutPreviewVM;

  @Output() readonly workoutEdited = new EventEmitter<string>();
  @Output() readonly workoutDeleted = new EventEmitter<string>();

  protected readonly roles = ROLES;
  protected fallbackImg = WORKOUT_PREVIEW_FALLBACK_IMG;
  protected readonly muscleLabels = MUSCLE_LABELS;
  protected readonly levelLabels = PROFICIENCY_LEVEL_LABELS;
}
