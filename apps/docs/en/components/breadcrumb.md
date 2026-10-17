---
title: Breadcrumb
---

# Breadcrumb <span class="page-head__en">面包屑</span> <span class="doc-tag">Navigation</span>

Shows the hierarchical path of the current page, supporting link items / clickable items and a custom separator.

## Features

- items configures the hierarchy; the last item is automatically treated as the current page (not clickable)
- An item with href renders as &lt;a&gt;, otherwise as a clickable &lt;span&gt;; separator customizes the delimiter (defaults to '/')
- Disabled items and the last item do not fire itemClick

### When to Use

- Scenarios such as hierarchical back-navigation on detail pages or section location in admin systems.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic &amp; Separator

The last item is the current page; separator can replace the default slash.

<ComponentDemo slug="breadcrumb" demo-id="basic" />

### Click &amp; Disabled

Clicking an item without href fires itemClick; disabled items and the last item are ignored.

<ComponentDemo slug="breadcrumb" demo-id="click" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="breadcrumb" kind="props" />

### Events / Callbacks

<ComponentApi slug="breadcrumb" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="breadcrumb" kind="slots" />

### Contract Types

**BreadcrumbItem**

```ts
interface BreadcrumbItem {
  label: string
  href?: string
  disabled?: boolean
}
```

Breadcrumb hierarchy item; renders as a link when href is present.

## Notes

- The component does not intercept the default link navigation (aligned with Element Plus); route interception in an SPA is handled by the application layer.
- In hash-routed apps, omit href and handle navigation via itemClick if you do not want to change the address.

## Accessibility

- The root uses nav with aria-label="面包屑", and the current page is marked with aria-current.
