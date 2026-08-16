import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoadingConstraintView, MainLiftBlockView, RepMaxTestView, SuggestWeek5Fn } from '../models';
import { positiveNumber } from './positive-number.validator';

// `Validators.required` is a static method reference — wrap it so `@typescript-eslint/unbound-method`
// doesn't flag it for unintended `this` scoping when passed by value to `fb.control(...)`.
const requiredValidator: ValidatorFn = (control) => Validators.required(control);

@Component({
  selector: 'ft-main-lift-block-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  template: `
<form [formGroup]="form" class="test-grid" (focusout)="onFieldBlur()">
  <mat-form-field appearance="outline">
    <mat-label>1RM</mat-label>
    <input matInput type="number" formControlName="oneRepMax" />
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Reps @ 80%1RM</mat-label>
    <input matInput type="number" formControlName="repsAt80Percent" />
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Min available increment</mat-label>
    <input matInput type="number" formControlName="increment" />
  </mat-form-field>

  <mat-button-toggle-group formControlName="roundingMode" aria-label="Rounding mode">
    <mat-button-toggle value="nearest">Nearest</mat-button-toggle>
    <mat-button-toggle value="down">Down</mat-button-toggle>
    <mat-button-toggle value="up">Up</mat-button-toggle>
  </mat-button-toggle-group>

  <mat-slide-toggle formControlName="manualOverride">Manual override</mat-slide-toggle>

  @if (form.controls.manualOverride.value) {
    <p class="manual-override-hint">1RM and Reps @ 80%1RM are optional with a manual override.</p>
  }

  @if (!form.controls.manualOverride.value) {
    <p class="suggested-week5">Suggested Week 5: {{ suggestedWeek5() ?? '—' }}</p>
  }

  <mat-form-field appearance="outline">
    <mat-label>Manual Week 5</mat-label>
    <input matInput type="number" formControlName="manualWeek5" />
  </mat-form-field>

  @if (!readOnly()) {
    <div class="actions">
      <button mat-flat-button color="primary" type="button" [disabled]="form.invalid" (click)="onGenerate()">
        {{ block().cycle ? 'Regenerate' : 'Generate' }}
      </button>
    </div>
  }
</form>
  `,
  styleUrl: './main-lift-block-form.component.scss',
})
export class MainLiftBlockFormComponent {
  readonly block = input.required<MainLiftBlockView>();
  readonly suggestWeek5 = input<SuggestWeek5Fn | null>(null);
  /** Active/Completed Programs are read-only by default; disables all inputs and hides the actions row. */
  readonly readOnly = input<boolean>(false);
  /** Stages Test + Loading Constraint into the draft — fired on blur, not an explicit click. See ticket 07. */
  readonly save = output<{ test: RepMaxTestView; loadingConstraint: LoadingConstraintView }>();
  readonly generate = output<number | null>();
  /** Whether this block's form is currently valid — feeds Program Save's disabled state. */
  readonly validityChange = output<boolean>();
  /** Any live input edit, keystroke-level — feeds the Reload Cycle preview's staleness flag. */
  readonly formChanged = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    oneRepMax: this.fb.control<number | null>(null, [requiredValidator, positiveNumber]),
    repsAt80Percent: this.fb.control<number | null>(null, [requiredValidator, Validators.min(1)]),
    increment: this.fb.control<number | null>(2.5, [requiredValidator, positiveNumber]),
    roundingMode: this.fb.control<'nearest' | 'down' | 'up'>('nearest', { nonNullable: true }),
    manualOverride: this.fb.control<boolean>(false, { nonNullable: true }),
    manualWeek5: this.fb.control<number | null>({ value: null, disabled: true }, [requiredValidator, positiveNumber]),
  });

  private readonly formValues = toSignal(this.form.valueChanges.pipe(map(() => this.form.getRawValue())), {
    initialValue: this.form.getRawValue(),
  });

  protected readonly suggestedWeek5 = computed(() => {
    const suggest = this.suggestWeek5();
    const { oneRepMax, repsAt80Percent, increment, roundingMode } = this.formValues();
    if (!suggest || oneRepMax == null || increment == null) {
      return null;
    }
    return suggest({ test: { oneRepMax, repsAt80Percent }, loadingConstraint: { increment, roundingMode } });
  });

  constructor() {
    effect(() => {
      const block = this.block();
      const manual = block.anchorSource === 'manual';
      this.form.patchValue(
        {
          oneRepMax: block.test?.oneRepMax ?? null,
          repsAt80Percent: block.test?.repsAt80Percent ?? null,
          increment: block.loadingConstraint.increment,
          roundingMode: block.loadingConstraint.roundingMode,
          manualOverride: manual,
          manualWeek5: manual ? block.manualWeek5 : null,
        },
        { emitEvent: false },
      );
      if (manual) {
        this.form.controls.manualWeek5.enable({ emitEvent: false });
      }
      this.applyManualOverrideValidators(manual, { emitEvent: false });
    });

    this.form.controls.manualOverride.valueChanges.pipe(takeUntilDestroyed()).subscribe((manualOverride) => {
      if (manualOverride) {
        this.form.controls.manualWeek5.enable({ emitEvent: false });
      } else {
        this.form.controls.manualWeek5.disable({ emitEvent: false });
        this.form.controls.manualWeek5.reset(null, { emitEvent: false });
      }
      this.applyManualOverrideValidators(manualOverride, { emitEvent: true });
    });

    effect(() => {
      if (this.readOnly()) {
        this.form.disable({ emitEvent: false });
        return;
      }
      this.form.enable({ emitEvent: false });
      if (!this.form.controls.manualOverride.value) {
        this.form.controls.manualWeek5.disable({ emitEvent: false });
      }
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.formChanged.emit());

    this.validityChange.emit(this.form.status !== 'INVALID');
    this.form.statusChanges.pipe(takeUntilDestroyed()).subscribe((status) => {
      this.validityChange.emit(status !== 'INVALID');
    });
  }

  /**
   * 1RM and Reps @ 80%1RM are only required outside Manual override — a Manual Week 5
   * needs neither (see `RepMaxTest`'s docstring). Applied on every rehydrate/toggle so
   * `form.invalid` alone stays the single source of truth for Generate/Save gating.
   */
  private applyManualOverrideValidators(manual: boolean, options: { emitEvent: boolean }): void {
    this.form.controls.oneRepMax.setValidators(manual ? [positiveNumber] : [requiredValidator, positiveNumber]);
    this.form.controls.repsAt80Percent.setValidators(
      manual ? [Validators.min(1)] : [requiredValidator, Validators.min(1)],
    );
    this.form.controls.oneRepMax.updateValueAndValidity(options);
    this.form.controls.repsAt80Percent.updateValueAndValidity(options);
  }

  /** Stages the current inputs on blur (focusout bubbles from any field), only when valid — the same gate the old Apply button had. See ticket 07. */
  protected onFieldBlur(): void {
    if (this.form.invalid) {
      return;
    }
    const { oneRepMax, repsAt80Percent, increment, roundingMode } = this.form.getRawValue();
    if (increment == null) {
      return;
    }
    this.save.emit({
      test: { oneRepMax, repsAt80Percent },
      loadingConstraint: { increment, roundingMode },
    });
  }

  protected onGenerate(): void {
    if (this.form.invalid) {
      return;
    }
    const { manualOverride, manualWeek5 } = this.form.getRawValue();
    this.generate.emit(manualOverride ? manualWeek5 : null);
  }
}
