import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DiscardChangesDialogService } from '../discard-changes-dialog/discard-changes-dialog.service';

/**
 * Per-Program Edit/Save/Cancel toggle. Replaces itself in place: Edit while read-only,
 * Save+Cancel while editing (icon buttons with tooltips, to stay compact on mobile). Cancel
 * only prompts when there are unsaved changes — see
 * .scratch/training-planner-editing-model/issues/05-readonly-edit-mode-ui.md.
 */
@Component({
  selector: 'ft-program-edit-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './program-edit-toggle.component.html',
  styleUrl: './program-edit-toggle.component.scss',
})
export class ProgramEditToggleComponent {
  readonly readOnly = input.required<boolean>();
  readonly dirty = input.required<boolean>();
  /** Disables Save whenever any visible block's form is currently invalid. See ticket 07. */
  readonly saveDisabled = input<boolean>(false);

  readonly startEdit = output<void>();
  readonly save = output<void>();
  readonly cancelEditing = output<void>();

  private readonly discardChangesDialog = inject(DiscardChangesDialogService);

  protected onCancelClick(): void {
    if (!this.dirty()) {
      this.cancelEditing.emit();
      return;
    }
    this.discardChangesDialog
      .confirm({
        title: 'Discard changes?',
        body: 'You have unsaved changes to this Program. Discarding will lose them.',
        keepEditingLabel: 'Stay editing',
        discardLabel: 'Discard changes',
      })
      .subscribe((result) => {
        if (result === 'discard') {
          this.cancelEditing.emit();
        }
      });
  }
}
