import { LoadingConstraint } from './loading-constraint';
import { RepMaxTest } from './rep-max-test';
import { WeekPrescription } from './week-prescription';

/**
 * One main lift's entry within a Program — links to an existing `exercise` by id.
 * Named to leave room for future Accessory/Specialized-Variety block types (out of
 * scope for now, see ADR-0007) without renaming this one later.
 */
export interface MainLiftBlock {
  id: string;
  exerciseId: string;
  test: RepMaxTest | null;
  loadingConstraint: LoadingConstraint;
  cycle: WeekPrescription[] | null;
  /** The 5RM Goal that produced `cycle`. Null until the lifter generates one. */
  fiveRepMaxGoal: number | null;
  week8Retest: number | null;
}
