---
title: Message
---

# Message <span class="page-head__en">全局提示</span> <span class="doc-tag">Feedback</span>

Imperative global toast with an isomorphic API across frameworks; the container mounts automatically on first call, no host component needed.

## Features

- Imperative API: info / success / warning / error / open / closeAll, isomorphic across frameworks
- Four semantic types with matching icons and palettes; auto-closes after 3s (duration configurable, 0 keeps it open)
- closable enables manual close; open returns a { close } handle and repeated closes are idempotent
- maxCount (default 5) caps on-screen messages; the oldest is removed when exceeded
- key-based updates: calling open again with the same key updates that message in place (no new entry, timer resets), ideal for progress feedback
- onClose fires whenever a message is removed (auto / manual / evicted / closeAll)
- The global container mounts lazily on first call (fixed, top-center); no host component needs to be declared

### When to Use

- Lightweight global feedback that does not interrupt the flow, such as save success, request failure, or copy completion.
- Progress feedback for long tasks like upload / export (with key-based updates, always a single message).

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Four Semantic Types

Import the message singleton from the framework package and call it directly; the container mounts on first call.

<ComponentDemo slug="message" demo-id="basic" />

### Persistent &amp; Close All

duration: 0 disables auto-close; closeAll clears all current messages and their timers.

<ComponentDemo slug="message" demo-id="options" />

### key Updates &amp; onClose

Repeated open calls with the same key refresh progress in place; onClose fires when the message closes.

<ComponentDemo slug="message" demo-id="update" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Imperative Methods

<ComponentApi slug="message" kind="methods" />

### Contract Types

**MessageOptions**

```ts
type MessageOptions = {
  type?: 'info' | 'success' | 'warning' | 'error'; // 默认 'info'
  content: string;        // 必填
  duration?: number;      // 默认 3000，0 表示不自动关闭
  closable?: boolean;     // 默认 false
  icon?: string;          // 自定义类型图标（内层 SVG 标记，与 @xui-design/icons 数据源同构）
  key?: string | number;  // 更新键：同 key 再次 open 原地更新该条
  onClose?: () => void;   // 消息移除回调
};
```

Full options for open; shortcut methods only accept duration / closable as the second argument (type and content are injected by the method; key / onClose require message.open).

**MessageHandle**

```ts
type MessageHandle = {
  close: () => void;
};
```

Handle returned by open / shortcut methods; close() closes manually and is idempotent.

## Notes

- Message is an imperative API, not a declarative component: neither framework exports a Message component, and it is excluded from the declarative contract-test matrix.
- Vue and React each export their own message singleton (@xui-design/vue / @xui-design/react); call it directly from the corresponding framework entry.
- When maxCount is exceeded, the oldest message is removed along with its auto-close timer; closeAll clears all timers.
- key updates: content is required and always refreshed; type / closable keep their previous values when omitted; duration resets the timer with the latest value; onClose replaces the old callback when provided.
- onClose fires consistently for auto-close / manual close / maxCount eviction / closeAll.
- The icon option takes inner SVG markup (without the &lt;svg&gt; wrapper, e.g. the value of icons.close), replacing the built-in type icon at render.

## Accessibility

- The message container uses aria-live="polite" so screen readers announce new messages without interrupting the current reading; the close button carries an aria-label.
