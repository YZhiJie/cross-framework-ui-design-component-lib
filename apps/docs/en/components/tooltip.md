---
title: Tooltip
---

# Tooltip <span class="page-head__en">文字提示</span> <span class="doc-tag">Feedback</span>

A simple text bubble shown on hover or focus, positioned with a CSS wrapper (no portal), supporting four placements and two triggers.

## Features

- placement supports top / bottom / left / right
- trigger supports hover (default) and focus; disabled stops responding to triggers
- Tooltip content via the content prop or the content slot / renderContent

### When to Use

- Lightweight hints such as icon button labels, field explanations, and shortcut tips.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Four Placements

Hover (or keyboard-focus) the trigger elements to see the bubble at each placement.

<ComponentDemo slug="tooltip" demo-id="basic" />

### Focus Trigger &amp; Disabled

trigger="focus" suits input fields; disabled turns the tooltip off entirely.

<ComponentDemo slug="tooltip" demo-id="trigger" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="tooltip" kind="props" />

### Slots / Render Callbacks

<ComponentApi slug="tooltip" kind="slots" />

## Notes

- The bubble uses CSS wrapper positioning instead of a portal, so it can be clipped by a parent with overflow: hidden; mind your layout.
- Built-in viewport collision handling: flips to the opposite side when the preferred placement lacks space, clamps at viewport edges horizontally / vertically, and recalculates on scroll and window resize.

## Accessibility

- The focus trigger is keyboard-friendly by nature; hover triggers are also focusable, and the tooltip is linked to its trigger via aria-describedby.
