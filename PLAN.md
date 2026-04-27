# Plan: Fix & Complete Fake Scroll Implementation

## Task Type

Bug Fix + Feature Implementation

## Bug Summary

**Reported behavior**: The "fake scroll" on the exhibition page does not function — panels never translate, wheel events are not captured correctly, and several CSS/JS bugs prevent the scroll simulation from working at all.  
**Expected behavior**: User wheel gestures drive a smooth, lerp-animated `translateY` transform on the panel section, producing a fluid custom-scroll feel with no visible browser scrollbar.  
**Affected area**: `src/routes/exhibition/+page.svelte`

---

## Root Cause Hypotheses

1. **Most likely — Wrong event binding**: `onscroll` is used instead of `onwheel`, so `deltaY` is never read and `e.preventDefault()` is called on the wrong event. Additionally, Svelte's inline event syntax cannot set `{ passive: false }`, which browsers require before `preventDefault()` is honoured on wheel events.
2. **Most likely — Missing scroll state & transform**: No `scrollY`/`targetY` state exists, and no `transform: translateY()` is ever applied to the section. The bindings (`sectionEl`, `panels`) are declared but entirely unused beyond the `$inspect` call.
3. **Likely — CSS typo kills section height**: `var(--item)` (missing `s`) resolves to nothing, so the section height is `calc(100vh * )` — invalid CSS, collapsing the section.
4. **Likely — Missing unit on scroll-content height**: `style:height={sectionEl?.clientHeight}` emits `height: 800` (no `px`), making the proxy div height invalid.
5. **Minor — Dead CSS rule**: Duplicate `height` property; first `height: 100%` is overwritten immediately.
6. **Minor — Debug artefact**: `background: red` on `.custom-scrollbar` leaks into production.
7. **Minor — Unused `onMount` import**: Imported but never called, causing a lint warning.
8. **Minor — Z-index stacking missing**: `.custom-scrollbar` has no `z-index` and will be occluded by the section (`z-index: 2`), preventing wheel event capture.

---

## Reproduction Steps

1. Navigate to `/exhibition`
2. Attempt to scroll with the mouse wheel
3. Observe: panels do not move, console shows no meaningful output, section may be zero-height

---

## Goals

- [ ] **Goal 1** — All listed bugs are eliminated; no runtime errors or console warnings related to fake-scroll
- [ ] **Goal 2** — Wheel events are captured with `{ passive: false }` and `preventDefault()` works correctly
- [ ] **Goal 3** — `targetY` accumulates `deltaY` clamped to `[0, (N-1) * 100vh]`
- [ ] **Goal 4** — A `requestAnimationFrame` loop lerps `currentY` toward `targetY` and applies `transform: translateY(-currentY)` to the section each frame
- [ ] **Goal 5** — All resources (event listener, RAF loop) are cleaned up on component unmount
- [ ] **Goal 6** — CSS is clean: no debug colours, no typos, correct design-token usage, no duplicate rules

---

## Assumptions

- `data.languages` is a non-empty array; its `.length` is the panel count `N`. [UNKNOWN — confirm type shape if `data.languages` could be undefined/null]
- The parent layout (`+layout.svelte`) already sets `overflow: hidden` on the page container, so the browser never actually scrolls — the proxy div only needs to capture wheel events, not provide a real scroll track.
- Each panel should be exactly `100vh` tall; the total scrollable range is `(N - 1) * window.innerHeight` (zero-indexed, so at `maxScroll` the last panel is fully visible).
- `ExhibitionContent` has no internal scroll containers that would conflict with the wheel listener.
- The lerp factor (smoothing coefficient) will be `0.1` — a good default for silky feel. This can be extracted to a constant.
- No touch/trackpad momentum handling is required in this phase beyond raw `deltaY` accumulation. [UNKNOWN — confirm if touch events are needed]
- All changes stay within `src/routes/exhibition/+page.svelte` unless a helper module is explicitly warranted.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Event capture | `addEventListener('wheel', handler, { passive: false })` in `onMount` | Svelte's inline `onwheel` cannot set `passive: false`; manual listener is required for `preventDefault()` to work |
| Scroll state | `$state` runes (`targetY`, `currentY`) | Consistent with project Svelte 5 conventions |
| Animation loop | `requestAnimationFrame` with lerp | Smooth deceleration without a dependency; cancel on unmount |
| Section positioning | `position: fixed; top: 0; left: 0` | Keeps section out of document flow inside the overflow-hidden container; panels remain visible at full viewport height |
| Proxy div purpose | Captures wheel events only; visually invisible (`opacity: 0; pointer-events: all`) | Section gets `pointer-events: none` so clicks/wheel pass through to proxy |
| Lerp coefficient | `0.1` constant | Standard smooth-scroll feel; easy to tune |
| Max scroll | `(N - 1) * window.innerHeight` | Derived once in `onMount` after mount; recalculated on `resize` [UNKNOWN — resize handler not planned unless confirmed needed] |

