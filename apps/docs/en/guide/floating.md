# Floating Positioning <span class="page-head__en">浮层视口避让</span> <span class="doc-tag">Guide</span>

Overlay components such as Tooltip / Popconfirm / Select share the framework-agnostic avoidance logic in @xui-design/shared/floating on both frameworks: auto-flip when the preferred placement lacks space (flip), clamping when the cross axis overflows the viewport (shift), and real-time recomputation on scroll and window resize, batched with rAF.

## How It Works

- **Flip Placement**: measures the available space on the preferred side and its opposite (e.g. `spaceAbove = trigger.top - viewport.top`); flips only when the preferred side does not fit and the opposite side has more room; if neither side fits, the preferred placement is kept to avoid jitter.
- **Shift Clamping**: after centering, the popper is clamped into the viewport safe area (`≥ 8px` by default), so cross-axis overflow keeps the safe gap instead of touching edges or getting clipped.
- **Real-Time Recompute on scroll / resize**: scroll events are observed on `window` in the capture phase (so scrolling of any ancestor container is received), and callbacks are batched via `requestAnimationFrame` to run at most once per frame.
- **Framework-Agnostic**: `resolveFloatingPosition` is a pure function that never reads the DOM or writes styles; DOM measurement and style application are bridged by the two framework adapters, with no duplicated logic.
- **SSR-Safe Fallback**: without `window`, `getViewport` returns a zero rect and `bindViewportUpdate` returns a no-op function — nothing throws.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Placement Flipping (flip)

Flips automatically when the preferred placement lacks space and the opposite side has more: placement="top" flips to bottom at the top of the viewport, and placement="bottom" flips to top at the bottom.

<GuideDemo guide="floating" demo-id="flip" />

### Three Components, One Avoidance Logic

Tooltip / Popconfirm / Select share the flip and clamp algorithms from @xui-design/shared/floating on both frameworks — implemented once.

<GuideDemo guide="floating" demo-id="multi" />

## API

The floating avoidance API lives in `@xui-design/shared/floating` (framework-agnostic pure logic), bridged by the Tooltip / Popconfirm / Select adapters on both frameworks — not exposed directly to applications.

### Imperative Methods

<GuideApi guide="floating" kind="methods" />

### Contract Types

**FloatingPlacement**

```ts
type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';
```

Union of the four placements, aligned with the placement contract in core.

**FloatingRect**

```ts
type FloatingRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};
```

A viewport-coordinate rect; accepts the result of getBoundingClientRect() directly.

**ResolveFloatingOptions**

```ts
type ResolveFloatingOptions = {
  placement: FloatingPlacement;
  gap?: number;        // Trigger/popper gap, default 8
  viewportPadding?: number; // Viewport edge safe area, default 8
};
```

Options for resolveFloatingPosition.

**FloatingPosition**

```ts
type FloatingPosition = {
  placement: FloatingPlacement; // Actual placement (possibly flipped)
  shift: number;                // Cross-axis shift (px)
};
```

The avoidance result: for top/bottom placements, shift is horizontal (positive moves right); for left/right placements, it is vertical (positive moves down).

## Notes

- Built on CSS wrapper positioning: the popper already follows its trigger in document flow via the CSS wrapper approach, and this module only outputs avoidance corrections; adapters must get the base positioning (centering + gap) right before applying shift.
- Flip without jitter: flips only when the preferred side lacks space and the opposite side has more; when neither side fits, the preferred placement is kept (with shift clamping as the fallback) instead of flipping back and forth near the boundary.
- Scroll must use capture: scroll events do not bubble, so scrolling of ancestor containers can only be observed on window in the capture phase; bindViewportUpdate already uses capture — do not switch adapters back to bubble listeners.
- Always unbind on unmount: the unbind function returned by bindViewportUpdate must be called in onBeforeUnmount / useEffect cleanup, otherwise listeners leak and callbacks reference unmounted DOM.
- overflow: hidden ancestors can still clip the popper: since bubbles use CSS wrapper positioning rather than a portal, avoid clipping ancestors at the layout level.
