---
title: Modal
---

# Modal <span class="page-head__en">对话框</span> <span class="doc-tag">Basic</span>

A modal dialog for information or actions that require explicit handling, with focus trap / focus restore, customizable footer text, and both controlled and ref-based imperative usage.

## Features

- Controlled visible or uncontrolled defaultVisible; v-model:visible on Vue
- Title and custom width (numbers are treated as px; strings are applied as-is)
- Close button via closable, mask click to close via maskClosable, and ESC to close via closeOnEsc
- Focus trap: Tab cycles within the dialog while open (can be disabled with trapFocus); focus returns to the pre-open element after close
- Custom default footer button text via okText / cancelText (falls back to the global locale; zh-CN defaults to 确认 / 取消)
- Three slots: default / title / footer (children / renderTitle / renderFooter in React)
- Imperative open() / close() methods exposed via ref (type ModalRef)

### When to Use

- Confirmations, form editing, detail views, and other scenarios that interrupt the main flow to focus user attention.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Controlled Dialog

Maintain visible externally; customize footer buttons via the footer slot.

<ComponentDemo slug="modal" demo-id="basic" />

### Custom Button Text

Customize footer text with okText / cancelText; ESC, mask click, and the close button all dismiss the dialog.

<ComponentDemo slug="modal" demo-id="custom" />

### Imperative Open via ref

No need to maintain visible; call open() / close() on the instance directly.

<ComponentDemo slug="modal" demo-id="ref" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="modal" kind="props" />

### Events / Callbacks

<ComponentApi slug="modal" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="modal" kind="slots" />

## Notes

- The dialog closes automatically after onOk / onCancel; with a custom footer, call close() or update visible yourself.
- The ref instance is of type ModalRef, providing open() and close() methods.
- okText / cancelText have no effect when a custom footer slot is used (the slot fully takes over the footer).
- With trapFocus enabled and no focusable elements inside, focus is locked on the panel itself (tabindex=-1).

## Accessibility

- The panel carries role="dialog" + aria-modal="true"; it receives focus on open, and Tab / Shift+Tab cycle within the dialog.
- Focus returns to the pre-open element after close so keyboard users keep their place; ESC to close is supported (closeOnEsc).
