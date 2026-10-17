---
title: Skeleton
---

# Skeleton <span class="page-head__en">骨架屏</span> <span class="doc-tag">Data Display</span>

Placeholder screen shown while data is loading, conveying structure before content is ready, with avatar placeholder and customizable row count.

## Features

- loading toggles between skeleton and real content; renders the default slot when false
- avatar shows a leading avatar placeholder; rows sets the paragraph line count (coerced to a positive integer, defaults to 3)

### When to Use

- First-load of cards / lists / detail pages, or waiting for data on slow networks.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Loading Toggle

loading=true shows the skeleton; false renders the real content in the slot.

<ComponentDemo slug="skeleton" demo-id="basic" />

### Avatar Placeholder &amp; Rows

avatar renders a circular avatar placeholder; rows controls the text line count.

<ComponentDemo slug="skeleton" demo-id="variants" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="skeleton" kind="props" />

### Slots / Render Callbacks

<ComponentApi slug="skeleton" kind="slots" />

## Notes

- Invalid rows values such as 0 or negatives are coerced to 1, guaranteeing at least one line.

## Accessibility

- The skeleton region is marked busy (aria-busy) so screen readers can sense that content is loading.
