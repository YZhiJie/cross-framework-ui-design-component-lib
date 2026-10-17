---
title: Button
---

# Button <span class="page-head__en">按钮</span> <span class="doc-tag">Basic</span>

A basic button component with multiple semantic types, sizes, loading and disabled states.

## Features

- Four semantic types: default / primary / danger / link
- Three sizes: sm / md (default) / lg
- Disabled state and loading state (clicks are ignored while loading)
- Block-level button that stretches to the container width
- Leading icon and loading icon are customizable via slot / render callback

### When to Use

- Any click-driven interaction such as form submission, action triggering, or navigation.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Button Types

Use type to set the semantic type; defaults to default.

<ComponentDemo slug="button" demo-id="type" />

### Sizes &amp; Block

Three sizes: sm / md / lg. The block prop stretches the button to its parent width.

<ComponentDemo slug="button" demo-id="size" />

### Disabled &amp; Loading

disabled turns off all interaction; loading shows a spinner and ignores clicks, ideal for async submissions.

<ComponentDemo slug="button" demo-id="state" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="button" kind="props" />

### Events / Callbacks

<ComponentApi slug="button" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="button" kind="slots" />

## Notes

- Clicks are ignored while loading to prevent duplicate triggers during async submission.
- type="link" only looks like a link; the element is still a button. Wrap an &lt;a&gt; yourself when native navigation is needed.

## Accessibility

- Renders as a native &lt;button&gt; with the disabled attribute applied when disabled or loading, matching native keyboard and screen-reader behavior.
