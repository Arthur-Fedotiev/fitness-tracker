import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { formViewProvider } from '@fitness-tracker/shared/utils';
import { WorkoutItemInstruction } from '@fitness-tracker/workout-domain';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ft-workout-item-rest',
  templateUrl: './workout-item-rest.component.html',
  styleUrls: ['./workout-item-rest.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [formViewProvider],
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, TranslateModule],
})
export class WorkoutItemRestComponent {
  @Input() instruction!: WorkoutItemInstruction;
}