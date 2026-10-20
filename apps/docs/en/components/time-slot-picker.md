---
title: TimeSlotPicker
---

# TimeSlotPicker <span class="page-head__en">投放时段</span> <span class="doc-tag">Form</span>

Heatmap-style time slot selector supporting day/week/month/year granularities with click toggle and rectangular drag selection.

## Features

- Four granularities: day (hours), week (week × hours), month (calendar), year (full-year heatmap)
- Two selection modes: click to toggle single, or drag to select/deselect a rectangular region (anchor and current cell form the rectangle, committed on mouseup)
- Controlled and uncontrolled modes; supports v-model for Vue and value + onChange for React
- referenceDate determines the month/year view, defaults to the current date
- Optional footer with stats and legend showing selected/total slots
- Imperative API for external control: clear / selectAll / toggle

### When to Use

- Ad delivery scheduling, appointment time selection, shift scheduling
- Checkbox selection on heatmap-style date/time grids

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic Usage

Switch between four granularities. Click to toggle a slot, or drag a rectangle to select/deselect a region. Two-way binding with v-model.

<ComponentDemo slug="time-slot-picker" demo-id="basic" />

### Imperative API

Call selectAll to select the entire current month and clear to unselect all via ref.

<ComponentDemo slug="time-slot-picker" demo-id="actions" />

### Rectangular Selection

In the month view, hold and drag: the anchor and current cell form a translucent preview rectangle, committed on mouseup. Dragging from a selected cell deselects the rectangle.

<ComponentDemo slug="time-slot-picker" demo-id="rectangle" />

### Uncontrolled Usage

Set the initial value with defaultValue; the component owns the state and emits change / onChange. showFooter=false hides the footer stats.

<ComponentDemo slug="time-slot-picker" demo-id="uncontrolled" />

### Disabled &amp; Custom Style

disabled blocks all interactions. Pass component-level CSS variables via style to adjust cell size, gap and theme color for this instance only.

<ComponentDemo slug="time-slot-picker" demo-id="custom" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="time-slot-picker" kind="props" />

### Events / Callbacks

<ComponentApi slug="time-slot-picker" kind="events" />

### Imperative Methods

<ComponentApi slug="time-slot-picker" kind="methods" />

## Notes

- Key format: day → `h:HH`; week → `w:W:HH`; month/year → `YYYY-MM-DD` (weekday 1-7, 1 = Monday).
- Rectangular selection: the pressed cell is the anchor and, together with the hovered cell, defines a rectangle. Cells preview translucently while dragging and commit on mouseup. An unselected anchor selects the whole rectangle; a selected anchor deselects it.
- Year view uses a column layout starting on Monday (first row Monday, last row Sunday). The column headers mark the column containing the first day of each month.

## Accessibility

- Root uses role=group with an aria-label; each cell is a button with aria-pressed indicating selected state; keyboard focus navigation supported.
