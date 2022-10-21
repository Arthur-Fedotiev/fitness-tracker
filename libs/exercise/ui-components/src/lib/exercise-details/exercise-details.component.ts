import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  Optional,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { E2eDirectiveModule } from '@fitness-tracker/shared/utils';
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
  imports: [
    NgIf,
    NgFor,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    E2eDirectiveModule,
  ],
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
