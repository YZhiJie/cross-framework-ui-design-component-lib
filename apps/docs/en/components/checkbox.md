---
title: Checkbox
---

# Checkbox <span class="page-head__en">复选框</span> <span class="doc-tag">Form</span>

Select multiple options from a set, or use standalone as a two-state toggle, with indeterminate state support.

## Features

- Controlled and uncontrolled modes; v-model:value on Vue
- Indeterminate state via indeterminate (often used for "select all"; clicking switches to fully checked)
- Disabled state; label text is passed via the default slot / children

### When to Use

- Agreement checkboxes, conditional filtering, table row selection with select-all linkage, and similar scenarios.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Controlled Checkbox

Bind a boolean and listen to change for the checked state after toggle.

<ComponentDemo slug="checkbox" demo-id="basic" />

### Indeterminate &amp; Disabled

indeterminate means "partially selected"; clicks have no effect when disabled.

<ComponentDemo slug="checkbox" demo-id="state" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="checkbox" kind="props" />

### Events / Callbacks

<ComponentApi slug="checkbox" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="checkbox" kind="slots" />

## Notes

- Indeterminate is only a visual state meaning "partially selected"; clicking clears it and switches to fully checked.
- For "all / none / partial" tri-state linkage, compute indeterminate and value externally from the number of selected children.

## Accessibility

- Built on native checkbox input semantics; toggles with the Space key and carries the disabled attribute when disabled.
