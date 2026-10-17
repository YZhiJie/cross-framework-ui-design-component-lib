---
title: 空状态 Empty
---

# 空状态 <span class="page-head__en">Empty</span> <span class="doc-tag">数据展示</span>

空数据 / 无结果时的占位展示，内置默认插画，支持自定义描述、插画与操作区。

## 功能特性

- 内置默认插画，description 提供描述文案（空白时不渲染描述，避免内置 i18n）
- image 插槽 / renderImage 自定义插画，default 插槽放置操作按钮

### 使用场景

- 列表无数据、搜索无结果、首次使用引导等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 描述与操作

默认插槽放置"去创建"等引导动作。

<ComponentDemo slug="empty" demo-id="basic" />

### 自定义插画与纯默认

image 插槽覆盖默认插画；不传 description 时仅展示插画。

<ComponentDemo slug="empty" demo-id="image" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="empty" kind="props" />

### Slots / 渲染回调

<ComponentApi slug="empty" kind="slots" />

## 注意事项

- 组件不内置任何文案，description 完全由使用方决定，便于国际化。

## 无障碍

- 空状态作为说明性区域，描述文本可被读屏朗读，装饰性插画标注为装饰图。
