---
title: InputNumber
---

# InputNumber <span class="page-head__en">数字输入框</span> <span class="doc-tag">Form</span>

Enter numbers via stepper buttons or direct typing, with automatic range clamping, step alignment, and precision handling.

## Features

- Controlled and uncontrolled modes; the value is number | null (null when cleared or invalid); supports v-model:value on the Vue side
- min / max boundary clamping and step increments (non-positive values fall back to 1); up / down steppers keep values aligned to step multiples
- precision decimal places (0-20), formatted uniformly on commit; invalid or out-of-range input automatically falls back or is clamped
- disabled state and placeholder text

### When to Use

- Scenarios requiring precise numeric input with stepper adjustment, such as quantities, amounts, and ratios.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Range / Step / Precision

Range 0-10, step 0.5, two decimal places; both stepping and typing are clamped automatically.

<ComponentDemo slug="input-number" demo-id="basic" />

### Uncontrolled &amp; Disabled

defaultValue provides the initial value; out-of-range values are clamped to the bounds on commit.

<ComponentDemo slug="input-number" demo-id="state" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="input-number" kind="props" />

### Events / Callbacks

<ComponentApi slug="input-number" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="input-number" kind="slots" />

## Notes

- Typed text is committed on blur or Enter: empty or invalid input falls back to null, while valid values are clamped to [min, max] and then formatted by precision.
- Stepping always lands on a multiple of step and displays at the configured precision; stepping past a boundary is a no-op.

## Accessibility

- Stepper buttons are focusable native buttons, the input carries number semantics, and the disabled state passes through the disabled attribute.
