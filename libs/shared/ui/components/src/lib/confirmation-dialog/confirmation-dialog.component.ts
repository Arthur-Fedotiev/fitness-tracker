import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { ConfirmationDialogData } from './models';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ft-confirmation-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 class="header" mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="content">{{
      data.message
    }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button
        mat-button
        mat-stroked-button
        color="warn"
        [mat-dialog-close]="true"
        (click)="dialogRef.close(true)"
      >
        {{ data.confirmLabel }}
      </button>
      <button
        mat-stroked-button
        cdkFocusInitial
        color="accent"
        [mat-dialog-close]="false"
        (click)="dialogRef.close(false)"
      >
        {{ data.cancelLabel }}
      </button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
}
