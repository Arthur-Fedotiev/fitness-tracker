import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { InstructionType } from '../../compose-workout.component';

@Component({
  selector: 'ft-workout-item-load-subform',
  templateUrl: './workout-item-load-subform.component.html',
  styleUrls: ['./workout-item-load-subform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutItemLoadSubformComponent implements OnInit {
  public readonly instructionType = InstructionType;
  constructor(public readonly controlContainer: ControlContainer) {
    console.log(controlContainer);
  }

  ngOnInit(): void {}
}
