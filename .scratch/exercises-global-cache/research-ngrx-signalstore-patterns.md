# Research: @ngrx/signals signalStore — reusable/composable patterns

Scope: primary sources only — ngrx.io docs (fetched from their markdown source in the
`ngrx/platform` GitHub repo, `main` branch), the `@ngrx/signals` source code
(`modules/signals/**` in `ngrx/platform`), and maintainer statements in GitHub
Discussions/Issues. Secondary blog posts are cited only where explicitly labeled as such,
and never as the sole source for a claim.

All GitHub paths below are relative to `https://github.com/ngrx/platform` at the `main`
branch, e.g. `modules/signals/src/signal-store.ts`. Doc pages are cited by their ngrx.io
URL and, in parentheses, the markdown source path in the same repo (docs are generated
from `projects/www/src/app/pages/**`).

---

## 1. Custom store features

**`signalStoreFeature`** is a first-class, documented API for packaging reusable
store behavior. Its stated purpose, verbatim from the guide:

> "Custom SignalStore features provide a robust mechanism for extending core
> functionality and encapsulating common patterns, facilitating reuse across multiple
> stores."
— [Custom Store Features](https://ngrx.io/guide/signals/signal-store/custom-store-features) (`projects/www/src/app/pages/guide/signals/signal-store/custom-store-features.md`, lines 1–7)

**Signature and generic constraints.** From source
(`modules/signals/src/signal-store-feature.ts`, lines 14–23, overloads continue up to 8
features):

```ts
export function signalStoreFeature<F1 extends SignalStoreFeatureResult>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): SignalStoreFeature<EmptyFeatureResult, F1>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): SignalStoreFeature<EmptyFeatureResult, PrettifyFeatureResult<F1 & F2>>;
```

Each `Fn` type parameter is bounded by `SignalStoreFeatureResult` (the `{state, props,
methods}` shape every `withX` feature produces), and each subsequent feature's *input*
type is threaded as the accumulated intersection of everything before it (`F1 & F2`,
`F1 & F2 & F3`, …). This is how `signalStoreFeature` lets one custom feature build on
state/props/methods a prior feature in the same composition chain already added — the
compiler enforces the ordering.

**Declaring required input** (the mechanism for "this feature needs X to already exist
on the store"). The `type<T>()` helper marks an expected — but not locally defined —
shape:

```ts
export function withSelectedEntity<Entity>() {
  return signalStoreFeature(
    { state: type<EntityState<Entity>>() },
    withState<SelectedEntityState>({ selectedEntityId: null }),
    withComputed(({ entityMap, selectedEntityId }) => ({
      selectedEntity: computed(() => {
        const selectedId = selectedEntityId();
        return selectedId ? entityMap()[selectedId] : null;
      }),
    }))
  );
}
```
— [Custom Store Features](https://ngrx.io/guide/signals/signal-store/custom-store-features), Example 3 ("Managing Selected Entity"), source md lines 193–247

If the consuming store doesn't already have `EntityState<Entity>` on it (e.g. via
`withEntities`), this is a **compile error**, not a runtime one — the doc calls this out
explicitly: "if `BooksStore` does not contain state properties from the `EntityState`
type, the compilation error will occur" (same page, lines 261–262). Required `props` and
`methods` can be declared the same way:

```ts
export function withBaz<Foo extends string | number>() {
  return signalStoreFeature(
    {
      props: type<{ foo: Signal<Foo> }>(),
      methods: type<{ bar(foo: number): void }>(),
    },
    withMethods((store) => ({ /* ... */ }))
  );
}
```
— same page, Example 4, lines 284–306

**Explicit team guidance in the same doc:** *"It's recommended to define
loosely-coupled/independent features whenever possible"* (line 189) — i.e. prefer
features with no required input over features that assume specific state exists.

**`SignalStoreFeatureType`** lets one custom feature's full result (state+props+methods)
be reused as another custom feature's required input type, so features can be chained by
type without hand-writing the intersection:

```ts
export type RequestStatusFeature = SignalStoreFeatureType<typeof withRequestStatus>;
// ...
export function withStatusMessage() {
  return signalStoreFeature(
    type<RequestStatusFeature>(),
    withComputed(({ isPending, error }) => ({ /* ... */ }))
  );
}
```
— same page, lines 310–352

**`withFeature`** is the alternative entry point for features that need a *runtime*
value from the store (not just a type constraint) — e.g. one signal from an already-
composed store passed into a feature factory:

```ts
export function withFeature<
  Input extends SignalStoreFeatureResult,
  Output extends SignalStoreFeatureResult,
>(
  featureFactory: (
    store: Prettify<StateSignals<Input['state']> & Input['props'] & Input['methods']
      & WritableStateSource<Input['state']>>
  ) => SignalStoreFeature<Input, Output>
): SignalStoreFeature<Input, Output>
```
— `modules/signals/src/with-feature.ts`, lines 33–45

Its own JSDoc usage example (lines 9–31) names its illustrative feature
`withEntityLoader((id) => store.loadById(id))` — i.e. the NgRx team's own doc-comment
example for `withFeature` is literally "load an entity by id, wired to a store method."
This is the closest thing to an explicit "load a collection" reusable-feature example
in the primary sources, though it is illustrative naming in a JSDoc comment, not a
shipped, real feature.

**Does NgRx ship a reusable "load a collection, cache it, patch entries on write"
feature?** No such feature exists in `@ngrx/signals` core. What *does* exist, and is
presented in the docs as the idiomatic composition style for this exact kind of
scenario, is:

- `withEntities` (from `@ngrx/signals/entities`) for the collection/cache state itself
  (see §2).
- A **documented, but not shipped**, `withRequestStatus` custom feature — written out in
  full in the Custom Store Features guide as "Example 1: Tracking Request Status" — that
  wraps a `requestStatus: 'idle' | 'pending' | 'fulfilled' | {error}` state slice plus
  `isPending`/`isFulfilled`/`error` computed signals, composed with `withEntities` in a
  `BooksStore` example:

```ts
export const BooksStore = signalStore(
  withEntities<Book>(),
  withRequestStatus(),
  withMethods((store, booksService = inject(BooksService)) => ({
    async loadAll() {
      patchState(store, setPending());
      const books = await booksService.getAll();
      patchState(store, setAllEntities(books), setFulfilled());
    },
  }))
);
```
— [Custom Store Features](https://ngrx.io/guide/signals/signal-store/custom-store-features), lines 73–101

This is presented as a *pattern to write yourself* (the guide literally teaches you to
author `withRequestStatus` as your own file), not as an importable NgRx package export.
Searching the full `ngrx/platform` repo tree confirms there is no `with-call-state.ts` or
`with-request-status.ts` under `modules/signals/**` — it lives only as doc prose. (A
community package, `@angular-architects/ngrx-toolkit`, does ship a `withCallState`
feature along these lines and is referenced from the NgRx FAQ as a third-party option for
Devtools integration — see [FAQ](https://ngrx.io/guide/signals/faq), item #1 — but it is
not authored or maintained by NgRx core.)

**State-updater convention worth citing:** the guide explicitly recommends defining the
state updaters (`setPending`, `setFulfilled`, `setError`) as *standalone functions*
outside the feature, not as store methods:

> "For a custom feature, it is recommended to define state updaters as standalone
> functions rather than feature methods. This approach enables tree-shaking, simplifies
> testing, and facilitates their use alongside other updaters in a single `patchState`
> call."
— same page, lines 67–71

**Second example in the same doc — `withLogger`** — shows the other common composition
shape: a feature with no state, just `withHooks` wired to `getState`/`effect`, proving
`signalStoreFeature` composition isn't only for entity/status-style state features.

**Known TypeScript pitfall documented by the team:** combining multiple *independent*
custom features that each declare static input (via `{ state: type<...>() }`) without any
generic parameter of their own can produce a spurious compile error; the documented fix
is to add an unused generic (`function withZ<_>() { ... }`) to each such feature — see
same page, "Known TypeScript Issues," lines 398–453.

---

## 2. withEntities vs hand-rolled state

**Source of truth:** [Entity Management](https://ngrx.io/guide/signals/signal-store/entity-management)
(`projects/www/src/app/pages/guide/signals/signal-store/entity-management.md`) and
`modules/signals/entities/src/with-entities.ts`.

**What `withEntities` adds**, per the doc (lines 29–35) and confirmed by source:

```ts
export function withEntities<Entity>(): SignalStoreFeature<
  EmptyFeatureResult,
  { state: EntityState<Entity>; props: EntityProps<Entity>; methods: {} }
>;
```
— `modules/signals/entities/src/with-entities.ts`, lines 19–26 (overloads also exist for
a named/collection variant, lines 27–47)

- `ids: Signal<EntityId[]>` — state slice, an array of IDs (`EntityId = string | number`)
- `entityMap: Signal<EntityMap<Entity>>` — state slice, a record keyed by ID
- `entities: Signal<Entity[]>` — **computed**, derived by mapping `ids` through
  `entityMap`:

```ts
withComputed((store: Record<string, Signal<unknown>>) => ({
  [entitiesKey]: computed(() => {
    const entityMap = store[entityMapKey]() as EntityMap<Entity>;
    const ids = store[idsKey]() as EntityId[];
    return ids.map((id) => entityMap[id]);
  }),
}))
```
— `with-entities.ts`, lines 76–83

So the underlying representation is a normalized **map + id-array pair** (Redux/NgRx
Entity–style normalization), not a plain array — the array (`entities`) is a derived
view recomputed from the map on read, not the source of truth.

**Why normalize instead of hand-rolling a flat array:** the doc doesn't give a prose
"why normalize" essay, but the entire updater API is built to make ID-keyed writes O(1)
and collision-safe — `addEntity`/`addEntities` explicitly "do not override" existing IDs
silently and "no error is thrown," `updateEntity`/`updateEntities` do partial/patch
updates by ID or predicate, and `upsertEntity`/`upsertEntities` merge rather than
replace. All of this is the tradeoff the built-in feature buys you versus writing
`array.findIndex` / `array.map` yourself for every mutation:

```ts
patchState(store, updateEntity({ id: 1, changes: { completed: true } }));
patchState(store, updateEntities({ predicate: ({ text }) => text.endsWith('✅'), changes: { text: '' } }));
patchState(store, upsertEntity(todo)); // merges partial changes into existing entity
```
— [Entity Management](https://ngrx.io/guide/signals/signal-store/entity-management), "Entity Updaters" section, lines 114–227

**Custom ID field.** If the entity's identifier isn't named `id`, a `SelectEntityId<T>`
function (or the `entityConfig()` helper, which also lets you set a `collection` name in
one typed object) must be supplied to every `add*`/`set*`/`update*` call — `remove*`
calls don't need it because removal only needs the raw ID value, not the whole entity
(same page, lines 260–313, 407–453).

**Named/multiple collections.** `withEntities({ entity: type<Book>(), collection:
'book' })` renames the generated properties (`bookIds`, `bookEntityMap`, `bookEntities`)
so `withEntities` can be called more than once in a single store for independent
collections. The doc's own recommendation on this, verbatim:

> "Although it is possible to manage multiple collections in one store, in most cases,
> it is recommended to have dedicated stores for each entity type."
— same page, "Named Entity Collections" callout, lines 377–405

**Private entity collections.** A collection name prefixed `_` (e.g. `_todo`) hides the
raw `_todoIds`/`_todoEntityMap`/`_todoEntities` signals from external consumers per the
signalStore private-member convention (see §4), while a `withComputed` can re-expose a
derived, read-only view (`todos: _todoEntities`) — same page, "Private Entity
Collections," lines 455–495.

**When the docs imply hand-rolling might still be reasonable:** the guide never states
"use a plain array when X" directly — no maintainer commentary on this exact tradeoff
turned up in the docs, source JSDoc, or the searched GitHub Discussions/Issues. The only
documented signal of scope is indirect: `withEntities` is presented, throughout the
guide, as the default tool for *any* ID-keyed collection (`TodosStore`, `BooksStore`),
with no caveat about collection size, mutation frequency, or simplicity as a reason to
avoid it. This is a gap in primary-source guidance — see "Answered vs. still open" below.

---

## 3. rxMethod vs plain async/await store methods for data-loading

**The docs draw the line explicitly**, in the main SignalStore guide, directly
contrasting a Promise-based method with an `rxMethod`-based one for the *same*
`BookSearchStore` example:

> "In addition to methods for updating state, the `withMethods` feature can also be used
> to create methods for performing side effects. Asynchronous side effects can be
> executed using Promise-based APIs, as demonstrated below."
— [SignalStore](https://ngrx.io/guide/signals/signal-store) (`projects/www/src/app/pages/guide/signals/signal-store/index.md`, lines 321–322), followed immediately by:

```ts
withMethods((store, booksService = inject(BooksService)) => ({
  async loadAll(): Promise<void> {
    patchState(store, { isLoading: true });
    const books = await booksService.getAll();
    patchState(store, { books, isLoading: false });
  },
}))
```

Then, under **"Reactive Store Methods"**, the doc's own transition sentence is the
closest thing to an explicit "when to reach for rxMethod" rule in the primary sources:

> "In more complex scenarios, opting for RxJS to handle asynchronous side effects is
> advisable. To create a reactive SignalStore method that harnesses RxJS APIs, use the
> `rxMethod` function from the `rxjs-interop` plugin."
— same page, lines 359–362

The accompanying example upgrades `loadAll` to `loadByQuery: rxMethod<string>(...)`
using `debounceTime`, `distinctUntilChanged`, and `switchMap` — i.e. the "more complex
scenario" that justifies `rxMethod` in the doc's own framing is specifically:
reactive/repeated triggering (the method fires again whenever an upstream
signal/observable emits, not just once per explicit call) plus the need for
RxJS flattening/cancellation operators to manage overlapping calls (race conditions).

**Source-level characterization of `rxMethod`.** From
`modules/signals/rxjs-interop/src/rx-method.ts`, lines 21–24:

> "Creates a reactive method for managing side effects by utilizing RxJS APIs. The
> method accepts an observable, a signal, a computation function, or a static value."

Its type signature confirms it is **not** promise-returning — it returns an
`RxMethod<Input>`, which is a callable that itself returns `RxMethodRef = { destroy: ()
=> void }` (lines 11–19), i.e. a handle for manual cancellation, not a value/result
handle. Calling it just pushes the input into an internal `Subject` (line 69,
`source$.next(input)`); there's no way to `await` a single invocation's result from the
`rxMethod` API itself. This is a structural fact from the source, not commentary — it
substantiates why `rxMethod` is generally described (in secondary write-ups) as
"fire-and-forget": the primary source's own type doesn't give you a completion signal
per call.

**Reactive triggering as the deciding use case**, per the same file's usage doc-comment
(lines 28–58): `loadTodos` is wired as `this.loadTodos(this.userId)` in the constructor
so the whole pipeline re-runs on every `userId` signal change — the doc frames rxMethod
around this "call once, react forever" wiring, versus a plain `async loadAll()` method
that only runs when explicitly invoked.

**Injection-context requirement** is called out as a hard constraint, from the guide:

> "By default, the `rxMethod` needs to be executed within an injection context. It's tied
> to its lifecycle and is automatically cleaned up when the injector is destroyed."
— [RxJS Integration](https://ngrx.io/guide/signals/rxjs-integration) (`.../rxjs-integration.md`, lines 156–157)

Calling a reactive method with a signal/observable outside an injection context (without
an explicit `injector` in the call-site config) is flagged in the doc as **deprecated,
to become a hard error in a future version** (same page, lines 300–304), and the source
already emits a `console.warn` for this in dev mode (`rx-method.ts`, lines 84–99).
Static-value calls are exempt from this constraint (source, `isStatic` check, lines 77–80
— a static input just does `source$.next(input)` and returns synchronously, no injector
involvement).

**`tapResponse` and background refresh / non-terminating streams.** The Operators guide
explains why `tapResponse` (not `catchError` directly) is the documented pairing for
`rxMethod` API calls:

> "An easy way to handle the response with an Observable in a safe way, without
> additional boilerplate is to use the `tapResponse` operator. It enforces that the
> error case is handled and that the effect would still be running should an error
> occur. It is essentially a simple wrapper around two operators: `tap` that handles
> success and error cases; `catchError(() => EMPTY)` that ensures that the effect
> continues to run after the error."
— [Operators](https://ngrx.io/guide/operators/operators) (`projects/www/src/app/pages/guide/operators/operators.md`, lines 61–66)

This is directly relevant to a stale-while-revalidate/background-refresh design: because
`tapResponse` swallows the error into `EMPTY` inside the inner pipe rather than letting it
propagate and complete the outer `rxMethod` subscription, a background refresh that fails
once does not kill the reactive method for subsequent calls — the same property the
"Handling API Calls" example in the RxJS Integration guide relies on (its `loadBookById`
example filters out ids already present in a local `bookMap` before refetching — `filter((id)
=> !!id && !this.bookMap()[id])`, [RxJS Integration], lines 181–193 — a "skip if already
cached" gate, though not a full stale-while-revalidate/silent-refresh implementation).

**No primary-source text was found that names "stale-while-revalidate" or describes a
load-once-then-silently-refresh caching pattern explicitly**, from either the docs, the
source JSDoc, or the searched maintainer GitHub Discussions. The closest adjacent
maintainer content found is from **Tim Deschryver** (NgRx core team member), but it is
about the classic `Store`/`Effects` API, not `signalStore`/`rxMethod`:

> "[Tim Deschryver] explains that NgRx enables a stale-while-revalidate approach: use the
> NgRx Global Store as a cache to display requested (cached) data instantly instead of
> waiting on a server response... if necessary, refetch the data in the background to
> refresh the cached data."
— [Making your application feel faster by prefetching data with NgRx](https://timdeschryver.dev/blog/making-your-application-feel-faster-by-prefetching-data-with-ngrx),
Tim Deschryver's personal blog (not ngrx.io) — cited here explicitly as maintainer
commentary *outside* the official docs, about the pre-signals NgRx Store, and it does not
mention `signalStore` or `rxMethod` at all. Treat as directionally relevant, not
authoritative for signalStore.

No Alex Okrushko talk/post specifically addressing "when NOT to reach for rxMethod" was
located via search in the time available (see "Answered vs. still open").

---

## 4. Exposing a signalStore behind narrow interfaces/InjectionTokens for cross-module boundaries

**Finding: this is standard Angular DI practice with no signalStore-specific
mechanism** — confirmed by both the source-level DI surface and an explicit maintainer
statement explaining why that surface is deliberately plain.

**What `signalStore(...)` actually returns**, from source
(`modules/signals/src/signal-store.ts`, lines 1–14):

```ts
type ProvidedInConfig = { providedIn?: 'root' | 'platform' };
type SignalStoreConfig = ProvidedInConfig & { protectedState?: boolean };

export function signalStore<F1 extends SignalStoreFeatureResult>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): Type<SignalStoreMembers<F1> & StateSource<Prettify<OmitPrivate<F1['state']>>>>;
```

`signalStore(...)` returns an Angular `Type<...>` — i.e. an ordinary injectable class —
and its only DI-related config option is `providedIn: 'root' | 'platform'`. There is no
`InjectionToken`, `useExisting`, multi-provider, or token-pair option anywhere in
`SignalStoreConfig` or the rest of `modules/signals/src/signal-store.ts`. Whatever
narrowing/boundary pattern is used, it has to be layered on with ordinary Angular DI
(abstract base class + `useExisting`, an `InjectionToken<T>` provided via `useFactory`
that calls `inject(ConcreteStore)`, a hand-written facade service, etc.) — none of that
is special-cased or assisted by the signalStore API itself.

**This was a deliberate design decision, not an oversight** — confirmed directly by
**Marko Stanimirović** (NgRx core team member, primary author of `@ngrx/signals`) in a
GitHub Discussion where a user asked for `signalStore` to return a `[provide, inject]`
token pair (à la `createInjectionToken` from the `ngxtension` library) instead of a
plain class:

> "The idea with `[provide, inject]` tuple is from initial SignalStore proposal... The
> injection token's limitation is that it cannot be provided via the `providers` array
> without `useFactory`. That's the reason why the `provide..` function is necessary for
> tokens. On the other hand, this is not needed for services (classes)... we started with
> this approach but changed it for two main reasons: Simplicity: There is no need for a
> different signature when SignalStore is provided at the root level. With `[provide,
> inject]` approach, the `provide` function is not needed for root-level stores. Testing:
> Service can be easily mocked."
— [ngrx/platform Discussion #4188, "The signalStore function could return two functions, one for provide and one for inject"](https://github.com/ngrx/platform/discussions/4188), comment by `markostanimirovic`

In other words: the NgRx team *considered* an `InjectionToken`-pair API for
`signalStore` early on (it was in the original SignalStore proposal) and explicitly
rejected it in favor of plain-class injection, for simplicity and testability reasons —
which is the strongest primary-source signal available that there is **no
signalStore-specific InjectionToken/narrowing convention** to adopt; whatever pattern is
used is generic Angular DI applied to a store that happens to be a class like any other
injectable.

**What the docs *do* offer for narrowing a store's surface is member-level, not
module/DI-level**: the `_`-prefix **private store members** convention (state slices,
props, and methods) hides members from *any* external consumer, inside the store's own
type — enforced by `OmitPrivate` in the `signalStore` return type
(`SignalStoreMembers<F1> = Prettify<OmitPrivate<...>>`, `signal-store.ts` lines 15–21) —
but this narrows what the *store instance itself* exposes to everyone, not what a
particular *consuming module* is allowed to see via a separate DI token or interface:

> "SignalStore allows defining private members that cannot be accessed from outside the
> store by using the `_` prefix. This includes root-level state slices, properties, and
> methods."
— [Private Store Members](https://ngrx.io/guide/signals/signal-store/private-store-members) (`.../private-store-members.md`, lines 3–4)

**A related, unresolved feature request** confirms the same gap from the demand side:
[Discussion #4590, "Enable Signal Store Injection at Module Level"](https://github.com/ngrx/platform/discussions/4590)
asks for guidance on providing/using a signalStore before component instantiation (e.g.
in a route guard); the only response (from `rainerhahnekamp`, an Angular GDE, not an NgRx
core team member) is to use ordinary `providedIn: 'root'` or register the store class in
an `NgModule`'s `providers` array — again, plain Angular DI, no signalStore-specific
answer.

**No maintainer content was found** (docs, source JSDoc, or searched GitHub
Discussions/Issues) that discusses `useExisting`, `InjectionToken`-based narrowing, or a
recommended facade pattern specifically *for* signalStore in a multi-library/Nx-style
monorepo boundary sense. A non-NgRx-team source (Manfred Steyer /
angulararchitects.io, "The NGRX Signal Store and Your Architecture") recommends a
"feature service" as an orchestrator layer above multiple stores, explicitly comparing
it to a facade — but that post does not address module-boundary DI narrowing either,
and its author is an independent Angular consultant, not an NgRx core team member; cited
here only to be transparent that it was checked and did not answer the question.

---

## Answered vs. still open

- **1. Custom store features** — Answered. `signalStoreFeature` and its generic-input
  mechanism (`type<T>()`, `SignalStoreFeatureType`, `withFeature`) are fully documented
  and are the team's endorsed composition style. No shipped "load + cache + patch"
  feature exists in `@ngrx/signals` core, but the docs literally teach you to hand-write
  one (`withRequestStatus`) composed with `withEntities`, and `withFeature`'s own JSDoc
  example is named `withEntityLoader` — the closest primary-source precedent for the
  shape being asked about.
- **2. withEntities vs hand-rolled state** — Partially answered. The mechanics, API
  surface, and normalized (map+ids) representation are fully documented from source and
  docs. No primary source states an explicit "use withEntities when X, hand-roll when Y"
  tradeoff rule — the docs simply default to `withEntities` for every entity-collection
  example with no caveats about scale or complexity. Treat "when to prefer hand-rolled"
  as open.
- **3. rxMethod vs async/await** — Answered for the core decision rule (docs explicitly
  say: Promise/async-await for straightforward one-shot side effects, `rxMethod` for
  "more complex scenarios" — reactive/repeated triggering, cancellation/race-condition
  operators). Not answered: no primary source (docs, source, or a located Alex Okrushko
  talk/post) explicitly discusses a stale-while-revalidate / silent-background-refresh
  pattern in signalStore terms. The nearest maintainer material (Tim Deschryver) is about
  the pre-signals Store/Effects API, not signalStore, and is flagged as such above.
- **4. Exposing signalStore behind narrow interfaces/InjectionTokens** — Answered
  clearly: **this is purely standard Angular DI practice, with no signalStore-specific
  wrinkle**, and Marko Stanimirović's Discussion #4188 comment confirms the team
  deliberately kept `signalStore`'s DI surface to a plain injectable class rather than an
  `InjectionToken`-pair API. The only signalStore-specific narrowing tool in the primary
  sources is the `_`-prefix private-members convention, which operates at the
  store-instance-member level, not the cross-module-DI level.
