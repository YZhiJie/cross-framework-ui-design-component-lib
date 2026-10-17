---
title: Popconfirm
---

# Popconfirm <span class="page-head__en">气泡确认</span> <span class="doc-tag">Feedback</span>

A lightweight confirmation bubble triggered by clicking an element, ideal for actions like "delete" that need a second confirmation without interrupting the whole page.

## Features

- Clicking the trigger toggles the bubble; the OK / cancel buttons fire confirm / cancel after the bubble closes
- confirmText / cancelText customize the button labels (falling back to the global locale, zh-CN defaults to "确定"/"取消"); placement controls the four directions
- Confirmation text via the content prop or the content slot / renderContent; disabled turns off interaction
- Clicking outside only closes the bubble without firing any callback

### When to Use

- Lightweight second confirmations for delete / submit actions, or pre-interception of dangerous operations.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Delete Confirmation

Click the trigger to pop up the confirmation; OK and cancel fire separate callbacks.

<ComponentDemo slug="popconfirm" demo-id="basic" />

### Placement / Button Text / Disabled

placement pops to the right with custom button text; clicks do nothing when disabled.

<ComponentDemo slug="popconfirm" demo-id="variants" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="popconfirm" kind="props" />

### Events / Callbacks

<ComponentApi slug="popconfirm" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="popconfirm" kind="slots" />

## Notes

- Clicking outside only closes the bubble without firing confirm or cancel, letting users back out with no side effects.
- The bubble uses CSS wrapper positioning like Tooltip, so watch out for clipping by parent overflow.
- Built-in viewport collision handling: flips when the preferred placement lacks space (the arrow follows), clamps at viewport edges, and recalculates on scroll and window resize.

## Accessibility

- The OK / cancel buttons are native and keyboard operable; focus moves into the popup when it opens, and Esc cancels and closes it.
