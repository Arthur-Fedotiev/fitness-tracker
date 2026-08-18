import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// Anything importing `@fitness-tracker/shared/utils` drags in
// `@angular/fire/auth-guard`, which resolves to Firebase's Node build. That
// build hands `fetch` and `Response` to its FetchProvider at import time, and
// jsdom supplies neither. Nothing under test issues a request, so a rejecting
// stub is enough to let the module load — and loud enough if one ever does.
const g = globalThis as Record<string, unknown>;

g['fetch'] ??= () =>
  Promise.reject(
    new Error('fetch is not available in unit tests; stub the call instead'),
  );
g['Response'] ??= class Response {};
g['Headers'] ??= class Headers {};
g['Request'] ??= class Request {};

setupZoneTestEnv();
