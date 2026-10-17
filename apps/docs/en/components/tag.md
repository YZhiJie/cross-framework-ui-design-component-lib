---
title: Tag
---

# Tag <span class="page-head__en">标签</span> <span class="doc-tag">Data Display</span>

A small tag for labeling and categorization, with five semantic types, two sizes, and closable interaction.

## Features

- Five semantic types: default / primary / success / warning / danger
- Two sizes: sm / md
- closable shows a close button; clicking it hides the component and fires close

### When to Use

- Category labels, removable filter criteria, brief status indicators, and more.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Semantic Types

Use type to switch between the five built-in color semantics.

<ComponentDemo slug="tag" demo-id="basic" />

### Closable Tag

A closable tag hides itself after closing; sync the data source externally in the close handler.

<ComponentDemo slug="tag" demo-id="closable" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="tag" kind="props" />

### Events / Callbacks

<ComponentApi slug="tag" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="tag" kind="slots" />

## Notes

- After the close click, the component hides internally before firing the callback; to "bring it back" (e.g. resetting a demo), remount the component (via key in Vue or a remount in React).

## Accessibility

- The close button has button semantics and a readable "Close" label, and is keyboard-focusable.
