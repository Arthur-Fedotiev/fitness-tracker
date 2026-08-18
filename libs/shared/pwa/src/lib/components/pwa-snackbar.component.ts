import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'ft-pwa-snackbar',
  templateUrl: './pwa-snackbar.component.html',
  styleUrl: './pwa-snackbar.component.scss',
  // The snack bar panel wraps this component from the outside and the message is
  // rendered through [innerHTML]; neither is reachable with scoped styles.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule],
})
export class PwaSnackbarComponent {
  readonly data = inject(MAT_SNACK_BAR_DATA);

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  public onConfirm(): void {
    this.confirm.emit();
  }

  public onCancel(): void {
    this.cancel.emit();
  }
}
