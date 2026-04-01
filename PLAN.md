# Plan: Migrate `tweak-pane` Module from Svelte Stores to Svelte 5 Runes

## Task Type

Refactor

## Motivation

The `tweak-pane` module currently uses `svelte/store` (`writable`, `get`, `.subscribe()`) which is the legacy Svelte 4 reactivity pattern. The project runs Svelte `^5.51.0` and the AGENTS.md guidelines mandate Svelte 5 runes syntax throughout. Migrating to `$state` runes in a `.svelte.ts` reactive module eliminates the `svelte/store` dependency, aligns with the project's conventions, and makes state access ergonomic (plain variable reads instead of `get(store)` or `$store` auto-subscriptions).

---

## Scope

**Files in scope:**

| File                                             | Change Type                                              |
| ------------------------------------------------ | -------------------------------------------------------- |
| `src/lib/modules/tweak-pane/tweak-pane-state.ts` | Full rewrite + rename to `.svelte.ts`                    |
| `src/lib/modules/tweak-pane/debug.svelte`        | Update imports + API usage                               |
| `src/lib/modules/tweak-pane/tweak-pane.svelte`   | Verify `bind:` props are compatible — minor or no change |

**Files explicitly out of scope:**

| File                                                     | Reason                                    |
| -------------------------------------------------------- | ----------------------------------------- |
| `src/lib/modules/tweak-pane/tweak-state.ts`              | No store usage; pure TypeScript utilities |
| `src/lib/modules/tweak-pane/debug-grid-overlay.svelte`   | Already fully Svelte 5 runes              |
| `src/lib/modules/tweak-pane/debug-layout-overlay.svelte` | Already fully Svelte 5 runes              |

**Estimated files touched:** 3 (1 rename + full rewrite, 2 updates)

---

## Goals

- [ ] **Goal 1** — Remove all `svelte/store` imports from `src/`, reaching zero store usage across the codebase
- [ ] **Goal 2** — Implement shared reactive state via a `$state`-based class singleton in a `.svelte.ts` module
- [ ] **Goal 3** — Update all consumers (`debug.svelte`, `tweak-pane.svelte`) to use the new singleton API without `$` auto-subscription syntax
- [ ] **Goal 4** — Preserve all existing behaviour: load from `localStorage`, persist on every state change, apply CSS variables to the document

---

## Assumptions

- `tweak-state.ts` exports `DEFAULT_TWEAK_STATE`, `applyTweakStateToDocument`, `loadTweakState`, `saveTweakState`, and the `TweakState` interface — these signatures are unchanged and stable.
- `tweak-pane.svelte` currently declares `showDebugGrid`, `showDebugLayout`, and `contentMaxWidth` as `$bindable()` props, meaning two-way binding from `debug.svelte` is already supported at the prop level.
- The `onMount` in `debug.svelte` is the appropriate place to call `tweakPaneStore.initialize()` since `$effect` inside the class's `initialize()` method requires an active Svelte component context to register correctly.
- `$effect` called inside a method invoked from `onMount` IS within component lifecycle context and will correctly track reactive dependencies.
- SvelteKit resolves `.svelte.ts` extensions — importing `./tweak-pane-state.svelte` (without explicit `.ts` extension) is the correct import path for the renamed file.
- [UNKNOWN] Whether `tweak-pane.svelte` also imports from `tweak-pane-state.ts` directly. The provided code shows it does NOT, but this should be verified before starting.
- [UNKNOWN] Whether any route-level files (e.g., `+layout.svelte`, `+page.svelte`) import from `tweak-pane-state.ts`. The prompt states only one file imports from `svelte/store`, but other non-store imports of the state module may exist.

---

## Architecture Decisions

