# Plan: Fix — Exhibition Slug Route 500 Error

## Task Type

Bug Fix

---

## Bug Summary

**Reported behavior**: Navigating to `/exhibition/[slug]` (e.g. `/exhibition/typescript`) throws a 500 server error for all slugs except `javascript`.

**Expected behavior**: All five exhibition slug pages (`/exhibition/javascript`, `/exhibition/typescript`, `/exhibition/rust`, `/exhibition/python`, `/exhibition/go`) render without error, displaying the correct header metadata including the year range.

**Affected area**: `src/routes/exhibition/[slug]/+page.svelte`, `src/routes/exhibition/[slug]/+page.ts`, and four markdown content files (`typescript.md`, `rust.md`, `python.md`, `go.md`).

---

## Root Cause Hypothesis

Three independent bugs compound to produce the error. All three must be fixed together.

### Bug 1 — `undefined.split()` (Critical, causes 500)

**File**: `src/routes/exhibition/[slug]/+page.svelte`, line 10

```ts
let range = $derived(data.metadata.range.split('-'));
```

`data.metadata.range` is `undefined` for `typescript`, `rust`, `python`, and `go` because their markdown frontmatter has no `range` field. Calling `.split()` on `undefined` throws a `TypeError` at runtime → SvelteKit catches it as a 500 error.

**This is the direct cause of the crash.**

### Bug 2 — Wrong split character (Logic, causes incorrect display)

**File**: `src/routes/exhibition/[slug]/+page.svelte`, line 10  
**Also affects**: `javascript.md`, the only file with a `range` field

The `split` delimiter is a plain hyphen (`-`), but `javascript.md` uses an **en-dash** (`–`, U+2013):

```yaml
range: 1995–present
```

Even after fixing Bug 1, `split('-')` on this string returns `['1995–present']` (a single-element array), so `range[1]` is `undefined` and the second `<p>` renders nothing. The range display would be silently broken for every entry.

### Bug 3 — Loose metadata typing (Type-safety, allows bugs 1 & 2 to be invisible)

**File**: `src/routes/exhibition/[slug]/+page.ts`, line 9

```ts
metadata: post.metadata as Record<string, unknown>;
```

`Record<string, unknown>` means TypeScript does not know that `range` may or may not be present. TypeScript therefore raises no error on `data.metadata.range.split(...)`, even though `range` can be `undefined`. A proper interface would have caught this at compile time.

---

## Reproduction Steps

1. Start the dev server: `pnpm dev`
2. Navigate to `http://localhost:5173/exhibition/typescript` (or `rust`, `python`, `go`)
3. Observe: **500 Internal Server Error**
4. Navigate to `http://localhost:5173/exhibition/javascript`
5. Observe: Page loads, but the second year (`range[1]`) is empty — only `1995–present` is shown, not split into start/end values

---

## Fix Strategy

Four changes are required. They should be applied in the order below, since the type interface (Step 3) is referenced by both Step 1 and Step 2.

---

### Step 1: Add `range` to the four markdown files missing it

**Files to modify**:

- `src/content/typescript.md`
- `src/content/rust.md`
- `src/content/python.md`
- `src/content/go.md`

**What to do**: Insert a `range` field into each file's YAML frontmatter. Use the **en-dash** (`–`) as the separator — consistent with `javascript.md` — and place it directly after the `born` field for visual consistency.

**Exact changes:**

`typescript.md` — insert after line 4 (`born: 2012-10-01`):

```yaml
range: 2012–present
```

`rust.md` — insert after line 4 (`born: 2015-05-15`):

```yaml
range: 2015–present
```

`python.md` — insert after line 4 (`born: 1991-02-20`):

```yaml
range: 1991–present
```

`go.md` — insert after line 4 (`born: 2009-11-10`):

```yaml
range: 2009–present
```

**Rationale**: All five languages are currently `status: active`, so `YYYY–present` is factually correct. This eliminates the `undefined` root cause.

---

### Step 2: Define a typed `ExhibitionMeta` interface

**File to create**: `src/lib/modules/exhibition/types.ts`

**What to do**: Create a typed interface for the markdown frontmatter shape. This replaces the loose `Record<string, unknown>` cast and will cause TypeScript to surface any future missing-field bugs at compile time rather than at runtime.

```ts
export interface ExhibitionMeta {
	title: string;
	description: string;
	born: string;
	range: string;
	tags: string[];
	category: string;
	status: string;
	difficulty: string;
	creator: string;
	maintainer: string;
	contributors: string[];
	docs: { title: string; url: string }[];
	books: { title: string }[];
}
```

**Rationale**: Strict mode will now fail to compile if `range` is accessed without a null check when it is typed as `string | undefined`, or will guarantee `range` is always present (by keeping it as `string`) — enforced by adding the field to all markdown files in Step 1. This turns a runtime crash class into a compile-time error class, matching project conventions (no `any`, TypeScript strict mode).

**File naming**: `types.ts` in `kebab-case`, inside the existing `@modules/exhibition` directory — consistent with project structure.

---

### Step 3: Update `+page.ts` to use the new interface

**File to modify**: `src/routes/exhibition/[slug]/+page.ts`

**What to change:**

