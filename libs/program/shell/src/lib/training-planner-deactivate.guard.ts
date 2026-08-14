import { CanDeactivateFn } from '@angular/router';
import type { ProgramDashboardComponent } from '@fitness-tracker/program/feature-dashboard';

/**
 * Blocks navigating away from the training-planner route while an edit session has
 * unsaved changes — Draft Programs are always in one, so without this, silent data
 * loss would be routine. See
 * .scratch/training-planner-editing-model/issues/06-unsaved-changes-navigation-guard.md.
 */
export const trainingPlannerDeactivateGuard: CanDeactivateFn<ProgramDashboardComponent> = (component) =>
  component.confirmLeave();
