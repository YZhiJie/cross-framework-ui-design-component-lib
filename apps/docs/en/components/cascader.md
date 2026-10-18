---
title: Cascader
---

# Cascader <span class="page-head__en">级联选择</span> <span class="doc-tag">Form</span>

Pick a path from a progressively expanding tree of options, either requiring a leaf or firing on any level.

## Features

- Controlled and uncontrolled modes; the value is a string[] (the value path from root to the selected node); supports v-model:value on Vue
- Tree-shaped options: levels are defined recursively via children; leaf nodes have no children
- changeOnSelect fires onChange on any selected level (the default requires selecting a leaf)
- separator customizes the path display separator (default " / "); clearable shows a clear button when a value is selected
- disabled disables the whole component; individual options can be disabled via disabled: true
- multiple mode: value is string[][]; supports cascaded checking (parent-child linkage), indeterminate state, check all / clear, and tag management
- checkStrictly allows selecting any level in multiple mode (the default only allows leaf nodes)

### When to Use

- Hierarchical selection such as province / city / district or category trees.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic

Tree-shaped options; selecting a leaf fires onChange; supports clearable and per-option disabled.

<ComponentDemo slug="cascader" demo-id="basic" />

### Any-level Selection &amp; Separator

changeOnSelect fires on any level; separator customizes the path display separator.

<ComponentDemo slug="cascader" demo-id="state" />

### Multiple Selection

multiple enables multi-select with value as string[][]; supports parent-child cascaded checking, indeterminate state, check all / clear, and removable tags for selected items.

<ComponentDemo slug="cascader" demo-id="multiple" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="cascader" kind="props" />

### Events / Callbacks

<ComponentApi slug="cascader" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="cascader" kind="slots" />

### Contract Types

**CascaderOption**

```ts
interface CascaderOption {
  label: string
  value: string
  children?: CascaderOption[]
  disabled?: boolean
}
```

A cascader option (tree-shaped; leaf nodes have no children).

## Notes

- value is a value-path array (e.g. ["east", "hangzhou"]); an empty array means nothing is selected. In multiple mode value is string[][] (e.g. [["east","hangzhou"], ["north","beijing"]]).
- Clicking outside closes the panel; selecting a leaf auto-closes in single mode (any selection auto-closes in changeOnSelect mode); the panel stays open in multiple mode.
- In multiple mode, checking a parent cascades to all descendant leaves; when all children are checked the parent auto-checks (indeterminate state). checkStrictly=true disables cascading and allows any level.

## Accessibility

- The trigger has role=combobox and the panel role=dialog; Enter/Space opens and Esc closes.
