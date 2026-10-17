---
title: 按钮 Button
---

# 按钮 <span class="page-head__en">Button</span> <span class="doc-tag">基础组件</span>

基础按钮组件，支持多种语义类型、尺寸、加载与禁用状态。

## 功能特性

- 四种语义类型：default / primary / danger / link
- 三种尺寸：sm / md（默认）/ lg
- disabled 禁用、loading 加载态（加载中点击被忽略）
- block 块级按钮（宽度撑满容器）
- 前置图标与加载图标均可通过插槽 / 回调自定义

### 使用场景

- 表单提交、操作触发、导航跳转等一切需要点击交互的场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 按钮类型

通过 type 指定语义类型，默认 default。

<ComponentDemo slug="button" demo-id="type" />

### 尺寸与块级

sm / md / lg 三档尺寸；block 使按钮宽度撑满父容器。

<ComponentDemo slug="button" demo-id="size" />

### 禁用与加载

disabled 完全禁用交互；loading 时显示加载图标且点击被忽略，适合异步提交场景。

<ComponentDemo slug="button" demo-id="state" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="button" kind="props" />

### Events / 回调

<ComponentApi slug="button" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="button" kind="slots" />

## 注意事项

- loading 状态下点击事件被忽略，避免异步提交期间重复触发。
- type="link" 仅表现为链接样式，语义仍是 button 元素；需要原生导航请自行包裹 &lt;a&gt;。

## 无障碍

- 渲染为原生 &lt;button&gt;，disabled / loading 时携带 disabled 属性，键盘与读屏行为与原生按钮一致。
