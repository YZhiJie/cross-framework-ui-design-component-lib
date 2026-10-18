---
title: Select
---

# Select <span class="page-head__en">下拉选择</span> <span class="doc-tag">Form</span>

Pick values from a pop-up option panel, with single / multiple selection, search, and virtual scrolling, plus full keyboard support and ARIA semantics.

## Features

- Controlled and uncontrolled modes; v-model:value on Vue
- Multiple selection via multiple: the value is a string[], clicking an option toggles it without closing the panel, and tags can be removed individually
- Searchable mode: a search box at the top of the panel filters options by label (case-insensitive)
- Virtual scrolling via virtual: 1000+ options render only the visible window; maxHeight controls the panel viewport height
- Clear button via clearable when a value is selected (clears all in multiple mode); disabled disables the whole select
- Keyboard support: ArrowUp / ArrowDown move the highlight (skipping disabled options), Enter confirms, Esc closes
- Grouped options: options accepts a mixed SelectOptionGroup structure, rendering options within groups

### When to Use

- Single / multiple form fields with too many options to lay out with Radio.
- Large datasets with thousands of options (with virtual scrolling).
- Search-driven selection to quickly locate options by label (with searchable).

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Controlled &amp; Clearable

Individual options can be disabled in options; clearable offers one-click clearing.

<ComponentDemo slug="select" demo-id="basic" />

### Default Value &amp; Disabled

defaultValue sets the initial selection; disabled disables the whole select.

<ComponentDemo slug="select" demo-id="state" />

### Multiple / Searchable / Virtual

multiple shows selections as tags; searchable filters by label; virtual renders 1000 items while maintaining only the visible window.

<ComponentDemo slug="select" demo-id="advanced" />

### Grouped Options

Pass a SelectOptionGroup structure to options; options within groups are rendered together, with group-level disabled support.

<ComponentDemo slug="select" demo-id="grouped" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="select" kind="props" />

### Events / Callbacks

<ComponentApi slug="select" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="select" kind="slots" />

### Contract Types

**SelectOption**

```ts
interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}
```

Configuration of a dropdown option.

**SelectOptionGroup**

```ts
interface SelectOptionGroup {
  label: string
  options: SelectOption[]
  disabled?: boolean
}
```

Configuration of a dropdown option group.

**SelectSource**

```ts
type SelectSource = (SelectOption | SelectOptionGroup)[];
```

options data source: supports a flat option array or a mixed grouped structure.

**SelectValue**

```ts
type SelectValue = string | string[];
```

Selected value: a string in single mode and a string[] in multiple mode (backward compatible: single-select behavior matches the old version).

## Notes

- Disabled options do not respond to clicks or keyboard highlighting; attempts to select them are silently ignored.
- Clicking outside closes the panel without changing the value; in multiple mode the panel stays open after an option is clicked.
- Virtual mode requires a fixed option row height (30px by default; align it via the --xui-select-item-height CSS variable).
- Removing a tag in multiple mode toggles that option off and fires onChange with the latest array.
- Built-in viewport avoidance: the panel flips upward when space below is insufficient (is-drop-up is added to the root), recalculated in real time on scroll and window resize; an overflow: hidden ancestor may still clip the panel.

## Accessibility

- The select is focusable via Tab; arrow keys / Enter / Esc cover all keyboard operations, and disabled options carry disabled semantics.
- The multiple panel carries aria-multiselectable; the search box has its own role=searchbox.
