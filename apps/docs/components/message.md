---
title: 全局提示 Message
---

# 全局提示 <span class="page-head__en">Message</span> <span class="doc-tag">反馈提示</span>

命令式全局轻提示，双端同构 API，首次调用自动挂载容器，无需预置组件。

## 功能特性

- 命令式 API：info / success / warning / error / open / closeAll，双端同构
- 4 种语义类型，各配图标与色板，3s 自动关闭（duration 可配，0 为常驻）
- closable 手动关闭；open 返回 { close } 句柄，重复关闭幂等
- maxCount（默认 5）同屏上限，超限自动移除最早一条
- key 更新语义：相同 key 再次 open 原地更新该条（不新增、重置计时），适合进度类反馈
- onClose 回调：消息被移除（自动 / 手动 / 挤出 / closeAll）时触发
- 首次调用惰性挂载全局容器（页面顶部居中 fixed），应用中无需声明任何宿主组件

### 使用场景

- 保存成功、请求失败、复制完成等不打断操作流程的轻量全局反馈。
- 上传 / 导出等耗时任务的进度反馈（配合 key 更新语义，始终只有一条消息）。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 四种语义类型

直接从框架包导入 message 单例调用，容器首次调用时自动挂载。

<ComponentDemo slug="message" demo-id="basic" />

### 常驻与关闭全部

duration: 0 时不自动关闭；closeAll 清空当前所有消息及其定时器。

<ComponentDemo slug="message" demo-id="options" />

### key 更新与 onClose

同 key 反复 open 原地刷新进度；消息关闭时触发 onClose 回调。

<ComponentDemo slug="message" demo-id="update" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### 命令式方法

<ComponentApi slug="message" kind="methods" />

### 契约类型

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

open 的完整参数；快捷方法的第二参仅支持 duration / closable（type 与 content 由方法注入，key / onClose 需走 message.open）。

**MessageHandle**

```ts
type MessageHandle = {
  close: () => void;
};
```

open / 快捷方法返回的句柄，close() 手动关闭且幂等。

## 注意事项

- Message 是命令式 API 而非声明式组件：双端均未导出 Message 组件，也不进 contract-test 声明式校验矩阵。
- Vue 与 React 各自导出独立的 message 单例（@xui-design/vue / @xui-design/react），在对应框架入口直接调用即可。
- maxCount 超限时连带移除最早消息的自动关闭定时器；closeAll 同时清空全部定时器。
- key 更新：content 必填刷新，type / closable 未传保留原值；duration 以最新值重置计时，onClose 传入时替换旧回调。
- onClose 触发时机统一：自动关闭 / 手动关闭 / maxCount 挤出 / closeAll 均触发。
- icon 选项传内层 SVG 标记（不含 &lt;svg&gt; 壳，如 icons.close 的值），渲染时替换按 type 的内置图标。

## 无障碍

- 消息容器 aria-live="polite"，新消息出现时读屏播报但不打断当前朗读；关闭按钮携带 aria-label。
