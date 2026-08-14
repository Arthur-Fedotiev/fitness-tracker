import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogService } from '@fitness-tracker/shared/ui/components';

/**
 * Per-Program delete affordance, always available regardless of Draft/Active/Completed
 * status or edit-session state — deletion is a whole-entity removal, orthogonal to editing
 * (see .scratch/training-planner-editing-model/issues/02-edit-session-architecture.md).
 */
@Component({
  selector: 'ft-program-delete-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './program-delete-button.component.html',
  styleUrl: './program-delete-button.component.scss',
})
export class ProgramDeleteButtonComponent {
  readonly programName = input.required<string>();
  readonly delete = output<void>();

  private readonly confirmationDialog = inject(ConfirmationDialogService);
  private readonly destroyRef = inject(DestroyRef);

  protected onDeleteClick(): void {
    this.confirmationDialog
      .open({
        title: 'Delete Program',
        message: `Are you sure you want to delete "${this.programName()}"? This can't be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.delete.emit();
        }
      });
  }
}
