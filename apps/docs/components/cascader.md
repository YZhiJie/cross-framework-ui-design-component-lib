---
title: 级联选择 Cascader
---

# 级联选择 <span class="page-head__en">Cascader</span> <span class="doc-tag">表单交互</span>

从逐级展开的树形选项中选择一条路径，支持选到叶子或任意层级即触发。

## 功能特性

- 受控 / 非受控双模式，值为 string[]（从根到选中节点的值路径），Vue 端支持 v-model:value
- 树形 options：通过 children 递归定义层级，叶子节点无 children
- changeOnSelect 选中任意层级即触发 onChange（默认需选到叶子节点）
- separator 自定义路径展示分隔符（默认 " / "）；clearable 已选中时显示清空按钮
- disabled 整体禁用；选项可单独禁用（disabled: true）
- multiple 多选模式：value 为 string[][]，支持级联勾选（父子联动）、半选状态、全选/清空、标签管理
- checkStrictly 允许多选时选到任意层级（默认仅叶子节点可勾选）

### 使用场景

- 省市区、分类目录等具有层级关系的选择场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

树形 options，选到叶子节点触发 onChange；支持 clearable 与单项 disabled。

<ComponentDemo slug="cascader" demo-id="basic" />

### 任意层级选中与分隔符

changeOnSelect 选中任意层级即触发；separator 自定义路径分隔符。

<ComponentDemo slug="cascader" demo-id="state" />

### 多选模式

multiple 开启多选，value 为 string[][]；支持父子级联勾选、半选状态、全选/清空，已选项以标签展示可单独删除。

<ComponentDemo slug="cascader" demo-id="multiple" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="cascader" kind="props" />

### Events / 回调

<ComponentApi slug="cascader" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="cascader" kind="slots" />

### 契约类型

**CascaderOption**

```ts
interface CascaderOption {
  label: string
  value: string
  children?: CascaderOption[]
  disabled?: boolean
}
```

级联选项（树形结构，叶子节点无 children）。

## 注意事项

- value 为值路径数组（如 ["east", "hangzhou"]）；空数组表示未选中。多选时 value 为 string[][]（如 [["east","hangzhou"], ["north","beijing"]]）。
- 点击组件外部会收起面板；单选选中叶子节点后自动收起（changeOnSelect 时选中即收起）；多选面板保持展开。
- 多选模式下，勾选父节点会级联勾选所有后代叶子；子节点全选时父节点自动勾选（半选状态）。checkStrictly=true 时取消级联，可勾选任意层级。

## 无障碍

- 触发器 role=combobox，面板 role=dialog；Enter/Space 展开，Esc 收起。
