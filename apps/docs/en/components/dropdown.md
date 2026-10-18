---
title: Dropdown
---

# Dropdown <span class="page-head__en">下拉菜单</span> <span class="doc-tag">Navigation</span>

Collapses a group of actions into a dropdown menu anchored to a trigger, with hover / click triggers, four placements and viewport collision handling.

## Features

- trigger supports hover (default, with a 100ms open / 150ms close debounce) and click; select fires after the menu closes with the key and the full option
- menu is array-driven: disabled items ignore clicks, danger items render red, divided adds a separator, icon renders a built-in icon
- placement controls the four directions; flips when space is tight, clamps at viewport edges, and recalculates on scroll and resize
- Clicking outside or pressing Esc only closes the menu without firing select; onVisibleChange reports open state changes

### When to Use

- Toolbar "more actions" overflow, avatar menus, or table row actions that are too many to display inline.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic Usage

Hover the trigger to open the menu; clicking an item closes it and fires select.

<ComponentDemo slug="dropdown" demo-id="basic" />

### Click Trigger / Item Variants / Disabled

trigger switches to click and placement pops to the right; items demo disabled, divided, danger and icon; hover and click do nothing when disabled.

<ComponentDemo slug="dropdown" demo-id="variants" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="dropdown" kind="props" />

### Events / Callbacks

<ComponentApi slug="dropdown" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="dropdown" kind="slots" />

## Notes

- Hover trigger ships with a 100ms open / 150ms close debounce, so crossing the 8px gap between trigger and menu never mis-closes; hover is a no-op with click trigger.
- The menu uses CSS wrapper positioning (like Tooltip / Popconfirm), so watch out for clipping by parent overflow; the ref exposes show / hide / toggle.
- icon takes an @xui-design/icons name (e.g. user / calendar / close); unknown names are silently ignored.

## Accessibility

- The menu container has role="menu" and items role="menuitem" with aria-disabled on disabled entries; Esc closes the menu. Arrow-key navigation is not supported yet.
