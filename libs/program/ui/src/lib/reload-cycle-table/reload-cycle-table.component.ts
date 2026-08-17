import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { WeekPrescriptionView } from '../models';

interface CycleRow {
  week: number;
  load: number | null;
  setsReps: string;
  isRetestRow: boolean;
}

const RETEST_ROW: Omit<CycleRow, 'load'> = { week: 8, setsReps: '1RM retest', isRetestRow: true };

@Component({
  selector: 'ft-reload-cycle-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatTableModule],
  template: `
    @if (rows().length) {
      @if (stale()) {
        <p class="stale-banner">Outdated — click Generate to refresh</p>
      }
      <table mat-table [dataSource]="rows()" class="cycle-table" [class.stale]="stale()">
        <ng-container matColumnDef="week">
          <th mat-header-cell *matHeaderCellDef>Week</th>
          <td mat-cell *matCellDef="let row">{{ row.week }}</td>
        </ng-container>

        <ng-container matColumnDef="load">
          <th mat-header-cell *matHeaderCellDef>Load</th>
          <td mat-cell *matCellDef="let row">
            @if (row.isRetestRow && !readOnly()) {
              <mat-form-field appearance="outline" class="retest-field" subscriptSizing="dynamic">
                <input
                  matInput
                  type="number"
                  min="1"
                  step="1"
                  [ngModel]="row.load"
                  (ngModelChange)="onRetestInput($event)"
                  #retestControl="ngModel"
                  placeholder="Retest"
                />
                @if (retestControl.invalid && retestControl.dirty) {
                  <mat-error>Retest must be a positive number</mat-error>
                }
              </mat-form-field>
            } @else {
              {{ row.load ?? '—' }}
            }
          </td>
        </ng-container>

        <ng-container matColumnDef="setsReps">
          <th mat-header-cell *matHeaderCellDef>Sets×Reps</th>
          <td mat-cell *matCellDef="let row">{{ row.setsReps }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns" [class.retest-row]="row.isRetestRow"></tr>
      </table>
    } @else {
      <p class="empty">Not generated yet.</p>
    }
  `,
  styleUrl: './reload-cycle-table.component.scss',
})
export class ReloadCycleTableComponent {
  readonly cycle = input<WeekPrescriptionView[] | null>(null);
  readonly week8Retest = input<number | null>(null);
  /** Active/Completed Programs are read-only by default; disables the Week 8 retest input. */
  readonly readOnly = input<boolean>(false);
  /** The shown cycle no longer reflects the block's live inputs — flagged by both wording and color, not color alone. See ticket 04. */
  readonly stale = input<boolean>(false);
  readonly retestChange = output<number>();

  protected readonly columns = ['week', 'load', 'setsReps'] as const;
  protected readonly rows = computed<CycleRow[]>(() => {
    const weeks = this.cycle();
    if (!weeks) {
      return [];
    }
    const prescriptionRows = weeks.map(({ week, load, sets, reps }) => ({
      week,
      load,
      setsReps: `${sets}×${reps}`,
      isRetestRow: false,
    }));
    return [...prescriptionRows, { ...RETEST_ROW, load: this.week8Retest() }];
  });

  protected onRetestInput(value: number | null): void {
    if (value != null && Number.isFinite(value) && value > 0) {
      this.retestChange.emit(value);
    }
  }
}
