---
title: Steps
---

# Steps <span class="page-head__en">步骤条</span> <span class="doc-tag">Navigation</span>

A navigation bar that guides users through a task flow, with horizontal/vertical layouts, click-to-navigate and error status marking.

## Features

- Auto status derivation: finish (check) before current, process at current, wait after
- status prop overrides current step state (error marking)
- Horizontal and vertical layouts
- Click non-disabled steps to navigate; controlled value drives external flow
- Imperative API on both frameworks: next / prev / goTo (disabled targets no-op)
- Controlled and uncontrolled modes (value + onChange)

### When to Use

- Multi-step flows such as signup and checkout
- Vertical timelines such as logistics tracking and approval flows
- Wizard-style step-by-step forms

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic Usage

Controlled value drives the current step; clicking a step title also navigates. status="error" marks the current step as failed (cross icon).

<ComponentDemo slug="steps" demo-id="basic" />

### Vertical Steps

direction="vertical" switches to vertical layout with a vertical connector — suitable for timeline displays.

<ComponentDemo slug="steps" demo-id="vertical" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="steps" kind="props" />

### Events / Callbacks

<ComponentApi slug="steps" kind="events" />

### Imperative Methods

<ComponentApi slug="steps" kind="methods" />

### Contract Types

**StepItem**

```ts
type StepItem = {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
};
```

Step item shape; disabled steps ignore clicks and imperative navigation

## Notes

- Clicking the current step does not fire change (duplicate selection is a no-op).
- next/prev do not skip disabled steps automatically: navigation stops at a disabled target for the business layer to reroute.
- Connectors render only between adjacent steps; the last item has no outgoing line.

## Accessibility

- Root uses the list role with listitem steps; current step has aria-current="step" and disabled steps aria-disabled.
