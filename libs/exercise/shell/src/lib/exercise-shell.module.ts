import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { ExerciseResolver } from '@fitness-tracker/exercise/domain';
import { adminOnly } from '@fitness-tracker/shared/utils';
import { ExerciseFeatureDisplayModule } from '@fitness-tracker/exercise/feature-display';
import { ICON_PROVIDER } from '@fitness-tracker/shared-ui-material';

const exerciseRoutes: Routes = [
  {
    path: 'all',
    loadChildren: () =>
      import('@fitness-tracker/exercise/feature-display').then(
        (m) => m.ExerciseFeatureDisplayModule,
      ),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('@fitness-tracker/exercise/feature-create-and-edit').then(
        (m) => m.ExerciseFeatureCreateAndEditModule,
      ),
    ...canActivate(adminOnly),
  },
  {
    path: ':id',
    resolve: {
      exercise: ExerciseResolver,
    },
    children: [
      { path: 'view', redirectTo: '/exercises/all' },
      {
        path: 'edit',
        loadChildren: () =>
          import('@fitness-tracker/exercise/feature-create-and-edit').then(
            (m) => m.ExerciseFeatureCreateAndEditModule,
          ),
        ...canActivate(adminOnly),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(exerciseRoutes)],
  exports: [RouterModule],
})
export class ExerciseShellModule {
  static forRoot(): ModuleWithProviders<ExerciseFeatureDisplayModule> {
    return {
      ngModule: ExerciseFeatureDisplayModule,
      providers: [
        {
          provide: ICON_PROVIDER,
          useValue: {
            iconKeys: ['exercise-rating'],
            iconUrl: '/assets/images',
          },
          multi: true,
        },
        {
          provide: ICON_PROVIDER,
          useValue: {
            iconKeys: ['exercise-bench', 'shield'],
            iconUrl: '/assets/icons/exercises',
          },
          multi: true,
        },
      ],
    };
  }
}