| Decision                     | Choice                                               | Rationale                                                                                                                                                                       |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared state pattern         | Singleton class with `$state` fields                 | Idiomatic Svelte 5 pattern for cross-component shared mutable state in `.svelte.ts` modules; bare exported `$state` variables do not retain reactivity across module boundaries |
| File extension               | `.svelte.ts`                                         | Required by the Svelte compiler to process rune syntax (`$state`, `$effect`, `$derived`) outside `.svelte` files                                                                |
| `$effect` placement          | Inside `initialize()` called from `onMount`          | `$effect` requires an active Svelte component context; `onMount` satisfies this constraint                                                                                      |
| Export shape                 | `export const tweakPaneStore = new TweakPaneStore()` | Single singleton export; consumers destructure properties as needed                                                                                                             |
| Class method for persistence | `persistState()` as a private method on the class    | Keeps all state logic encapsulated; called inside `$effect` in `initialize()`                                                                                                   |

---

## Before / After

### Before

```
tweak-pane-state.ts
  ├── writable<boolean>(DEFAULT_TWEAK_STATE.showDebugGrid)  → exported store
  ├── writable<boolean>(DEFAULT_TWEAK_STATE.showDebugLayout) → exported store
  ├── writable<number>(DEFAULT_TWEAK_STATE.contentMaxWidth)  → exported store
  ├── getStateSnapshot() uses get(store)
  ├── applyState() uses store.set()
  ├── persistState() guards on isHydrated
  └── initializeTweakPaneState() sets up .subscribe() side effects

debug.svelte
  ├── imports { showDebugGrid, showDebugLayout, contentMaxWidth, initializeTweakPaneState }
  ├── uses $showDebugGrid, $showDebugLayout (auto-subscription $-prefix)
  └── bind:$showDebugGrid (invalid in Svelte 5; would need $: workarounds)
```

### After

```
tweak-pane-state.svelte.ts
  ├── class TweakPaneStore
  │     ├── showDebugGrid = $state<boolean>(...)
  │     ├── showDebugLayout = $state<boolean>(...)
  │     ├── contentMaxWidth = $state<number>(...)
  │     ├── private isHydrated = false
  │     ├── get snapshot(): TweakState   (computed getter, no $derived needed)
  │     ├── applyState(state): void      (direct assignments)
  │     ├── private persistState(): void (calls saveTweakState + applyTweakStateToDocument)
  │     └── initialize(): void           (loads localStorage, runs $effect for persistence)
  └── export const tweakPaneStore = new TweakPaneStore()

debug.svelte
  ├── imports { tweakPaneStore } from './tweak-pane-state.svelte'
  ├── calls tweakPaneStore.initialize() in onMount
  ├── passes tweakPaneStore.showDebugGrid (no $-prefix)
  └── bind:showDebugGrid={tweakPaneStore.showDebugGrid}

tweak-pane.svelte
  └── no import changes; bind: props API unchanged
```

---

## Implementation Steps

### Phase 1: Rename and Rewrite State Module (Estimated: moderate)

**Goal link:** Goals 1, 2, 4
**Files touched:** `src/lib/modules/tweak-pane/tweak-pane-state.ts` → `src/lib/modules/tweak-pane/tweak-pane-state.svelte.ts`
**Depends on:** Nothing

#### Step 1.1 — Delete `tweak-pane-state.ts` and create `tweak-pane-state.svelte.ts`

Rename the file by deleting the old `.ts` file and creating a new `.svelte.ts` file in the same directory. This triggers the Svelte compiler to process rune syntax.

> **Gotcha:** Do NOT simply rename the file extension in an editor if it does not also update Git's tracking. Use `git mv` to preserve history:
>
> ```bash
> git mv src/lib/modules/tweak-pane/tweak-pane-state.ts \
>         src/lib/modules/tweak-pane/tweak-pane-state.svelte.ts
> ```

#### Step 1.2 — Implement the `TweakPaneStore` class

Replace the entire file content with the class-based implementation below. Each change maps directly to the migration strategy:

| Old pattern                                            | New pattern                                                          |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `import { get, writable } from 'svelte/store'`         | Removed entirely                                                     |
| `writable<boolean>(DEFAULT_TWEAK_STATE.showDebugGrid)` | `showDebugGrid = $state<boolean>(DEFAULT_TWEAK_STATE.showDebugGrid)` |
| `get(showDebugGrid)`                                   | `this.showDebugGrid`                                                 |
| `showDebugGrid.set(value)`                             | `this.showDebugGrid = value`                                         |
| `.subscribe(() => { persistState(); })`                | `$effect(() => { this.persistState(); })` inside `initialize()`      |
| `export function initializeTweakPaneState()`           | `initialize()` method on the class                                   |
| Three named store exports                              | Single `tweakPaneStore` singleton export                             |

