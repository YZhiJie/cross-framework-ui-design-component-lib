---
title: Badge
---

# Badge <span class="page-head__en">徽标数</span> <span class="doc-tag">Data Display</span>

Shows a message count or status dot as a corner badge; can wrap any content or be used standalone.

## Features

- Wrapper mode: the badge floats at the top-right corner of the content; renders standalone without children
- Shows `${max}+` when count exceeds max (max defaults to 99)
- dot renders a dot badge ignoring the numeric value; showZero controls whether a count of 0 is shown

### When to Use

- Unread message / notification counts, status dots for new content, and more.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Count &amp; Max

count changes dynamically and collapses to 99+ once it exceeds max.

<ComponentDemo slug="badge" demo-id="basic" />

### Dot / Zero / Standalone

dot only hints that there are updates; showZero decides whether 0 is shown; renders standalone without wrapped content.

<ComponentDemo slug="badge" demo-id="variants" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="badge" kind="props" />

### Slots / Render Callbacks

<ComponentApi slug="badge" kind="slots" />

## Notes

- A purely presentational component with no events; the badge takes up no space when count is 0 and showZero is off.

## Accessibility

- Numeric badges expose the count as readable text; dot mode acts as a status hint, and decorative content is hidden from screen readers.
