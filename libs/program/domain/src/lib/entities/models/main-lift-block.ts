import { AnchorSource } from './anchor-source';
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
  anchorSource: AnchorSource | null;
  cycle: WeekPrescription[] | null;
  /** The lifter-entered Week 5 override that produced `cycle`, if `anchorSource === 'manual'`. */
  manualWeek5: number | null;
  week8Retest: number | null;
}