```ts
// Before
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../content/${params.slug}.md`);
		return {
			content: post.default,
			metadata: post.metadata as Record<string, unknown>
		};
	} catch {
		error(404, `Language "${params.slug}" not found`);
	}
};
```

```ts
// After
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { ExhibitionMeta } from '@modules/exhibition/types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../content/${params.slug}.md`);
		return {
			content: post.default,
			metadata: post.metadata as ExhibitionMeta
		};
	} catch {
		error(404, `Language "${params.slug}" not found`);
	}
};
```

**What changed**: Replace `Record<string, unknown>` with `ExhibitionMeta`. TypeScript now knows the exact shape of `metadata` and can validate field access in `+page.svelte`.

**Rationale**: Preserves the existing dynamic import pattern while adding type safety. No functional behavior change — purely a type improvement that protects the calling code.

---

### Step 4: Fix `+page.svelte` — split delimiter and null safety

**File to modify**: `src/routes/exhibition/[slug]/+page.svelte`

**What to change** (script block):

```ts
// Before
let { data }: PageProps = $props();

let Post = $derived(data.content);
let meta = $derived(data.metadata);
let range = $derived(data.metadata.range.split('-'));
```

```ts
// After
let { data }: PageProps = $props();

let Post = $derived(data.content);
let meta = $derived(data.metadata);
let range = $derived(data.metadata.range?.split('–') ?? []);
```

**Two changes on the `range` line:**

1. **`split('-')` → `split('–')`** — Use the **en-dash** (U+2013) to match the actual delimiter used in all markdown `range` values. Without this, `'1995–present'.split('-')` returns `['1995–present']` — a one-element array — and `range[1]` silently renders nothing.

2. **`data.metadata.range?.split(...)` with `?? []`** — Optional chaining and null-coalescing guard. If `range` is somehow absent (e.g. a future content file authored without it), the expression evaluates to `[]` instead of throwing. This is a defensive fallback; after Step 1, all current files will have `range`. The `??` returns `[]` (not `['']`) so that partial renders don't show empty `<p>` tags.

**Note on the template**: `range[0]` and `range[1]` in the markup remain unchanged. After splitting `'1995–present'` on the en-dash, `range[0]` = `'1995'` and `range[1]` = `'present'`. The existing markup is correct — only the script is broken.

**Note on `Author` component**: `author.svelte` also uses `Record<string, unknown>` as its `meta` prop type. This is acceptable in its current form because it only accesses `creator`, `maintainer`, `difficulty`, and `status` — all guaranteed present in every markdown file. No change required there, but it should be updated in a follow-up if the prop type is tightened further.

---

## Side Effects & Risks

| Risk                                                                                                                              | Impact | Mitigation                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| En-dash character is invisible in editors — easy to accidentally replace with a hyphen during editing                             | Medium | Document the convention in this plan and rely on the TypeScript type (`ExhibitionMeta.range: string`) to catch breakage at compile time |
| Adding `range` to frontmatter changes the `post.metadata` object shape — any other consumer of the layout data could be affected  | Low    | The layout `+layout.ts` does not read `range`; the exhibition listing page does not display it. No other consumer identified.           |
| `range: 2012–present` for TypeScript is accurate today, but `status: active` would need updating if a language is ever deprecated | Low    | Out of scope — future content maintenance concern, not a code issue                                                                     |
| New file `src/lib/modules/exhibition/types.ts` adds a dependency that must be maintained in sync with markdown frontmatter        | Low    | The interface is intentionally flat and stable; add new fields with optional `?` to avoid breaking changes                              |

---

## Rollback Plan

All changes are isolated to frontmatter additions (additive — no existing YAML keys are touched) and a one-line fix in `+page.svelte`. To revert:

1. Remove the `range:` lines from the four `.md` files
2. Revert the `range` line in `+page.svelte` to `data.metadata.range.split('-')`
3. Delete `src/lib/modules/exhibition/types.ts`
4. Revert `+page.ts` to `Record<string, unknown>`

The site returns to its current broken state. Git diff is small and reviewable.

---

## Regression Test Strategy

- **Manual verification** (primary): After all fixes, navigate to all five slug pages and confirm:
  - `/exhibition/javascript` — `range[0]` = `1995`, `range[1]` = `present`
  - `/exhibition/typescript` — `range[0]` = `2012`, `range[1]` = `present`
  - `/exhibition/rust` — `range[0]` = `2015`, `range[1]` = `present`
  - `/exhibition/python` — `range[0]` = `1991`, `range[1]` = `present`
  - `/exhibition/go` — `range[0]` = `2009`, `range[1]` = `present`
- **TypeScript check**: Run `pnpm check` — zero new errors expected
- **Lint check**: Run `pnpm lint` — confirm no new warnings
- **No-content guard**: Verify that a nonexistent slug (e.g. `/exhibition/cobol`) still returns a clean 404, not a 500 — the existing `catch` block in `+page.ts` handles this

---

## Implementation Order

```
Step 1  →  Step 2  →  Step 3  →  Step 4
  (md)       (types)     (.ts)      (.svelte)
```

Steps 1 and 2 are independent and can be done in parallel. Step 3 depends on Step 2 (imports the new type). Step 4 has no hard dependency but should be done last to verify the full fix end-to-end.

---

## Success Criteria

- [ ] All five `/exhibition/[slug]` routes return HTTP 200 with no console errors
- [ ] `range[0]` and `range[1]` render the correct start year and `present` for every slug
- [ ] `pnpm check` passes with zero TypeScript errors
- [ ] `pnpm lint` passes with zero new warnings
- [ ] `/exhibition/cobol` (invalid slug) still returns a 404, not a 500
- [ ] No changes outside the four files listed and the one new file
- [ ] All existing tests pass (if a test suite exists)
