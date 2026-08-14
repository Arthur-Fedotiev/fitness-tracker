/**
 * `program/ui` is presentational-only and the module-boundary lint rule keeps
 * `type:ui` from depending on `type:domain-logic` (`program/domain`) — so these are
 * local, structural view-model types, not imports of the real domain models. Real
 * `Program`/`MainLiftBlock` objects satisfy these shapes as-is; `program/feature-dashboard`
 * passes them straight through with no conversion needed.
 */

export type ProgramStatus = 'draft' | 'active' | 'completed';
export type RoundingMode = 'nearest' | 'down' | 'up';
export type AnchorSource = 'placeholder' | 'table' | 'manual';

export interface RepMaxTestView {
  oneRepMax: number | null;
  repsAt80Percent: number | null;
}

export interface LoadingConstraintView {
  increment: number;
  roundingMode: RoundingMode;
}

export interface WeekPrescriptionView {
  week: number;
  load: number | null;
  sets: number;
  reps: number;
}

export interface MainLiftBlockView {
  id: string;
  exerciseId: string;
  test: RepMaxTestView | null;
  loadingConstraint: LoadingConstraintView;
  anchorSource: AnchorSource | null;
  cycle: WeekPrescriptionView[] | null;
  manualWeek5: number | null;
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
 * A pure preview of the table-driven Week 5 suggestion, supplied by `program/feature-dashboard`
 * (which may depend on `program/domain`'s reload-strategy math) and called from within
 * `program/ui`'s form. The domain function structurally satisfies this shape as-is — no
 * import of `program/domain` needed here, keeping the `type:ui` module boundary intact.
 */
export type SuggestWeek5Fn = (input: {
  test: { oneRepMax: number; repsAt80Percent: number | null };
  loadingConstraint: LoadingConstraintView;
}) => number | null;
