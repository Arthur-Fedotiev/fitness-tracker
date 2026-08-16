import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ProgramView } from '../models';

@Component({
  selector: 'ft-program-chip-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChipsModule],
  template: `
    <mat-chip-set aria-label="Programs in this status">
      @for (program of programs(); track program.id) {
        <mat-chip [highlighted]="program.id === selectedProgramId()" (click)="programSelect.emit(program)">
          {{ program.name }}
        </mat-chip>
      }
    </mat-chip-set>
  `,
  styleUrl: './program-chip-list.component.scss',
})
export class ProgramChipListComponent {
  readonly programs = input<ProgramView[]>([]);
  readonly selectedProgramId = input<string | null>(null);
  readonly programSelect = output<ProgramView>();
}
