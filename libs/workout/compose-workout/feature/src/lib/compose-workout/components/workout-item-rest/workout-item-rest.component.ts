import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { formViewProvider } from '@fitness-tracker/shared/utils';
import { WorkoutItemInstruction } from '@fitness-tracker/workout/data';

@Component({
  selector: 'ft-workout-item-rest',
  templateUrl: './workout-item-rest.component.html',
  styleUrls: ['./workout-item-rest.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [formViewProvider],
})
export class WorkoutItemRestComponent {
  @Input() instruction!: WorkoutItemInstruction;
}
