---
title: TimePicker
---

# TimePicker <span class="page-head__en">时间选择</span> <span class="doc-tag">Form</span>

Pick a time from hour / minute / second columns; the value is a HH:mm:ss string with configurable steps and format.

## Features

- Controlled and uncontrolled modes; the value is a HH:mm:ss string; supports v-model:value on Vue
- format supports HH:mm:ss (default) and HH:mm (second column hidden)
- hourStep / minuteStep / secondStep customize each column step
- clearable shows a clear button when a value is selected; disabled disables the picker

### When to Use

- Form fields requiring precise hour / minute / second selection, such as appointments.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic

Default HH:mm:ss format with three scrollable columns; supports clearable.

<ComponentDemo slug="time-picker" demo-id="basic" />

### Format &amp; Steps

format="HH:mm" shows hours &amp; minutes only; hourStep=2, minuteStep=10.

<ComponentDemo slug="time-picker" demo-id="state" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="time-picker" kind="props" />

### Events / Callbacks

<ComponentApi slug="time-picker" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="time-picker" kind="slots" />

## Notes

- The value is always a HH:mm:ss string; when format is HH:mm, the seconds are fixed to 00.
- Selecting a time auto-closes the panel; clicking outside also closes it.

## Accessibility

- The trigger has role=combobox and the panel role=dialog; Enter/Space opens and Esc closes.
