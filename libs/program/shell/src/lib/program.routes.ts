import { Routes } from '@angular/router';
import { EXERCISE_DOMAIN_PROVIDERS, exerciseDetailsDialogProvider } from '@fitness-tracker/exercise/public-api';
import { programListResolver } from '@fitness-tracker/program/domain';
import { trainingPlannerDeactivateGuard } from './training-planner-deactivate.guard';

export const programRoutes = [
  {
    path: '',
    providers: [EXERCISE_DOMAIN_PROVIDERS, exerciseDetailsDialogProvider],
    resolve: { resolvedPrograms: programListResolver },
    canDeactivate: [trainingPlannerDeactivateGuard],
    loadComponent: () =>
      import('@fitness-tracker/program/feature-dashboard').then((m) => m.ProgramDashboardComponent),
  },
] satisfies Routes;
