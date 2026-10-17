---
title: 徽标数 Badge
---

# 徽标数 <span class="page-head__en">Badge</span> <span class="doc-tag">数据展示</span>

以角标形式展示消息数量或状态红点，可包裹任意内容，也可独立使用。

## 功能特性

- 包裹模式：徽标悬浮于内容右上角；无子内容时独立渲染
- count 超过 max 时显示 `${max}+`（max 默认 99）
- dot 点状徽标，忽略具体数值；showZero 控制 count 为 0 时是否显示

### 使用场景

- 未读消息 / 通知数量、有新内容的状态红点等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 计数与上限

count 动态变化，超过 max 后折叠为 99+。

<ComponentDemo slug="badge" demo-id="basic" />

### 红点 / 零值 / 独立

dot 仅提示有更新；showZero 决定 0 是否展示；无包裹内容时独立显示。

<ComponentDemo slug="badge" demo-id="variants" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="badge" kind="props" />

### Slots / 渲染回调

<ComponentApi slug="badge" kind="slots" />

## 注意事项

- 纯展示组件，无事件；count 为 0 且未开启 showZero 时徽标不占位。

## 无障碍

- 数值徽标以可读文本暴露数量语义；dot 模式作为状态提示，装饰性内容对读屏隐藏。
