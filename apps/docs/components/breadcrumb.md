---
title: 面包屑 Breadcrumb
---

# 面包屑 <span class="page-head__en">Breadcrumb</span> <span class="doc-tag">导航布局</span>

显示当前页面层级路径，支持链接项 / 可点击项与自定义分隔符。

## 功能特性

- items 配置层级，最后一项自动视为当前页（不可点击）
- item 存在 href 时渲染为 &lt;a&gt;，否则渲染为可点击 &lt;span&gt;；separator 自定义分隔符（默认 '/'）
- disabled 项与末项不触发 itemClick

### 使用场景

- 详情页层级返回、管理系统内容分区定位等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础与分隔符

末项为当前页；separator 可替换默认斜杠。

<ComponentDemo slug="breadcrumb" demo-id="basic" />

### 点击与禁用

无 href 的项点击触发 itemClick；disabled 项与末项被忽略。

<ComponentDemo slug="breadcrumb" demo-id="click" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="breadcrumb" kind="props" />

### Events / 回调

<ComponentApi slug="breadcrumb" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="breadcrumb" kind="slots" />

### 契约类型

**BreadcrumbItem**

```ts
interface BreadcrumbItem {
  label: string
  href?: string
  disabled?: boolean
}
```

面包屑层级项；href 存在渲染为链接。

## 注意事项

- 组件本身不拦截链接默认导航（对齐 Element Plus），SPA 内路由拦截由应用层负责。
- 在 hash 路由应用中若不希望改变地址，可省略 href，改用 itemClick 处理跳转。

## 无障碍

- 根节点使用 nav + aria-label="面包屑"，当前页以 aria-current 标识。
