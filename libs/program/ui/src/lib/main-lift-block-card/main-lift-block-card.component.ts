import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MainLiftBlockFormComponent } from '../main-lift-block-form/main-lift-block-form.component';
import { LoadingConstraintView, MainLiftBlockView, RepMaxTestView, SuggestWeek5Fn } from '../models';
import { ReloadCycleTableComponent } from '../reload-cycle-table/reload-cycle-table.component';

@Component({
  selector: 'ft-main-lift-block-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCardModule, MainLiftBlockFormComponent, ReloadCycleTableComponent],
  templateUrl: './main-lift-block-card.component.html',
  styleUrl: './main-lift-block-card.component.scss',
})
export class MainLiftBlockCardComponent {
  readonly block = input.required<MainLiftBlockView>();
  readonly exerciseName = input<string>('');
  readonly suggestWeek5 = input<SuggestWeek5Fn | null>(null);
  /** Active/Completed Programs are read-only by default; hides Remove and disables the nested form/table. */
  readonly readOnly = input<boolean>(false);
  /** Bumped on session begin/cancel/save — resets the stale flag on those boundaries without reacting to ordinary blur-staging. */
  readonly sessionEpoch = input<number>(0);

  readonly save = output<{ test: RepMaxTestView; loadingConstraint: LoadingConstraintView }>();
  readonly generate = output<number | null>();
  readonly remove = output<void>();
  readonly retestChange = output<number>();
  readonly validityChange = output<boolean>();

  /** The shown Reload Cycle table has gone stale relative to the last Generate/Save. See ticket 04. */
  protected readonly stale = signal(false);

  constructor() {
    effect(() => {
      this.sessionEpoch();
      this.stale.set(false);
    });
  }

  protected onFormChanged(): void {
    this.stale.set(true);
  }

  protected onGenerate(manualWeek5: number | null): void {
    this.stale.set(false);
    this.generate.emit(manualWeek5);
  }
}
