import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ft-workout-page',
  templateUrl: './workout-page.component.html',
  styleUrls: ['./workout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class WorkoutPageComponent {}
