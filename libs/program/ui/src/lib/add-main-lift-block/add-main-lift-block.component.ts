import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ExercisePickerItem } from '../models';

/** While the user is still typing, the picker holds raw search text; once they pick an option, it holds the exercise. */
type PendingSelection = ExercisePickerItem | string | null;

@Component({
  selector: 'ft-add-main-lift-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './add-main-lift-block.component.html',
  styleUrl: './add-main-lift-block.component.scss',
})
export class AddMainLiftBlockComponent {
  readonly exercises = input<ExercisePickerItem[]>([]);
  readonly add = output<string>();

  protected readonly pickerOpen = signal(false);
  protected readonly pendingSelection = signal<PendingSelection>(null);

  protected readonly filteredExercises = computed(() => {
    const selection = this.pendingSelection();
    const searchTerm = (typeof selection === 'string' ? selection : (selection?.name ?? '')).toLowerCase();
    return this.exercises().filter((exercise) => exercise.name.toLowerCase().includes(searchTerm));
  });

  protected displayExercise(selection: PendingSelection): string {
    return typeof selection === 'string' ? selection : (selection?.name ?? '');
  }

  protected openPicker(): void {
    this.pickerOpen.set(true);
  }

  /** Selecting an option commits immediately — no separate confirm click — and closes the picker back to the trigger. */
  protected onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const exercise = event.option.value as ExercisePickerItem;
    this.add.emit(exercise.id);
    this.pendingSelection.set(null);
    this.pickerOpen.set(false);
  }
}
