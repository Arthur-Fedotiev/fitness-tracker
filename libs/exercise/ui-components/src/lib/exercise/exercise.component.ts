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
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  ImgFallbackDirective,
  E2eDirective,
} from '@fitness-tracker/shared/utils';
import { RolesDirective } from '@fitness-tracker/shared/ui/directives';

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
  @Input()
  public isSelected = false;

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