**Target implementation:**

```ts
// src/lib/modules/tweak-pane/tweak-pane-state.svelte.ts

import {
	DEFAULT_TWEAK_STATE,
	applyTweakStateToDocument,
	loadTweakState,
	saveTweakState,
	type TweakState
} from './tweak-state';

class TweakPaneStore {
	showDebugGrid = $state<boolean>(DEFAULT_TWEAK_STATE.showDebugGrid);
	showDebugLayout = $state<boolean>(DEFAULT_TWEAK_STATE.showDebugLayout);
	contentMaxWidth = $state<number>(DEFAULT_TWEAK_STATE.contentMaxWidth);

	private isHydrated = false;

	get snapshot(): TweakState {
		return {
			showDebugGrid: this.showDebugGrid,
			showDebugLayout: this.showDebugLayout,
			contentMaxWidth: this.contentMaxWidth
		};
	}

	applyState(state: TweakState): void {
		this.showDebugGrid = state.showDebugGrid;
		this.showDebugLayout = state.showDebugLayout;
		this.contentMaxWidth = state.contentMaxWidth;
	}

	private persistState(): void {
		if (!this.isHydrated) return;
		saveTweakState(this.snapshot);
		applyTweakStateToDocument(this.snapshot);
	}

	initialize(): void {
		if (typeof window === 'undefined') return;

		if (!this.isHydrated) {
			const loaded = loadTweakState();
			this.applyState(loaded);
			applyTweakStateToDocument(loaded);
			this.isHydrated = true;
		}

		$effect(() => {
			// Reading all three reactive fields inside $effect makes it
			// re-run whenever any of them changes.
			const _ = this.showDebugGrid;
			const __ = this.showDebugLayout;
			const ___ = this.contentMaxWidth;
			this.persistState();
		});
	}
}

export const tweakPaneStore = new TweakPaneStore();
```

> **Gotcha — `$effect` dependency tracking:** `$effect` only tracks reactive reads that happen synchronously inside its body. To ensure all three state fields are tracked, explicitly read each one inside the effect before calling `persistState()`. Alternatively, read `this.snapshot` (the getter) inside the effect body — since the getter reads all three fields, they are all tracked automatically:
>
> ```ts
> $effect(() => {
> 	const state = this.snapshot; // reads all three $state fields → all tracked
> 	saveTweakState(state);
> 	applyTweakStateToDocument(state);
> });
> ```
>
> This is cleaner and preferred. The `persistState()` private method can be inlined into the effect or kept separate for clarity — but the `isHydrated` guard is still needed to prevent persistence before the first `loadTweakState()` call completes.

> **Gotcha — `$effect` in `.svelte.ts` class method:** `$effect` called inside `initialize()` will work **only when `initialize()` is called from within a Svelte component's synchronous initialization or `onMount`**. If called outside any component context (e.g., at module top-level or in a Node.js server context), it will throw. The `typeof window === 'undefined'` guard prevents the SSR path from reaching `$effect`.

> **Gotcha — `isSynced` flag removal:** The original code used `isSynced` to prevent registering multiple `.subscribe()` callbacks. With `$effect`, each call to `initialize()` from a different component instance would register a new effect, causing duplicate persistence calls. Add a guard mirroring the `isSynced` pattern:
>
> ```ts
> private isEffectRegistered = false;
>
> initialize(): void {
>   if (typeof window === 'undefined') return;
>
>   if (!this.isHydrated) {
>     const loaded = loadTweakState();
>     this.applyState(loaded);
>     applyTweakStateToDocument(loaded);
>     this.isHydrated = true;
>   }
>
>   if (!this.isEffectRegistered) {
>     $effect(() => {
>       const state = this.snapshot;
>       saveTweakState(state);
>       applyTweakStateToDocument(state);
>     });
>     this.isEffectRegistered = true;
>   }
> }
> ```

