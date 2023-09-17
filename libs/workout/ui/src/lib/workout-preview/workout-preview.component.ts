import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { ROLES } from 'shared-package';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  NgIf,
  NgFor,
  LowerCasePipe,
  TitleCasePipe,
  NgOptimizedImage,
} from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {
  ImgFallbackDirective,
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
    NgIf,
    NgFor,
    RolesDirective,
    MatButtonModule,
    MatIconModule,
    LowerCasePipe,
    TitleCasePipe,
    TranslateModule,
    MatMenuModule,
    MatChipsModule,
    NgOptimizedImage,
  ],
})
export class WorkoutPreviewComponent {
  @Input({ required: true }) workout!: WorkoutPreviewVM;

  @Output() readonly workoutEdited = new EventEmitter<string>();
  @Output() readonly workoutDeleted = new EventEmitter<string>();

  protected readonly roles = ROLES;
  protected fallbackImg = WORKOUT_PREVIEW_FALLBACK_IMG;
}
