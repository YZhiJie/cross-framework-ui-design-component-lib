---
title: Pagination
---

# Pagination <span class="page-head__en">分页</span> <span class="doc-tag">Navigation</span>

Data pagination navigation with 1-based page numbers, automatically computing the total page count and clamping out-of-range operations.

## Features

- Controlled value / uncontrolled defaultValue, 1-based page numbers, and v-model:value support on Vue
- total item count plus pageSize per-page count (default 10) automatically computes the total page count
- Prev / next become no-ops at boundaries; out-of-range page numbers are clamped automatically
- disabled turns off the whole paginator

### When to Use

- Browsing large datasets page by page, such as long lists, tables, or search results.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Controlled Pagination

285 items at 10 per page make 29 pages, with the current page synced externally.

<ComponentDemo slug="pagination" demo-id="basic" />

### Page Size &amp; Disabled

pageSize changes the paging granularity; all paging operations are inert while disabled.

<ComponentDemo slug="pagination" demo-id="variants" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="pagination" kind="props" />

### Events / Callbacks

<ComponentApi slug="pagination" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="pagination" kind="slots" />

## Notes

- When the current page exceeds the total page count (e.g., total shrinks), it is clamped to the valid range and one change is fired.
- The total page count is recomputed automatically when total changes, so no external page-count bookkeeping is needed.

## Accessibility

- The nav region has pagination semantics; page buttons are keyboard-focusable, the current page carries aria-current, and boundary buttons disable automatically.
