import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

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
  imports: [TranslateModule, MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseDetailsComponent {
  dialogData = inject<{ exercise: ExerciseDetailsVM }>(MAT_DIALOG_DATA);

  public readonly exercise: ExerciseDetailsVM = this.dialogData.exercise;
}
