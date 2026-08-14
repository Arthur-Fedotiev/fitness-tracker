import { RoundingMode } from './rounding-mode';

/** A gym's smallest weight jump and how to round a calculated load to it. */
export interface LoadingConstraint {
  increment: number;
  roundingMode: RoundingMode;
}
