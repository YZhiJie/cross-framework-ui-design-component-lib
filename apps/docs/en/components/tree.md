---
title: Tree
---

# Tree <span class="page-head__en">树形控件</span> <span class="doc-tag">Data Display</span>

Display hierarchical data as a tree, with expand/collapse, single selection, and cascaded checking.

## Features

- Tree-shaped data: levels are defined recursively via children; node keys are unique across the tree; leaf nodes have no children
- expandedKeys / checkedKeys / selectedKey all support controlled and uncontrolled modes; Vue supports v-model:expanded-keys / v-model:checked-keys / v-model:selected-key
- defaultExpandAll expands all non-leaf nodes by default; defaultExpandedKeys specifies the initial expanded set
- checkable shows checkboxes: parent-child cascaded checking (disabled nodes excluded), indeterminate state derivation, and checkStrictly for independent checking
- disabled disables the whole tree; individual nodes support disabled (entire node) or disableCheckbox (checkbox only)
- Imperative ref API: expandAll / collapseAll / checkAll / uncheckAll, identical on both frameworks

### When to Use

- Display and selection of hierarchical data such as file directories, org charts, and category trees.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic

Tree-shaped data renders the hierarchy; defaultExpandAll expands everything; clicking a title selects the node.

<ComponentDemo slug="tree" demo-id="basic" />

### Checkable

checkable enables checkboxes; checking a parent cascades to all enabled descendants; disabled nodes are excluded from cascading but counted in parent indeterminate derivation.

<ComponentDemo slug="tree" demo-id="checkable" />

### Imperative API

Call expandAll / collapseAll / checkAll / uncheckAll via ref; controlled checkedKeys sync via v-model.

<ComponentDemo slug="tree" demo-id="actions" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="tree" kind="props" />

### Events / Callbacks

<ComponentApi slug="tree" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="tree" kind="slots" />

### Imperative Methods

<ComponentApi slug="tree" kind="methods" />

### Contract Types

**TreeNode**

```ts
interface TreeNode {
  key: string
  label: string
  children?: TreeNode[]
  disabled?: boolean
  disableCheckbox?: boolean
}
```

A tree node (key is unique across the tree; non-empty children means non-leaf; disabled disables the entire node; disableCheckbox disables only the checkbox).

## Notes

- The three state groups (expandedKeys / checkedKeys / selectedKey) are independently controlled: providing the prop enters controlled mode; otherwise the component maintains internal state (defaultXxx sets the initial value).
- Cascade semantics: checking a parent checks all enabled descendants (including intermediate nodes); clicking an indeterminate parent checks all enabled descendants; unchecking a fully-checked parent removes all descendant checks. Disabled nodes are excluded from cascading but counted in the parent state derivation—an unchecked disabled descendant caps the parent at indeterminate.
- With checkStrictly=true, checking is fully independent per node, matched by its own key only, with no cascading or indeterminate state.

## Accessibility

- The root has role=tree, nodes role=treeitem, child groups role=group; checkboxes use role=checkbox (aria-checked supports mixed for indeterminate); non-leaf nodes reflect expansion via aria-expanded.
