import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface DiscardChangesDialogData {
  title: string;
  body?: string;
  keepEditingLabel: string;
  discardLabel: string;
  /** When present, shows a third "Save & leave"-style button and the dialog can resolve 'save'. */
  saveLabel?: string;
}

export type DiscardChangesDialogResult = 'save' | 'discard' | undefined;

/**
 * Confirms discarding unsaved changes. Copy is caller-supplied via `data` so different
 * triggers (Cancel during a Program edit session, navigating away with unsaved changes)
 * can word it appropriately while sharing one dialog. Navigating away offers a third
 * Save & leave option; a plain Cancel does not. See
 * .scratch/training-planner-editing-model/issues/06-unsaved-changes-navigation-guard.md.
 */
@Component({
  selector: 'ft-discard-changes-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    @if (data.body) {
      <mat-dialog-content>{{ data.body }}</mat-dialog-content>
    }
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(undefined)">{{ data.keepEditingLabel }}</button>
      <button mat-button color="warn" (click)="dialogRef.close('discard')">{{ data.discardLabel }}</button>
      @if (data.saveLabel) {
        <button mat-flat-button color="primary" (click)="dialogRef.close('save')">{{ data.saveLabel }}</button>
      }
    </mat-dialog-actions>
  `,
})
export class DiscardChangesDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<DiscardChangesDialogComponent, DiscardChangesDialogResult>);
  protected readonly data = inject<DiscardChangesDialogData>(MAT_DIALOG_DATA);
}
