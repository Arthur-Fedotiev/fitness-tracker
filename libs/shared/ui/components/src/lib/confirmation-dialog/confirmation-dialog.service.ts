import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { Observable } from 'rxjs';
import { ConfirmationDialogData } from './models';
import { DEFAULT_CONFIRMATION_DATA } from './constants';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  private readonly dialog = inject(MatDialog);

  open(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          ...DEFAULT_CONFIRMATION_DATA,
          ...data,
        },
        disableClose: true,
        delayFocusTrap: true,
        autoFocus: true,
        width: '400px',
      })
      .afterClosed();
  }
}
