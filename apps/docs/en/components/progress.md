---
title: Progress
---

# Progress <span class="page-head__en">进度条</span> <span class="doc-tag">Data Display</span>

Displays task progress as a percentage, in linear or circular form, with success / error status colors.

## Features

- type supports 'line' (linear) and 'circle' (circular, SVG stroke)
- percent is clamped to [0, 100] automatically; non-numeric input is treated as 0
- status supports normal / success / error; success is derived automatically when percent reaches 100 and no status is set explicitly
- strokeWidth customizes the bar / stroke width; showText toggles the percentage text

### When to Use

- File upload / download, task processing progress, loading completion display, and more.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Line &amp; Circle

One percentage drives both the line and circle forms; buttons simulate progress changes.

<ComponentDemo slug="progress" demo-id="basic" />

### Success &amp; Error States

100% derives success by default; an explicit status="error" shows the error color.

<ComponentDemo slug="progress" demo-id="status" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="progress" kind="props" />

### Contract Types

**ProgressStatus**

```ts
type ProgressType = 'line' | 'circle'
type ProgressStatus = 'normal' | 'success' | 'error'
```

Enums of the progress form and status.

## Notes

- A purely presentational component with no events; at 100% the color switches to the success color unless status is passed explicitly.

## Accessibility

- The root element carries progress semantics (role="progressbar" with aria-valuenow / min / max).
