import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  Optional,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

interface ExerciseDetailsVM {
  readonly name: string;
  readonly instructionVideo?: string;
  readonly instructions?: string[];
}

@Component({
  selector: 'components-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, TranslateModule, MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseDetailsComponent {
  public readonly exercise: ExerciseDetailsVM = this.dialogData.exercise;

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { exercise: ExerciseDetailsVM },
  ) {}
}
