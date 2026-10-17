---
title: 标签页 Tabs
---

# 标签页 <span class="page-head__en">Tabs</span> <span class="doc-tag">导航布局</span>

在同一区域切换多个平级内容面板，配置化标签项，支持受控 / 非受控与键盘切换。

## 功能特性

- items 配置标签项（label / value / disabled），受控 value / 非受控 defaultValue
- 面板内容通过作用域插槽获取当前激活项：Vue #default="{ item }"，React renderPanel(item)
- 禁用标签不可激活；方向键在可用标签间循环移动

### 使用场景

- 表单分区、详情页多视图、设置项分类等内容平级切换场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 受控与禁用项

外部维护激活 value，disabled 标签不可点击也不参与键盘循环。

<ComponentDemo slug="tabs" demo-id="basic" />

### 非受控

仅提供 defaultValue 指定初始激活项，切换由组件内部管理。

<ComponentDemo slug="tabs" demo-id="uncontrolled" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="tabs" kind="props" />

### Events / 回调

<ComponentApi slug="tabs" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="tabs" kind="slots" />

### 契约类型

**TabItem**

```ts
interface TabItem {
  label: string
  value: string
  disabled?: boolean
}
```

标签页项配置。

## 注意事项

- Vue 端面板是 default 作用域插槽（#default="{ item }"），不存在名为 item 的具名插槽。
- 点击禁用标签与通过键盘切换时都会跳过禁用项。

## 无障碍

- 标签栏具备 tablist / tab 语义，aria-selected 标识激活项，左右方向键可切换焦点。
