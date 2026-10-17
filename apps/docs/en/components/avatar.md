---
title: Avatar
---

# Avatar <span class="page-head__en">头像</span> <span class="doc-tag">Data Display</span>

Displays an image or text avatar for a user or entity, with three sizes, circle / square shapes, and image-failure fallback.

## Features

- size supports sm / md / lg; shape supports circle / square
- Content priority: a successfully loaded image &gt; default slot / children (text or icon) &gt; default icon
- Falls back automatically and fires the error event when src fails to load

### When to Use

- User profiles, comment lists, navbar account entries, and other scenarios needing a visual identity.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Image / Text / Sizes

src sets the image URL; slot text shows when there is no image; size controls the three size options.

<ComponentDemo slug="avatar" demo-id="basic" />

### Shapes &amp; Failure Fallback

shape switches between square and circle; falls back to slot content or the default icon when the image fails to load.

<ComponentDemo slug="avatar" demo-id="shape" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="avatar" kind="props" />

### Events / Callbacks

<ComponentApi slug="avatar" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="avatar" kind="slots" />

## Notes

- When both src and slot content are provided, only the image shows on successful load; the slot fallback appears only after a failure.

## Accessibility

- The image gets alternative text when alt is provided; omit alt for purely decorative avatars so screen readers skip them.
