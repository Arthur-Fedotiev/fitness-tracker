import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { WorkoutPreview } from '@fitness-tracker/workout-domain';
import { ROLES } from 'shared-package';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RolesDirective } from '../../../../../auth/feature/src/lib/roles/roles.directive';
import { NgIf, NgFor, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImgFallbackDirective } from '../../../../../shared/utils/src/lib/directives/img-fallback/img-fallback.directive';
import { MatCardModule } from '@angular/material/card';

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
  ],
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
