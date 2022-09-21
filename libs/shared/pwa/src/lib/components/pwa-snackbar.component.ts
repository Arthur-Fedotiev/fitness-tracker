import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'ft-pwa-snackbar',
  templateUrl: './pwa-snackbar.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PwaSnackbarComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public readonly data: any,
  ) {}

  public onConfirm(): void {
    this.confirm.emit();
  }

  public onCancel(): void {
    this.cancel.emit();
  }
}
