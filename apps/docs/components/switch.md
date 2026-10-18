---
title: 开关 Switch
---

# 开关 <span class="page-head__en">Switch</span> <span class="doc-tag">表单交互</span>

布尔值开关选择器，支持受控 / 非受控双模式与加载态。

## 功能特性

- 受控 / 非受控双模式（提供 value 即受控），Vue 端支持 v-model:value
- sm / md 两种尺寸
- disabled 禁用、loading 加载态（加载中切换被忽略，滑块显示 Spinner）
- checkedText / uncheckedText 双态文本：显示在轨道内滑块对侧，超长自动截断（title 提示）
- checkedColor / uncheckedColor 自定义开 / 关背景色（CSS 颜色值，透传 CSS 变量）
- beforeChange 切换前钩子：返回 false 或 reject 的 Promise 可阻止切换
- 通过 ref 暴露 focus() 命令式聚焦

### 使用场景

- 通知开关、功能启停、协议同意等布尔设置的即时切换场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 受控用法

绑定 value 并监听 change 同步外部状态，Vue 端推荐 v-model:value。

<ComponentDemo slug="switch" demo-id="basic" />

### 尺寸与状态

小尺寸、非受控默认开启、禁用与加载态。

<ComponentDemo slug="switch" demo-id="state" />

### 双态文本

checkedText / uncheckedText 显示在轨道内；不传保持纯开关模式。

<ComponentDemo slug="switch" demo-id="text" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="switch" kind="props" />

### Events / 回调

<ComponentApi slug="switch" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="switch" kind="slots" />

## 注意事项

- 受控模式下组件不自改状态，仅通过 change / update:value 回调通知外部同步。
- loading 为 true 时点击切换被忽略，但不禁用样式，适合"切换中等待异步结果"场景。
- beforeChange 返回 false 或 reject 的 Promise 时阻止切换；返回 true 或 resolve(true) 时正常切换。
- 双态文本对读屏隐藏（状态由 role="switch" + aria-checked 传达），两文本常驻 DOM 并以 CSS Grid 重叠，轨道宽度自适应较宽文本，切换时无宽度抖动。

## 无障碍

- 渲染为 role="switch" 的按钮，携带 aria-checked；禁用时携带 disabled，支持空格 / 回车切换。
