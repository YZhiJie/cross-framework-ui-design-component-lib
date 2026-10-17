---
title: Empty
---

# Empty <span class="page-head__en">空状态</span> <span class="doc-tag">Data Display</span>

Placeholder for empty data or no results, with a built-in default illustration and customizable description, illustration, and action area.

## Features

- Built-in default illustration; description provides the text (not rendered when blank, avoiding built-in i18n)
- Customize the illustration via the image slot / renderImage; place action buttons in the default slot

### When to Use

- Scenarios such as empty lists, no search results, or first-use onboarding.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Description &amp; Action

The default slot holds guiding actions such as "Create".

<ComponentDemo slug="empty" demo-id="basic" />

### Custom Illustration &amp; Pure Default

The image slot overrides the default illustration; when description is omitted, only the illustration is shown.

<ComponentDemo slug="empty" demo-id="image" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="empty" kind="props" />

### Slots / Render Callbacks

<ComponentApi slug="empty" kind="slots" />

## Notes

- The component ships no built-in text; description is fully controlled by the consumer, which simplifies internationalization.

## Accessibility

- The empty state acts as a descriptive region: the description text can be read by screen readers, and the decorative illustration is marked as decorative.
