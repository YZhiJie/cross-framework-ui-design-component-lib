---
title: Waterfall
---

# Waterfall <span class="page-head__en">瀑布流</span> <span class="doc-tag">Data Display</span>

Multi-column waterfall layout with shortest-column greedy assignment: responsive breakpoints auto-switch columns, auto-reflow after image/content load, height cache avoids re-measurement and reuses cached heights when column count changes.

## Features

- Shortest-column greedy assignment with round-robin tie-break for even initial distribution
- Responsive breakpoints auto-switch column count as the container resizes
- Height cache persists across column-count changes; no re-measurement when switching 4→2 columns
- ResizeObserver triggers reflow automatically when images or async content finish loading
- rAF scheduling: multiple changes in one frame coalesce into a single layout pass
- CSS variable gutter override (--xui-waterfall-gutter)

### When to Use

- Image galleries and product card lists with mixed heights
- Search result pages: auto-aligns by shortest column for visual tightness
- Responsive dashboards: resizing the window auto-adjusts columns

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic Usage

Fixed 3 columns with 16px gutter; uneven-height data demonstrates shortest-column greedy assignment; itemClick fires on click.

<ComponentDemo slug="waterfall" demo-id="basic" />

### Responsive Breakpoints

With breakpoints configured, column count auto-switchs on container resize (&lt;600px 1 col / 600-1000px 2 cols / &gt;1000px 3 cols) with zero-cost height cache reuse.

<ComponentDemo slug="waterfall" demo-id="responsive" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="waterfall" kind="props" />

### Events / Callbacks

<ComponentApi slug="waterfall" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="waterfall" kind="slots" />

### Contract Types

**WaterfallItem**

```ts
type WaterfallItem = Record<string, unknown>;
```

Waterfall item shape

**WaterfallBreakpoint**

```ts
type WaterfallBreakpoint = {
  minWidth: number;  // 视口最小宽度（px）
  columns: number;   // 该宽度下的列数
};
```

Responsive breakpoint

**WaterfallLayoutPayload**

```ts
type WaterfallLayoutPayload = {
  columnCount: number;   // 当前列数
  columnHeights: number[];  // 每列累计高度（px）
};
```

Layout change payload

## Notes

- Height cache (Map&lt;key, number&gt;) lives in the logic layer, reused directly on column change — zero DOM re-measurement.
- A global ResizeObserver watches item heights; image onLoad auto-triggers updateItemHeight → reflow.
- In jsdom or old environments without ResizeObserver, degrades to a one-shot synchronous measure; core layout logic is unaffected.
- Without renderItem/#item, xui-waterfall__item-placeholder is rendered; consumers should always provide real content.

## Accessibility

- Root is a semantic container; item clicks use native div onClick. For button-level accessibility, wrap your slot content in a button.
