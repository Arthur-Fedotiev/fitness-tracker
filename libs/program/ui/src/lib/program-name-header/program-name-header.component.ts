import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const PROGRAM_NAME_MAX_LENGTH = 60;

function sanitizeProgramName(candidate: string, fallback: string): string {
  const trimmed = candidate.trim();
  return trimmed ? trimmed.slice(0, PROGRAM_NAME_MAX_LENGTH) : fallback;
}

/**
 * Selected Program's name, with an inline pencil-to-edit rename affordance. Presentational
 * only — the caller supplies the already-resolved display name (default or user-set) and
 * decides what to do with a `rename` event. See
 * .scratch/training-planner-editing-model/issues/01-program-name-default-and-rename-ux.md.
 */
@Component({
  selector: 'ft-program-name-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './program-name-header.component.html',
  styleUrl: './program-name-header.component.scss',
})
export class ProgramNameHeaderComponent {
  readonly name = input.required<string>();
  /** Active/Completed Programs are read-only by default; hides the rename pencil. */
  readonly readOnly = input<boolean>(false);
  /** This user's other Program names — renaming to a case-insensitive duplicate is blocked. */
  readonly existingNames = input<string[]>([]);
  readonly rename = output<string>();

  protected readonly maxLength = PROGRAM_NAME_MAX_LENGTH;
  protected readonly editing = signal(false);
  protected readonly draft = signal('');
  protected readonly error = signal<string | null>(null);

  protected startEdit(): void {
    this.draft.set(this.name());
    this.error.set(null);
    this.editing.set(true);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
    this.error.set(null);
  }

  protected commit(value: string): void {
    const sanitized = sanitizeProgramName(value, this.name());
    if (sanitized === this.name()) {
      this.editing.set(false);
      this.error.set(null);
      return;
    }
    const isDuplicate = this.existingNames().some(
      (existing) => existing.trim().toLowerCase() === sanitized.toLowerCase(),
    );
    if (isDuplicate) {
      this.error.set('You already have a Program with this name.');
      return;
    }
    this.editing.set(false);
    this.error.set(null);
    this.rename.emit(sanitized);
  }
}