---

### Phase 2: Update `debug.svelte` (Estimated: simple)

**Goal link:** Goals 3, 4
**Files touched:** `src/lib/modules/tweak-pane/debug.svelte`
**Depends on:** Phase 1

#### Step 2.1 — Update the import statement

```ts
// Before
import {
	contentMaxWidth,
	initializeTweakPaneState,
	showDebugGrid,
	showDebugLayout
} from './tweak-pane-state';

// After
import { tweakPaneStore } from './tweak-pane-state.svelte';
```

> **Note:** The import path is `./tweak-pane-state.svelte` — SvelteKit/Vite resolves `.svelte.ts` files when the import ends in `.svelte`. Do NOT write `./tweak-pane-state.svelte.ts` (TypeScript import convention omits `.ts`).

#### Step 2.2 — Update `onMount` callback

```ts
// Before
onMount(() => {
	initializeTweakPaneState();
});

// After
onMount(() => {
	tweakPaneStore.initialize();
});
```

#### Step 2.3 — Update template bindings

Remove all `$`-prefixed store auto-subscriptions and `bind:$` syntax:

```svelte
<!-- Before -->
<DebugGridOverlay visible={$showDebugGrid} />
<DebugLayoutOverlay visible={$showDebugLayout} ... />
<TweakPane bind:$showDebugGrid bind:$showDebugLayout bind:$contentMaxWidth />

<!-- After -->
<DebugGridOverlay visible={tweakPaneStore.showDebugGrid} />
<DebugLayoutOverlay visible={tweakPaneStore.showDebugLayout} ... />
<TweakPane
	bind:showDebugGrid={tweakPaneStore.showDebugGrid}
	bind:showDebugLayout={tweakPaneStore.showDebugLayout}
	bind:contentMaxWidth={tweakPaneStore.contentMaxWidth}
/>
```

> **Gotcha — `bind:` with class fields:** Svelte 5's `bind:` directive supports binding to object properties, including class instance fields backed by `$state`. The syntax `bind:showDebugGrid={tweakPaneStore.showDebugGrid}` correctly enables two-way binding because `$state` fields on class instances are reactive references. This works because the Svelte compiler rewrites the bind to use the property accessor on the object, not a local variable copy.

---

### Phase 3: Verify `tweak-pane.svelte` (Estimated: simple)

**Goal link:** Goal 3
**Files touched:** `src/lib/modules/tweak-pane/tweak-pane.svelte` (read-only verification, possibly no edits)
**Depends on:** Phase 2

#### Step 3.1 — Confirm existing `$bindable()` prop declarations

The file is stated to already use `$props()` and `$bindable()`. Verify that the prop names match exactly what `debug.svelte` now passes:

```ts
// Expected prop shape in tweak-pane.svelte
interface Props {
	showDebugGrid: boolean;
	showDebugLayout: boolean;
	contentMaxWidth: number;
}

let {
	showDebugGrid = $bindable(),
	showDebugLayout = $bindable(),
	contentMaxWidth = $bindable()
}: Props = $props();
```

If the prop names or types differ, update them to match the store field names and types (`boolean`, `boolean`, `number`).

#### Step 3.2 — Confirm no direct store imports exist

Search `tweak-pane.svelte` for any `import ... from 'svelte/store'` or `import ... from './tweak-pane-state'`. If found, update to use `tweakPaneStore` following the same pattern as Phase 2.

---

### Phase 4: Audit for Any Remaining Store Imports (Estimated: simple)

**Goal link:** Goal 1
**Files touched:** None (read-only scan)
**Depends on:** Phases 1–3

#### Step 4.1 — Search entire `src/` for `svelte/store` imports

Run a project-wide search for any remaining `svelte/store` usage:

```bash
grep -r "svelte/store" src/
```

Expected result: zero matches. If any remain, they are outside this migration's stated scope — log them as separate issues.

