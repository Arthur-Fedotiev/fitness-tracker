import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ROLES } from 'shared-package';
import { ExerciseVM } from '../models/exercise-vm';
import { MatIconModule } from '@angular/material/icon';
import { RolesDirective } from '../../../../../auth/data/src/lib/application/roles/roles.directive';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { E2eDirective } from '../../../../../shared/utils/src/lib/directives/e2e.directive';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { ImgFallbackDirective } from '../../../../../shared/utils/src/lib/directives/img-fallback/img-fallback.directive';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'components-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    ImgFallbackDirective,
    NgOptimizedImage,
    ExtendedModule,
    E2eDirective,
    TranslateModule,
    MatButtonModule,
    RolesDirective,
    MatIconModule,
    TitleCasePipe,
  ],
})
export class ExerciseComponent {
  public readonly roles = ROLES;

  @Input()
  public exercise!: ExerciseVM;
  @Input()
  public idx!: number;
  @Output()
  public readonly exerciseEdited = new EventEmitter<string>();
  @Output()
  public readonly exerciseViewed = new EventEmitter<string>();
  @Output()
  public readonly exerciseDeleted = new EventEmitter<string>();
  @Output()
  public readonly exerciseAddedToWorkout = new EventEmitter<string>();

  public viewExercise({ id }: ExerciseVM): void {
    this.exerciseViewed.emit(id);
  }

  public editExercise({ id }: ExerciseVM): void {
    this.exerciseEdited.emit(id);
  }

  public deleteExercise({ id }: ExerciseVM): void {
    this.exerciseDeleted.emit(id);
  }

  public addedToWorkout({ id }: ExerciseVM): void {
    this.exerciseAddedToWorkout.emit(id);
  }
}
