import { Provider, EnvironmentProviders } from '@angular/core';

/**
 * Production stand-in for `devtools.providers.ts`, wired up via
 * `fileReplacements`. Deliberately imports nothing from
 * `@ngrx/store-devtools` so the package is absent from the production bundle.
 */
export const provideStoreDevtools = (): Array<Provider | EnvironmentProviders> => [];
