/**
 * `program/ui` is presentational-only and the module-boundary lint rule keeps
 * `type:ui` from depending on `type:domain-logic` (`program/domain`) — so these are
 * local, structural view-model types, not imports of the real domain models. Real
 * `Program`/`MainLiftBlock` objects satisfy these shapes as-is; `program/feature-dashboard`
 * passes them straight through with no conversion needed.
 */

export type ProgramStatus = 'draft' | 'active' | 'completed';
export type RoundingMode = 'nearest' | 'down' | 'up';

export interface RepMaxTestView {
  oneRepMax: number;
  repsAt80Percent: number;
}

export interface LoadingConstraintView {
  increment: number;
  roundingMode: RoundingMode;
}

export interface WeekPrescriptionView {
  week: number;
  load: number;
  sets: number;
  reps: number;
}

export interface MainLiftBlockView {
  id: string;
  exerciseId: string;
  test: RepMaxTestView | null;
  loadingConstraint: LoadingConstraintView;
  cycle: WeekPrescriptionView[] | null;
  fiveRepMaxGoal: number | null;
  week8Retest: number | null;
}

export interface ProgramView {
  id: string;
  name: string;
  status: ProgramStatus;
  mainLiftBlocks: MainLiftBlockView[];
}

export interface ExercisePickerItem {
  id: string;
  name: string;
}

/**
 * What the form needs to help a lifter pick a 5RM Goal: the pre-fill, the band to warn
 * outside of, and the ramp-up ladder shown under the field. Structurally satisfied by
 * `program/domain`'s `RampUpGuidance`, so `program/feature-dashboard` passes it straight
 * through and the `type:ui` module boundary stays intact.
 */
export interface RampUpGuidanceView {
  weeklyJump: number;
  jumpClampedToIncrement: boolean;
  rampUpBaseline: number;
  suggestedGoal: number;
  goalRange: { min: number; max: number };
  ladder: number[];
}

/** Supplied by `program/feature-dashboard`, which may depend on the reload-strategy math. */
export type RampUpGuidanceFn = (input: {
  test: RepMaxTestView;
  loadingConstraint: LoadingConstraintView;
}) => RampUpGuidanceView;
