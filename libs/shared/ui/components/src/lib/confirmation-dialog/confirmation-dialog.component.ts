import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { ConfirmationDialogData } from './models';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ft-confirmation-dialog',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 class="header" mat-dialog-title>{{ data.title | translate }}</h2>
    <mat-dialog-content class="content">{{
      data.message | translate
    }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button
        mat-button
        mat-stroked-button
        color="warn"
        [mat-dialog-close]="true"
        (click)="dialogRef.close(true)"
      >
        {{ data.confirmLabel | translate }}
      </button>
      <button
        mat-stroked-button
        cdkFocusInitial
        color="accent"
        [mat-dialog-close]="false"
        (click)="dialogRef.close(false)"
      >
        {{ data.cancelLabel | translate }}
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
