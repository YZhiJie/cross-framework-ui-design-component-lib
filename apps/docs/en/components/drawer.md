---
title: Drawer
---

# Drawer <span class="page-head__en">抽屉</span> <span class="doc-tag">Basic</span>

A drawer panel sliding in from a screen edge for forms, details, and other secondary content, with four placements, custom size, focus trap / focus restore, and ref-based imperative control.

## Features

- Controlled visible or uncontrolled defaultVisible; v-model:visible on Vue
- Four slide-in placements: left / right / top / bottom (defaults to right)
- Custom size: width for left/right, height for top/bottom (numbers are treated as px; strings are applied as-is; defaults to 378)
- Mask can be hidden via mask; mask click to close via maskClosable, and ESC to close via closeOnEsc
- Focus trap: Tab cycles within the drawer while open (can be disabled with trapFocus); focus returns to the pre-open element after close
- Slots: default / title / footer / closeIcon (children / renderTitle / renderFooter / renderCloseIcon in React)
- Imperative open() / close() / toggle() methods exposed via ref (type DrawerRef)

### When to Use

- Form editing, detail views, filter panels, and other scenarios that need a larger area without fully interrupting the main flow.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Controlled Drawer

Maintain visible externally; customize footer buttons via the footer slot.

<ComponentDemo slug="drawer" demo-id="basic" />

### Placements

placement controls which edge (left / right / top / bottom) the drawer slides in from.

<ComponentDemo slug="drawer" demo-id="placement" />

### Imperative Control via ref

No need to maintain visible; call open() / close() / toggle() on the instance directly.

<ComponentDemo slug="drawer" demo-id="ref" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="drawer" kind="props" />

### Events / Callbacks

<ComponentApi slug="drawer" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="drawer" kind="slots" />

### Imperative Methods

<ComponentApi slug="drawer" kind="methods" />

## Notes

- Unlike Modal, there is no default footer; the footer area is fully controlled by the footer slot.
- The ref instance is of type DrawerRef, providing open() / close() / toggle().
- size applies to the cross axis: width for left/right, height for top/bottom.
- Open/close is animated: the overlay fades while the panel slides along its placement direction (240ms). During the leave animation the DOM is kept but non-interactive, then unmounted; reopening mid-animation cancels the unmount. With prefers-reduced-motion the animation is shortened to 1ms.

## Accessibility

- The panel carries role="dialog" (plus aria-modal="true" when mask is on); it receives focus on open, and Tab / Shift+Tab cycle within the drawer.
- Focus returns to the pre-open element after close so keyboard users keep their place; ESC to close is supported (closeOnEsc).
