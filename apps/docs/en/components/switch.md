---
title: Switch
---

# Switch <span class="page-head__en">开关</span> <span class="doc-tag">Form</span>

A boolean toggle switch with controlled / uncontrolled modes and a loading state.

## Features

- Controlled and uncontrolled modes (controlled when value is provided); v-model:value on Vue
- Two sizes: sm / md
- Disabled state and loading state (toggles are ignored while loading; the thumb shows a spinner)
- Dual-state text via checkedText / uncheckedText: shown inside the track on the opposite side of the thumb, auto-truncated when too long (with a title tooltip)
- Imperative focus() exposed via ref

### When to Use

- Instant toggling of boolean settings such as notification switches, feature flags, and agreement consent.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Controlled Usage

Bind value and listen to change to sync external state; v-model:value is recommended on Vue.

<ComponentDemo slug="switch" demo-id="basic" />

### Sizes &amp; States

Small size, uncontrolled default-on, disabled, and loading states.

<ComponentDemo slug="switch" demo-id="state" />

### Dual-State Text

checkedText / uncheckedText are shown inside the track; omit them for a plain switch.

<ComponentDemo slug="switch" demo-id="text" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="switch" kind="props" />

### Events / Callbacks

<ComponentApi slug="switch" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="switch" kind="slots" />

## Notes

- In controlled mode the component never changes its own state; it only notifies the external side via change / update:value.
- When loading is true, click toggles are ignored but the disabled styling is not applied — ideal for "waiting for an async result after toggling" scenarios.
- Dual-state text is hidden from screen readers (state is conveyed via role="switch" + aria-checked); both texts stay in the DOM overlapped with CSS Grid, the track width adapts to the wider text, and no width jitter occurs on toggle.

## Accessibility

- Renders as a button with role="switch" and aria-checked; carries disabled when disabled, and toggles with Space / Enter.
