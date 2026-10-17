---
title: Radio
---

# Radio <span class="page-head__en">单选框</span> <span class="doc-tag">Form</span>

Select one option from a mutually exclusive set. RadioGroup manages the selected value with Radio as the child item; an options array is also supported.

## Features

- Controlled and uncontrolled modes for RadioGroup; v-model:value on Vue
- Two rendering approaches: Radio child components via slot, or an options config array (choose one; options takes precedence)
- Supports disabling the whole group or individual options (effects stack)
- Radio itself holds no state and emits no events; selection is derived from the group context

### When to Use

- Mutually exclusive choices, single-choice settings, enum form fields, and similar scenarios.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Radio Children

Place Radio in the RadioGroup default slot; value is the option value.

<ComponentDemo slug="radio" demo-id="group" />

### options Config &amp; Group Disabled

Pass an options array to render the group; disabled applies to the whole group.

<ComponentDemo slug="radio" demo-id="options" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="radio" kind="props" />

### Events / Callbacks

<ComponentApi slug="radio" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="radio" kind="slots" />

### Contract Types

**RadioOption**

```ts
interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}
```

Configuration of a single item in the options array.

## Notes

- Radio must be used inside a RadioGroup; its checked state comes from the group context, so do not control Radio with its own value.
- In options mode, disable an item via disabled: true on that option; in slot mode, set disabled on the &lt;Radio&gt; itself.

## Accessibility

- Options use native radio semantics and share one group name; arrow keys move the selection within the group.
