---
title: DatePicker
---

# DatePicker <span class="page-head__en">日期选择</span> <span class="doc-tag">Form</span>

Click to open a month calendar and pick a single date; the value is always a YYYY-MM-DD string, with zero date dependencies.

## Features

- Controlled and uncontrolled modes; supports v-model:value on the Vue side
- Values are always 'YYYY-MM-DD' strings (serialization-friendly); invalid values fall back to null
- The calendar panel switches between previous / next month (scrolling across years automatically), with a full 42-cell week view
- The panel uses a draft + confirm / cancel mode: picking a date only updates the draft; the value is committed on confirm, while cancel or outside click discards the draft
- A clearable clear button and disabled state; the panel closes on confirm, cancel, or outside click

### When to Use

- Form scenarios that pick a specific day, such as birthdays, reservations, or date-range queries.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Controlled Selection

The YYYY-MM-DD string is maintained externally and can be cleared in one click.

<ComponentDemo slug="date-picker" demo-id="basic" />

### Default Value &amp; Disabled

defaultValue sets the initial date; the panel cannot be opened when disabled.

<ComponentDemo slug="date-picker" demo-id="state" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="date-picker" kind="props" />

### Events / Callbacks

<ComponentApi slug="date-picker" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="date-picker" kind="slots" />

## Notes

- The contract only accepts / emits 'YYYY-MM-DD' strings with no Date objects involved; invalid strings fall back to null.
- When the panel opens, the view jumps to the month of the selected date, or to the current month when nothing is selected.

## Accessibility

- Date buttons are keyboard-focusable and selectable; month switches and date cells carry readable text semantics.