#### Step 4.2 — Search for old module path references

```bash
grep -r "tweak-pane-state'" src/
grep -r "tweak-pane-state\"" src/
```

Any file still importing from `./tweak-pane-state` (without `.svelte`) must be updated to `./tweak-pane-state.svelte`.

---

## Testing Strategy

- **Unit:** No dedicated unit test files are mentioned — [UNKNOWN] whether a test harness exists. If tests exist for `tweak-pane-state.ts`, they must be updated to import from `tweak-pane-state.svelte.ts` and use `tweakPaneStore.*` accessors instead of store subscriptions.
- **Integration:** Manually verify `localStorage` load/persist round-trip: set a value via the tweak pane UI, reload the page, confirm the value is restored.
- **Manual verification:**
  1. Open the app in dev mode (`pnpm dev`)
  2. Open the debug/tweak pane (dev mode only — `{#if dev}`)
  3. Toggle `showDebugGrid` — confirm the debug grid overlay appears/disappears
  4. Toggle `showDebugLayout` — confirm the layout overlay appears/disappears
  5. Change `contentMaxWidth` — confirm the document CSS variable updates
  6. Reload the page — confirm all three values are restored from `localStorage`
  7. Confirm no console errors related to `svelte/store` or rune context errors
- **Type check:** Run `pnpm check` — expect zero new TypeScript or Svelte type errors after migration.
- **Lint:** Run `pnpm lint` — expect zero new lint errors. `pnpm format` may adjust import ordering automatically.

---

## Breaking Changes

| Change                                                                   | Affected consumers                                                    | Migration path                              |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------- |
| `showDebugGrid` is no longer a Svelte store                              | Any future code using `$showDebugGrid` or `showDebugGrid.subscribe()` | Use `tweakPaneStore.showDebugGrid` directly |
| `showDebugLayout` is no longer a Svelte store                            | Same as above                                                         | Use `tweakPaneStore.showDebugLayout`        |
| `contentMaxWidth` is no longer a Svelte store                            | Same as above                                                         | Use `tweakPaneStore.contentMaxWidth`        |
| `initializeTweakPaneState()` removed                                     | `debug.svelte` only                                                   | Replace with `tweakPaneStore.initialize()`  |
| Module path changed from `tweak-pane-state` to `tweak-pane-state.svelte` | All importers                                                         | Update import strings                       |

---

## Edge Cases & Risks

| Risk                                                                                     | Impact                                                                                                                           | Mitigation                                                                                                          |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `$effect` called outside component context (SSR)                                         | High — throws runtime error                                                                                                      | `typeof window === 'undefined'` guard before calling `initialize()` prevents SSR path from reaching `$effect`       |
| Multiple components mounting and calling `initialize()`                                  | Medium — duplicate `$effect` registrations cause redundant localStorage writes                                                   | `isEffectRegistered` private flag prevents registering the effect more than once                                    |
| `$effect` body reads `this.snapshot` which is a getter, not a `$state`                   | Low — getter reads ARE tracked if they access `$state` fields                                                                    | The getter directly reads the three `$state` class fields, so all are tracked by the Svelte reactive system         |
| `bind:prop={object.field}` not supported in Svelte 5 for class instances                 | Medium — would break two-way binding from `debug.svelte` to `tweak-pane.svelte`                                                  | `$state` fields on class instances ARE reactive references; `bind:` works correctly. Verify in `pnpm check` output. |
| Import path `./tweak-pane-state.svelte` could be ambiguous with an actual `.svelte` file | Low — no `.svelte` file has that exact name                                                                                      | Ensure no file named `tweak-pane-state.svelte` (without `.ts`) exists in the same directory                         |
| `persistState` called on first `$effect` run before `isHydrated = true`                  | Low — `isHydrated` is set to `true` before `$effect` is registered; first effect run is after component mount, not synchronously | Guard order in `initialize()` ensures `isHydrated = true` before `$effect` runs                                     |

---

## Open Questions

