import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingConstraintView, MainLiftBlockView, RampUpGuidanceFn, RampUpGuidanceView, RepMaxTestView } from '../models';
import { positiveNumber } from './positive-number.validator';

// `Validators.required` is a static method reference — wrap it so `@typescript-eslint/unbound-method`
// doesn't flag it for unintended `this` scoping when passed by value to `fb.control(...)`.
const requiredValidator: ValidatorFn = (control) => Validators.required(control);

@Component({
  selector: 'ft-main-lift-block-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatButtonModule, MatButtonToggleModule, MatFormFieldModule, MatInputModule],
  template: `
<form [formGroup]="form" class="test-grid" (focusout)="onFieldBlur()">
  <mat-form-field appearance="outline">
    <mat-label>1RM</mat-label>
    <input matInput type="number" formControlName="oneRepMax" />
    <mat-hint>Your most recent one-rep max — everything else scales from this.</mat-hint>
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Reps @ 80%1RM</mat-label>
    <input matInput type="number" formControlName="repsAt80Percent" />
    <mat-hint>However many reps you managed on an AMRAP set at 80% of that 1RM.</mat-hint>
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Min available increment</mat-label>
    <input matInput type="number" formControlName="increment" />
    <mat-hint>The smallest weight jump your gym's plates or pins allow.</mat-hint>
  </mat-form-field>

  <mat-button-toggle-group formControlName="roundingMode" aria-label="Rounding mode">
    <mat-button-toggle value="nearest">Nearest</mat-button-toggle>
    <mat-button-toggle value="down">Down</mat-button-toggle>
    <mat-button-toggle value="up">Up</mat-button-toggle>
  </mat-button-toggle-group>
  <p class="field-hint">Which way to round a calculated load to fit that increment.</p>

  <mat-form-field appearance="outline">
    <mat-label>5RM Goal</mat-label>
    <input matInput type="number" formControlName="fiveRepMaxGoal" />
    <mat-hint>The heaviest weight you can do 5 perfect reps with. Week 5 aims for 5 sets of it.</mat-hint>
  </mat-form-field>

  @if (guidance(); as rampUp) {
    @if (goalOutOfBand()) {
      <p class="goal-warning">
        A realistic goal usually lands between {{ rampUp.goalRange.min }} and {{ rampUp.goalRange.max }}.
        Worth double-checking this one.
      </p>
    }

    @if (rampUp.jumpClampedToIncrement) {
      <p class="field-hint">
        Your increment is coarser than this lift's weekly jump, so the cycle steps by
        {{ rampUp.weeklyJump }} instead. Smaller plates would fix it.
      </p>
    }

    <details class="ramp-up">
      <summary>Not sure? Find it with a ramp-up test</summary>
      <p>
        Start at {{ rampUp.rampUpBaseline }} and do 5 reps. Rest 3 minutes, add
        {{ rampUp.weeklyJump }}, and go again. Keep climbing until you cannot get 5 perfect
        reps. The last weight you did get 5 with is your goal.
      </p>
      <p class="ladder">{{ rampUp.ladder.join(', ') }}</p>
      <p class="ladder-note">
        {{ rampUp.rampUpBaseline }} is where the test starts, not a goal. Only enter it here
        if that is where the test stopped you.
      </p>
    </details>
  }

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
export class MainLiftBlockFormComponent implements OnInit {
  readonly block = input.required<MainLiftBlockView>();
  readonly rampUpGuidance = input<RampUpGuidanceFn | null>(null);
  /** Active/Completed Programs are read-only by default; disables all inputs and hides the actions row. */
  readonly readOnly = input<boolean>(false);
  /** Stages Test + Loading Constraint into the draft — fired on blur, not an explicit click. See ticket 07. */
  readonly save = output<{ test: RepMaxTestView; loadingConstraint: LoadingConstraintView }>();
  readonly generate = output<number>();
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
    fiveRepMaxGoal: this.fb.control<number | null>(null, [requiredValidator, positiveNumber]),
  });

  private readonly formValues = toSignal(this.form.valueChanges.pipe(map(() => this.form.getRawValue())), {
    initialValue: this.form.getRawValue(),
  });

  /**
   * Null until the 80%RM Test is complete and valid. Everything that helps a lifter pick
   * their 5RM Goal hangs off this: the pre-fill, the out-of-band warning, and the ladder.
   */
  protected readonly guidance = computed<RampUpGuidanceView | null>(() => {
    const guidanceFor = this.rampUpGuidance();
    const { oneRepMax, repsAt80Percent, increment, roundingMode } = this.formValues();
    if (!guidanceFor || oneRepMax == null || repsAt80Percent == null || increment == null) {
      return null;
    }
    if (oneRepMax <= 0 || repsAt80Percent < 1 || increment <= 0) {
      return null;
    }
    return guidanceFor({ test: { oneRepMax, repsAt80Percent }, loadingConstraint: { increment, roundingMode } });
  });

  /**
   * Reload puts a realistic 5RM Goal between 82% and 88% of 1RM (printed p.10). Outside
   * that band the lifter has probably mistyped, so warn rather than block. An experienced
   * lifter who tested their way to an outlier is entitled to keep it.
   */
  protected readonly goalOutOfBand = computed(() => {
    const guidance = this.guidance();
    const goal = this.formValues().fiveRepMaxGoal;
    if (!guidance || goal == null || goal <= 0) {
      return false;
    }
    return goal < guidance.goalRange.min || goal > guidance.goalRange.max;
  });

  constructor() {
    effect(() => {
      const block = this.block();
      this.form.patchValue(
        {
          oneRepMax: block.test?.oneRepMax ?? null,
          repsAt80Percent: block.test?.repsAt80Percent ?? null,
          increment: block.loadingConstraint.increment,
          roundingMode: block.loadingConstraint.roundingMode,
          // Falls back to what's already in the field, because blur-staging carries the
          // Test and Loading Constraint but not the goal. Without this, the first blur
          // after a pre-fill hands back a block whose `fiveRepMaxGoal` is still null and
          // wipes the field. The pre-fill effect can't undo it either: this patch is
          // `emitEvent: false`, so `guidance()` never changes and the effect never re-runs.
          fiveRepMaxGoal: block.fiveRepMaxGoal ?? this.form.controls.fiveRepMaxGoal.value,
        },
        { emitEvent: false },
      );
    });

    /**
     * Pre-fills the goal once the Test is complete, and only into an empty field the
     * lifter hasn't touched, so it never overwrites a saved goal or one being typed.
     */
    effect(() => {
      const guidance = this.guidance();
      const goalControl = this.form.controls.fiveRepMaxGoal;
      if (!guidance || goalControl.dirty || goalControl.value != null) {
        return;
      }
      goalControl.setValue(guidance.suggestedGoal);
    });

    effect(() => {
      if (this.readOnly()) {
        this.form.disable({ emitEvent: false });
        return;
      }
      this.form.enable({ emitEvent: false });
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.formChanged.emit());

    this.form.statusChanges.pipe(takeUntilDestroyed()).subscribe((status) => {
      this.validityChange.emit(status !== 'INVALID');
    });
  }

  /**
   * Reports initial validity here, not in the constructor: Angular wires up the parent's
   * `(validityChange)` listener right after this component's constructor runs but before
   * `ngOnInit` — emitting synchronously in the constructor fires before anyone's listening
   * and is silently dropped.
   */
  ngOnInit(): void {
    this.validityChange.emit(this.form.status !== 'INVALID');
  }

  /** Stages the current inputs on blur (focusout bubbles from any field), only when valid — the same gate the old Apply button had. See ticket 07. */
  protected onFieldBlur(): void {
    if (this.form.invalid) {
      return;
    }
    const { oneRepMax, repsAt80Percent, increment, roundingMode } = this.form.getRawValue();
    if (oneRepMax == null || repsAt80Percent == null || increment == null) {
      return;
    }
    this.save.emit({
      test: { oneRepMax, repsAt80Percent },
      loadingConstraint: { increment, roundingMode },
    });
  }

  protected onGenerate(): void {
    const goal = this.form.getRawValue().fiveRepMaxGoal;
    if (this.form.invalid || goal == null) {
      return;
    }
    this.generate.emit(goal);
  }
}
