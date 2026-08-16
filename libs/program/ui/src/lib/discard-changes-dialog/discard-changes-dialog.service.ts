import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  DiscardChangesDialogComponent,
  DiscardChangesDialogData,
  DiscardChangesDialogResult,
} from './discard-changes-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DiscardChangesDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: DiscardChangesDialogData): Observable<DiscardChangesDialogResult> {
    return this.dialog
      .open<DiscardChangesDialogComponent, DiscardChangesDialogData, DiscardChangesDialogResult>(
        DiscardChangesDialogComponent,
        { data },
      )
      .afterClosed();
  }
}