- [ ] Does `tweak-pane.svelte` currently import anything from `tweak-pane-state.ts`? The provided code suggests not, but must be confirmed before Phase 3.
- [ ] Are there any other route-level or layout-level files that import named stores (`showDebugGrid`, etc.) from `tweak-pane-state.ts` beyond `debug.svelte`?
- [ ] Does the project have a test suite? If so, are there tests for `tweak-pane-state.ts` that need updating?
- [ ] Is `debug.svelte` the only component that calls `initializeTweakPaneState()`? If another component also calls it, Phase 2 must be applied there as well.

---

## File-by-File Change Summary

### `src/lib/modules/tweak-pane/tweak-pane-state.ts` → `tweak-pane-state.svelte.ts`

```
REMOVE: import { get, writable } from 'svelte/store'
REMOVE: export const showDebugGrid = writable<boolean>(...)
REMOVE: export const showDebugLayout = writable<boolean>(...)
REMOVE: export const contentMaxWidth = writable<number>(...)
REMOVE: let isHydrated = false
REMOVE: let isSynced = false
REMOVE: function getStateSnapshot(): TweakState { ... }
REMOVE: function applyState(state: TweakState): void { ... }
REMOVE: function persistState(): void { ... }
REMOVE: export function initializeTweakPaneState(): void { ... }

ADD: class TweakPaneStore { ... }
ADD:   showDebugGrid = $state<boolean>(DEFAULT_TWEAK_STATE.showDebugGrid)
ADD:   showDebugLayout = $state<boolean>(DEFAULT_TWEAK_STATE.showDebugLayout)
ADD:   contentMaxWidth = $state<number>(DEFAULT_TWEAK_STATE.contentMaxWidth)
ADD:   private isHydrated = false
ADD:   private isEffectRegistered = false
ADD:   get snapshot(): TweakState { ... }
ADD:   applyState(state: TweakState): void { ... }
ADD:   initialize(): void { ... with $effect inside ... }
ADD: export const tweakPaneStore = new TweakPaneStore()
```

### `src/lib/modules/tweak-pane/debug.svelte`

```
CHANGE: import { contentMaxWidth, initializeTweakPaneState, showDebugGrid, showDebugLayout }
        from './tweak-pane-state'
     →  import { tweakPaneStore } from './tweak-pane-state.svelte'

CHANGE: initializeTweakPaneState()  →  tweakPaneStore.initialize()

CHANGE: {$showDebugGrid}            →  {tweakPaneStore.showDebugGrid}
CHANGE: {$showDebugLayout}          →  {tweakPaneStore.showDebugLayout}
CHANGE: bind:$showDebugGrid         →  bind:showDebugGrid={tweakPaneStore.showDebugGrid}
CHANGE: bind:$showDebugLayout       →  bind:showDebugLayout={tweakPaneStore.showDebugLayout}
CHANGE: bind:$contentMaxWidth       →  bind:contentMaxWidth={tweakPaneStore.contentMaxWidth}
```

### `src/lib/modules/tweak-pane/tweak-pane.svelte`

```
VERIFY: No import from 'svelte/store' or './tweak-pane-state'
VERIFY: Props use $bindable() for showDebugGrid, showDebugLayout, contentMaxWidth
CHANGE (if needed): Prop names/types to match store field names exactly
```

---

## Success Criteria

- [ ] `grep -r "svelte/store" src/` returns zero matches
- [ ] `src/lib/modules/tweak-pane/tweak-pane-state.svelte.ts` exists; `tweak-pane-state.ts` does not
- [ ] `debug.svelte` imports `tweakPaneStore` from `./tweak-pane-state.svelte`; no `$`-prefixed store variables in template
- [ ] `tweak-pane.svelte` correctly receives `bind:` props from `debug.svelte` with no type errors
- [ ] `pnpm check` passes with zero new TypeScript or Svelte errors
- [ ] `pnpm lint` passes with zero new warnings or errors
- [ ] All existing behaviour preserved: state loads from `localStorage` on mount, persists on change, applies CSS variables to document
- [ ] No runtime console errors when opening the debug tweak pane in dev mode
- [ ] Page reload correctly restores all three persisted values
