---
title: 标签 Tag
---

# 标签 <span class="page-head__en">Tag</span> <span class="doc-tag">数据展示</span>

用于标记和分类的小型标签，支持五种语义类型、两种尺寸与可关闭交互。

## 功能特性

- 五种语义类型：default / primary / success / warning / danger
- sm / md 两种尺寸
- closable 显示关闭按钮，点击后组件自动隐藏并触发 close

### 使用场景

- 分类标记、可删除的筛选条件、状态简要标识等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 语义类型

通过 type 切换五种内置色彩语义。

<ComponentDemo slug="tag" demo-id="basic" />

### 可关闭标签

closable 标签关闭后自动隐藏；由外部在 close 中同步数据源。

<ComponentDemo slug="tag" demo-id="closable" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="tag" kind="props" />

### Events / 回调

<ComponentApi slug="tag" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="tag" kind="slots" />

## 注意事项

- 点击关闭后组件内部先隐藏再回调；如需"恢复显示"（如重置示例），需重新挂载组件（Vue 用 key、React 重挂载）。

## 无障碍

- 关闭按钮具备按钮语义与可读的"关闭"文本，键盘可聚焦操作。
