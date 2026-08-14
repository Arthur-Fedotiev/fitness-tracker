import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ProgramView } from '../models';

@Component({
  selector: 'ft-program-chip-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChipsModule],
  templateUrl: './program-chip-list.component.html',
  styleUrl: './program-chip-list.component.scss',
})
export class ProgramChipListComponent {
  readonly programs = input<ProgramView[]>([]);
  readonly selectedProgramId = input<string | null>(null);
  readonly programSelect = output<ProgramView>();
}
