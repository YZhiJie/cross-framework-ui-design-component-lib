---
title: Tabs
---

# Tabs <span class="page-head__en">标签页</span> <span class="doc-tag">Navigation</span>

Switches between multiple peer content panels in the same area, with configurable tab items, controlled / uncontrolled modes, and keyboard navigation.

## Features

- items configures tabs (label / value / disabled); controlled value or uncontrolled defaultValue
- Panel content receives the active item via a scoped slot: Vue #default="{ item }", React renderPanel(item)
- Disabled tabs cannot be activated; arrow keys cycle through enabled tabs

### When to Use

- Switching between peer content such as form sections, multi-view detail pages, or grouped settings.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Controlled &amp; Disabled Tabs

The active value is maintained externally; disabled tabs are not clickable and are skipped in keyboard cycling.

<ComponentDemo slug="tabs" demo-id="basic" />

### Uncontrolled

Only defaultValue sets the initially active tab; switching is managed internally.

<ComponentDemo slug="tabs" demo-id="uncontrolled" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="tabs" kind="props" />

### Events / Callbacks

<ComponentApi slug="tabs" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="tabs" kind="slots" />

### Contract Types

**TabItem**

```ts
interface TabItem {
  label: string
  value: string
  disabled?: boolean
}
```

Tab item configuration.

## Notes

- On Vue the panel is the default scoped slot (#default="{ item }"); there is no named slot called item.
- Disabled tabs are skipped both when clicked and when switching via keyboard.

## Accessibility

- The tab bar has tablist / tab semantics; aria-selected marks the active tab, and left/right arrow keys move focus.
