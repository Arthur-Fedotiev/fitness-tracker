import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ProgramChipListComponent } from '../program-chip-list/program-chip-list.component';
import { ProgramStatus, ProgramView } from '../models';

const STATUS_TABS: ProgramStatus[] = ['draft', 'active', 'completed'];

@Component({
  selector: 'ft-program-status-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTabsModule, ProgramChipListComponent],
  template: `
    <mat-tab-group [selectedIndex]="statuses.indexOf(activeStatus())" (selectedIndexChange)="onIndexChange($event)">
      @for (status of statuses; track status) {
        <mat-tab [label]="status">
          <div class="tab-body">
            <ft-program-chip-list
              [programs]="programsByStatus()[status]"
              [selectedProgramId]="selectedProgramId()"
              (programSelect)="selectProgram.emit($event)"
            />
          </div>
        </mat-tab>
      }
    </mat-tab-group>
  `,
  styleUrl: './program-status-tabs.component.scss',
})
export class ProgramStatusTabsComponent {
  readonly draftPrograms = input<ProgramView[]>([]);
  readonly activePrograms = input<ProgramView[]>([]);
  readonly completedPrograms = input<ProgramView[]>([]);
  readonly selectedProgramId = input<string | null>(null);
  readonly activeStatus = input<ProgramStatus>('draft');

  readonly statusChange = output<ProgramStatus>();
  readonly selectProgram = output<ProgramView>();

  protected readonly statuses = STATUS_TABS;
  protected readonly programsByStatus = computed<Record<ProgramStatus, ProgramView[]>>(() => ({
    draft: this.draftPrograms(),
    active: this.activePrograms(),
    completed: this.completedPrograms(),
  }));

  protected onIndexChange(index: number): void {
    this.statusChange.emit(this.statuses[index]);
  }
}
