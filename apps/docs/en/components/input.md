---
title: Input
---

# Input <span class="page-head__en">输入框</span> <span class="doc-tag">Basic</span>

A basic text input with controlled / uncontrolled modes, a clear button, prefix / suffix, and multiple native types.

## Features

- Controlled and uncontrolled modes (controlled when value is provided); v-model:value on Vue
- Supports native types: text / password / number / email / search / tel / url
- Disabled state, read-only state, and maxLength limit
- Clear button via clearable; customizable prefix / suffix content
- Imperative focus() exposed via ref

### When to Use

- Form text entry, search boxes, composite inputs with icons, and similar scenarios.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Controlled Usage

Bind value to sync external state; clearable offers one-click clearing.

<ComponentDemo slug="input" demo-id="basic" />

### Disabled / Readonly / Prefix

Disabled and readonly pass through to native attributes; the prefix slot holds leading content such as icons.

<ComponentDemo slug="input" demo-id="state" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="input" kind="props" />

### Events / Callbacks

<ComponentApi slug="input" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="input" kind="slots" />

## Notes

- The input event fires on every keystroke, while change fires on blur or Enter; they have different semantics, so listen as needed.
- readonly allows focus and copying but not editing; disabled blocks all interaction and is excluded from form submission.

## Accessibility

- Renders as a native &lt;input&gt; with disabled / readonly passed through, preserving native focus and keyboard input behavior.