---

## Implementation Steps

### Phase 1: Clean Up Dead Code & Fix CSS Bugs (Estimated: simple)

**Goal link**: Goal 1, Goal 6  
**Files touched**: `src/routes/exhibition/+page.svelte`  
**Depends on**: Nothing

1. **Remove `background: red`** from `.custom-scrollbar` style rule — debug leftover.
2. **Fix CSS typo**: change `var(--item)` → `var(--items)` in the section `height` rule.
3. **Remove duplicate `height: 100%`** rule from `section` — the `calc(100vh * var(--items))` rule is the intended one; the preceding `height: 100%` is dead.
4. **Fix `style:height` unit**: change `style:height={sectionEl?.clientHeight}` → `style:height="{(data.languages.length) * 100}vh"` (or compute in script). This removes the dependency on `sectionEl?.clientHeight` for the proxy height, making it declarative and correct from first render.
5. **Remove unused `$inspect` call** (`$inspect('element', sectionEl?.clientHeight)`) — unnecessary in production.

---

### Phase 2: Introduce Scroll State Variables (Estimated: simple)

**Goal link**: Goal 2, Goal 3  
**Files touched**: `src/routes/exhibition/+page.svelte`  
**Depends on**: Nothing (parallel with Phase 1)

1. **Declare scroll state** in `<script>`:
   ```typescript
   let targetY = $state(0);
   let currentY = $state(0);
   let rafId: number | undefined = $state();
   ```
