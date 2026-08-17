import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthFacadeService } from '@fitness-tracker/auth/domain';
import { ProgramStore } from '../program.store';

/** Preloads the current user's Programs before the dashboard renders. */
export const programListResolver: ResolveFn<void> = async () => {
  const userId = inject(AuthFacadeService).userInfo()?.uid;
  if (!userId) {
    return;
  }
  await inject(ProgramStore).loadPrograms(userId);
};
