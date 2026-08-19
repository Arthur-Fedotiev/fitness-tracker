import { importProvidersFrom, Provider, EnvironmentProviders } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

/**
 * Development-only NgRx devtools wiring.
 *
 * Swapped for `devtools.providers.prod.ts` by the `fileReplacements` entry in
 * the app's production build target. The swap is what actually keeps
 * `@ngrx/store-devtools` out of the production bundle — a `!production`
 * ternary cannot, because the static import survives tree-shaking.
 */
export const provideStoreDevtools = (): Array<Provider | EnvironmentProviders> => [
  importProvidersFrom(StoreDevtoolsModule.instrument({ connectInZone: true })),
];
