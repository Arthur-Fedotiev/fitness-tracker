import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { formViewProvider } from '@fitness-tracker/shared/utils';
import {
  WorkoutItemInstruction,
  InstructionType,
} from '@fitness-tracker/workout-domain';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'ft-workout-item-load',
  templateUrl: './workout-item-load-subform.component.html',
  styleUrls: ['./workout-item-load-subform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [formViewProvider],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatInputModule,
  ],
})
export class WorkoutItemLoadSubformComponent {
  @Input() instruction!: WorkoutItemInstruction;
  public readonly instructionType = InstructionType;
}
