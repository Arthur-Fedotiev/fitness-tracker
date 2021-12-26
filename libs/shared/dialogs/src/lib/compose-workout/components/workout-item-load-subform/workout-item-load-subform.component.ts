import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { formViewProvider } from '@fitness-tracker/shared/utils';
import {
  InstructionType,
  WorkoutItemInstruction,
} from '../../compose-workout.component';

@Component({
  selector: 'ft-workout-item-load',
  templateUrl: './workout-item-load-subform.component.html',
  styleUrls: ['./workout-item-load-subform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [formViewProvider],
})
export class WorkoutItemLoadSubformComponent {
  @Input() instruction!: WorkoutItemInstruction;
  public readonly instructionType = InstructionType;
}
