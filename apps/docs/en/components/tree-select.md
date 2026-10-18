---
title: TreeSelect
---

# TreeSelect <span class="page-head__en">树选择</span> <span class="doc-tag">Form</span>

A dropdown selector that presents options in a tree structure for hierarchical data. Click a node to select in single mode; multiple mode offers checkboxes with cascade checking.

## Features

- Single: click a node to select and close the panel
- Multiple: checkboxes with cascading; parent state derived from descendant leaves (indeterminate supported)
- checkStrictly disables cascading for independent checking
- Checked items render as removable tags with a clear-all button
- Expand all nodes by default with defaultExpandAll
- Controlled and uncontrolled modes (value + onChange)
- Imperative API on both frameworks: focus / toggleOpen / close
- Built-in i18n (placeholder follows the library locale)

### When to Use

- Selecting from hierarchical data (org charts, regions)
- Category filtering and permission checking
- Form fields with many options that have clear parent-child relations

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic Usage

In single mode, clicking a node selects it and closes the panel. Clearable empties the value; disabled nodes are not selectable.

<ComponentDemo slug="tree-select" demo-id="basic" />

### Multiple &amp; Cascade

With multiple enabled, the panel renders checkboxes. Checking a parent cascades to all non-disabled descendants (parents show indeterminate state). Checked items appear as removable tags; set checkStrictly to disable cascading.

<ComponentDemo slug="tree-select" demo-id="multiple" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="tree-select" kind="props" />

### Events / Callbacks

<ComponentApi slug="tree-select" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="tree-select" kind="slots" />

### Imperative Methods

<ComponentApi slug="tree-select" kind="methods" />

### Contract Types

**TreeNode**

```ts
type TreeNode = {
  key: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
};
```

Tree node shape (same as Tree); disableCheckbox disables only the checkbox (effective in multiple mode)

## Notes

- Cascade semantics match the Tree component: checking a parent checks all non-disabled descendants, and disabled descendants count toward the parent check-state derivation (indeterminate at most).
- In single mode, parent nodes are selectable (consistent with antd TreeSelect).
- Tags show all checked keys (including cascaded descendants); removing a tag follows cascade semantics.
- The clear button fires onChange (single '', multiple []) plus onClear, working in controlled mode too.

## Accessibility

- Trigger uses the combobox role with aria-expanded; Enter/Space toggle and Escape closes.
- Panel uses the dialog role linked via aria-controls; nodes use tree/treeitem/group roles with aria-checked mixed for indeterminate.
