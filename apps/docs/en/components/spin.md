---
title: Spin
---

# Spin <span class="page-head__en">加载中</span> <span class="doc-tag">Feedback</span>

A loading indicator that works standalone or wraps content with a mask to indicate block-level loading.

## Features

- size supports sm / md / lg (default md); tip shows hint text below the indicator
- When wrapping content, spinning toggles the translucent mask (default true)

### When to Use

- Local data loading, button / card pending states, full-screen or block-level loading placeholders.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Sizes &amp; Tip

Three standalone indicator sizes, with tip adding a text hint.

<ComponentDemo slug="spin" demo-id="basic" />

### Wrapping Content

While spinning, a mask covers the content and blocks interaction; it is restored when finished.

<ComponentDemo slug="spin" demo-id="wrapper" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="spin" kind="props" />

### Slots / Render Callbacks

<ComponentApi slug="spin" kind="slots" />

## Notes

- A purely presentational component with no events; the indicator animation is CSS-driven and can be reduced via prefers-reduced-motion.

## Accessibility

- The indicator carries an aria-live region and busy state so screen readers can perceive "loading"; tip serves as a readable description.
