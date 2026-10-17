---
title: Alert
---

# Alert <span class="page-head__en">警告提示</span> <span class="doc-tag">Feedback</span>

A static inline banner for information that needs user attention, with four semantic types, icon and closable support.

## Features

- Four semantic types: info / success / warning / error
- title plus description (description can also use the default slot / children)
- showIcon shows the type icon; closable allows manual close (close fires after hiding)
- title and icon both offer slots for full customization (renderTitle / renderIcon in React)

### When to Use

- Persistent inline notices such as form validation summaries, page-level notifications, and consequence explanations.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Four Semantic Types

Use type to switch between info / success / warning / error colors and semantics.

<ComponentDemo slug="alert" demo-id="basic" />

### Icon / Closable / Custom Title

showIcon plus closable; the title is customized via the title slot.

<ComponentDemo slug="alert" demo-id="closable" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="alert" kind="props" />

### Events / Callbacks

<ComponentApi slug="alert" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="alert" kind="slots" />

## Notes

- Alert is a static in-page notice, not a floating layer. Use Message for auto-dismissing global toasts.

## Accessibility

- The alert region carries role="status" / "alert" semantics per type; the close button is keyboard operable.