2. **Derive `maxScroll`** — computed once on mount as `(data.languages.length - 1) * window.innerHeight`. Store in a `let` (not `$state` — it's set once and never reactively needed).
3. **Remove `panels` binding** — `panels` array (`bind:this={panels[i]}`) is not needed for the translateY approach. Remove the `$state([])` declaration and the `bind:this` on each panel div. *(Keep `sectionEl` binding — it is needed to apply the transform.)*

---

### Phase 3: Attach Wheel Listener with `{ passive: false }` (Estimated: moderate)

**Goal link**: Goal 2, Goal 3, Goal 5  
**Files touched**: `src/routes/exhibition/+page.svelte`  
**Depends on**: Phase 2

1. **Replace unused `onMount` body** with the actual mount logic:
   ```typescript
   onMount(() => {
     const proxyEl = document.querySelector('.scroll-proxy') as HTMLElement;
     // or bind the proxy div with bind:this={proxyEl}
     
     maxScroll = (data.languages.length - 1) * window.innerHeight;

     function handleWheel(e: WheelEvent) {
       e.preventDefault();
       targetY = Math.min(Math.max(targetY + e.deltaY, 0), maxScroll);
     }

     proxyEl.addEventListener('wheel', handleWheel, { passive: false });

     return () => {
       proxyEl.removeEventListener('wheel', handleWheel);
     };
   });
   ```
2. **Bind the proxy div** with `bind:this={proxyEl}` instead of querying the DOM — more idiomatic Svelte. Declare `let proxyEl: HTMLElement | undefined = $state()` in script.
3. **Remove `onscroll={onScroll}`** from the template and delete the old `onScroll` arrow function — replaced by the manual listener.

---

### Phase 4: Implement RAF Lerp Animation Loop (Estimated: moderate)

**Goal link**: Goal 4, Goal 5  
**Files touched**: `src/routes/exhibition/+page.svelte`  
**Depends on**: Phase 2, Phase 3

1. **Define lerp constant** at module level:
   ```typescript
   const LERP = 0.1;
   ```
2. **Add RAF loop** inside `onMount`, started immediately after attaching the wheel listener:
   ```typescript
   function tick() {
     currentY += (targetY - currentY) * LERP;
     if (sectionEl) {
       sectionEl.style.transform = `translateY(${-currentY}px)`;
     }
     rafId = requestAnimationFrame(tick);
   }
   rafId = requestAnimationFrame(tick);
   ```
3. **Cancel RAF on unmount** — extend the `onMount` cleanup return:
   ```typescript
   return () => {
     proxyEl.removeEventListener('wheel', handleWheel);
     if (rafId !== undefined) cancelAnimationFrame(rafId);
   };
   ```
4. **Do not use `$state` for `currentY` updates inside the RAF loop** — since the transform is applied directly to the DOM node via `sectionEl.style.transform`, bypassing Svelte's reactivity for this hot path is intentional and performant. `currentY` can be a plain `let` (not `$state`) for the same reason. `targetY` likewise can be a plain `let` since it's only written from the wheel handler and read in the RAF loop — no template binding needed.

   > **Revised state strategy**: Use plain `let` for `targetY`, `currentY`, `maxScroll`, and `rafId` since none of them need to drive reactive template updates. Only `sectionEl` and `proxyEl` remain as `$state` (for `bind:this`).

---

### Phase 5: Fix CSS Stacking & Section Positioning (Estimated: simple)

**Goal link**: Goal 1, Goal 6  
**Files touched**: `src/routes/exhibition/+page.svelte`  
**Depends on**: Phase 1

1. **Update `.scroll-proxy` (formerly `.custom-scrollbar`) styles**:
   - `position: fixed; top: 0; left: 0`
   - `width: 100%; height: 100vh` — the proxy only needs to cover the viewport to catch wheel events; its actual height as a scroll track is irrelevant because we're not using native scroll
   - `z-index: 100` — must be above the section
   - `opacity: 0` — visually invisible
   - `pointer-events: all` — explicitly captures wheel/pointer events
   - Remove `overflow-y: scroll` — not needed; we're using wheel events, not scroll events

2. **Update `section` styles**:
   - `position: fixed; top: 0; left: 0` — takes it out of flow; stays at viewport origin
   - `width: 100%; height: 100vh` — section window is one viewport tall
   - `overflow: hidden` — clips panels outside the viewport window
   - `will-change: transform` — hints GPU compositing for smooth animation
   - `pointer-events: none` — lets wheel events fall through to the proxy above
   - `z-index: 2` — keep existing (below proxy)
   - Remove `height: calc(100vh * var(--items))` from section — section is always `100vh` tall (it's the clipping window); panels stack inside it

3. **Stack panels inside section**:
   - Each `.panel` should be `height: 100vh` and laid out vertically (default block stacking)
   - The section clips at `100vh`, and `translateY` shifts the panel stack up/down
   - Add to `.panel`: `height: 100vh; width: 100%; flex-shrink: 0` (if using flex column on section)
   - Or keep default block flow — panels will naturally stack; translateY scrolls through them

4. **Rename class** from `.custom-scrollbar` → `.scroll-proxy` in both template and styles for semantic clarity.

---

### Phase 6: Update Template Markup (Estimated: simple)

**Goal link**: Goal 1, Goal 2  
**Files touched**: `src/routes/exhibition/+page.svelte`  
**Depends on**: Phase 3, Phase 5

1. **Update proxy div**:
   ```svelte
   <div class="scroll-proxy" bind:this={proxyEl}></div>
   ```
   - No child `scroll-content` div needed (proxy height is `100vh` by CSS; no scroll track)
   - No inline `style:height`

2. **Update section**:
   ```svelte
   <section bind:this={sectionEl} style:--items={data.languages.length}>
     {#each data.languages as language, i}
       <div class="panel">
         <ExhibitionContent {language} />
       </div>
     {/each}
   </section>
   ```
   - Remove `bind:this={panels[i]}` (panels array eliminated in Phase 2)
   - Keep `style:--items` for any CSS that still needs it (e.g., for panel sizing if desired)

---

## Final File Shape (Pseudocode)

```
<script lang="ts">
  // imports: ExhibitionContent, onMount
  // props: data
  // state: sectionEl (bind:this), proxyEl (bind:this)
  // plain lets: targetY=0, currentY=0, maxScroll=0, rafId, LERP=0.1

  onMount(() => {
    maxScroll = (data.languages.length - 1) * window.innerHeight;

    function handleWheel(e) {
      e.preventDefault();
      targetY = clamp(targetY + e.deltaY, 0, maxScroll);
    }

    function tick() {
      currentY += (targetY - currentY) * LERP;
      sectionEl.style.transform = `translateY(${-currentY}px)`;
      rafId = requestAnimationFrame(tick);
    }

    proxyEl.addEventListener('wheel', handleWheel, { passive: false });
    rafId = requestAnimationFrame(tick);

    return () => {
      proxyEl.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(rafId);
    };
  });
</script>

<div class="scroll-proxy" bind:this={proxyEl}></div>

<section bind:this={sectionEl} style:--items={data.languages.length}>
  {#each data.languages as language}
    <div class="panel">
      <ExhibitionContent {language} />
    </div>
  {/each}
</section>

<style>
  .scroll-proxy {
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100vh;
    z-index: 100;
    opacity: 0;
    pointer-events: all;
  }

  section {
    --items: 1;
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100vh;
    overflow: hidden;
    will-change: transform;
    pointer-events: none;
    z-index: 2;
  }

  .panel {
    height: 100vh;
    width: 100%;
  }
</style>
```

---

## Testing Strategy

- **Manual verification (primary)**:
  - Navigate to `/exhibition`
  - Scroll down with mouse wheel — panels should glide smoothly upward with deceleration
  - Scroll to bottom — last panel should stop exactly at the viewport; no over-scroll
  - Scroll back to top — first panel returns fully with no gap
  - Rapid scroll — `targetY` clamp prevents snapping past bounds
  - Verify no `background: red` visible
  - Verify browser scrollbar is hidden
  - Open DevTools Console — no errors, no passive listener warnings

- **Unit**: No unit tests needed for this single-component change; the logic is simple enough for manual verification.

- **Integration**: Verify `ExhibitionContent` renders correctly inside panels — no layout breakage from `pointer-events: none` on section (links/buttons inside panels will be unreachable if `pointer-events: none` is too broad — see Edge Cases).

---

## Edge Cases & Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `pointer-events: none` on section blocks interactive content inside panels | High — links, buttons unclickable | Set `pointer-events: none` only on the section wrapper; individual `.panel` children can have `pointer-events: auto` via CSS. Alternatively, route pointer events more carefully. [UNKNOWN — confirm if panels contain interactive elements] |
| `data.languages.length === 0` | Medium — `maxScroll` = `-1 * 100vh`; clamp would invert | Guard: `if (!data.languages.length) return;` early in `onMount` |
| `sectionEl` or `proxyEl` undefined at mount | Low — Svelte guarantees `bind:this` is populated before `onMount` runs | No mitigation needed, but add optional chaining (`sectionEl?.style`) as defensive measure |
| Trackpad inertia causing `targetY` to over-accumulate | Medium — feels like uncontrolled momentum | The lerp naturally smooths this; clamping `targetY` hard-limits the range. Consider capping single `deltaY` values > threshold if trackpad sends large deltas. [UNKNOWN — test on MacOS trackpad] |
| `window` not available during SSR | Low — SvelteKit may SSR the page; `window.innerHeight` in `onMount` is safe (client-only), but `maxScroll` init in module scope would fail | All `window` access is inside `onMount` — safe by design |
| Resize invalidates `maxScroll` | Low — rotating device or resizing browser makes scroll range wrong | Add `window.addEventListener('resize', () => { maxScroll = ... })` inside `onMount` cleanup. Not strictly required for desktop-only, but good practice. [UNKNOWN — target device set] |

---

## Rollback Plan

The changes are confined to a single file (`src/routes/exhibition/+page.svelte`). Reverting the git diff for that file fully restores the previous (broken) state. No database migrations, no shared module changes, no other files affected.

---

## Open Questions

- [ ] Do panels inside `ExhibitionContent` contain interactive elements (links, buttons)? If yes, the `pointer-events: none` strategy on the section must be refined to allow clicks through selectively.
- [ ] Is touch/trackpad swipe support required (beyond wheel events)? If yes, a `touchstart`/`touchmove` listener pair is needed alongside the wheel listener.
- [ ] Should the scroll snap to panel boundaries (i.e., magnetic snapping to nearest `100vh` stop), or free-scroll between panels?
- [ ] Is a `resize` event handler needed for dynamic `maxScroll` recalculation (responsive / device rotation)?
- [ ] Confirm `data.languages` type — can it be `undefined` or `null` on error states?

---

## Success Criteria

- [ ] Scrolling the mouse wheel on `/exhibition` translates panels smoothly via `transform: translateY()`
- [ ] `e.preventDefault()` is honoured — browser does not native-scroll the page
- [ ] Scroll is clamped: cannot scroll above first panel or below last panel
- [ ] Lerp produces smooth deceleration animation (no instant snap)
- [ ] RAF loop is cancelled on component unmount (no memory leak)
- [ ] No `background: red` visible in any state
- [ ] No duplicate CSS `height` rules
- [ ] `var(--items)` typo is corrected
- [ ] No TypeScript errors (`pnpm check` passes)
- [ ] No ESLint warnings (`pnpm lint` passes)
- [ ] No console errors or passive-listener warnings in DevTools
- [ ] All existing tests pass (if any exist for this route)
