import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackBarData } from '../models/pwa.models';

@Component({
  selector: 'ft-pwa-snackbar',
  templateUrl: './pwa-snackbar.component.html',
  styleUrls: ['./pwa-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PwaSnackbarComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public readonly data: SnackBarData,
  ) {}

  public onConfirm(): void {
    this.confirm.emit();
  }

  public onCancel(): void {
    this.cancel.emit();
  }
}
