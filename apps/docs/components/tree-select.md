---
title: 树选择 TreeSelect
---

# 树选择 <span class="page-head__en">TreeSelect</span> <span class="doc-tag">表单交互</span>

以树形结构展示选项的下拉选择器，适用于层级数据选择场景。单选点击节点即选中；多选模式提供勾选框与级联勾选。

## 功能特性

- 单选：点击节点即选中并收起面板，选中后展示节点文案
- 多选：勾选框 + 级联勾选，父级由后代叶子推导勾选态（半选），面板保持展开
- checkStrictly 开启父子独立勾选，关闭级联
- 已勾选项以标签展示，标签可单个移除，支持一键清空
- defaultExpandAll 默认展开全部节点
- 受控/非受控双模式（value + onChange 约定）
- 双端命令式 API：focus / toggleOpen / close
- 内置国际化（请选择文案跟随组件库语言）

### 使用场景

- 组织架构、行政区划等层级数据选择
- 多级分类筛选、权限点勾选
- 选项量大且具有明确父子关系的表单字段

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

单选模式下点击节点即选中并收起面板，支持 clearable 一键清空，disabled 节点不可选中。

<ComponentDemo slug="tree-select" demo-id="basic" />

### 多选与级联勾选

multiple 开启多选：面板内渲染勾选框，勾选父级自动级联全部非禁用后代（父级呈半选态），已勾选项以标签展示、可单个移除；checkStrictly 可关闭级联。

<ComponentDemo slug="tree-select" demo-id="multiple" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="tree-select" kind="props" />

### Events / 回调

<ComponentApi slug="tree-select" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="tree-select" kind="slots" />

### 命令式方法

<ComponentApi slug="tree-select" kind="methods" />

### 契约类型

**TreeNode**

```ts
type TreeNode = {
  key: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
};
```

树节点结构（与 Tree 组件一致）；disableCheckbox 仅禁用勾选框（多选模式生效）

## 注意事项

- 级联勾选口径与 Tree 组件一致：勾选父级联动全部非禁用后代，禁用后代计入父级勾选态推导分母（存在未勾选禁用后代时父级最多半选）。
- 单选模式点击父级节点同样会选中该父级（与 antd TreeSelect 口径一致）。
- 多选模式下标签列表展示全部勾选 keys（含级联产生的后代 keys），移除标签复用级联语义。
- 清空按钮触发 onChange（单选 ''、多选 []）与 onClear，受控模式下可正常响应。

## 无障碍

- 触发器使用 combobox 角色，aria-expanded 标注展开状态，Enter/Space 切换、Escape 收起。
- 面板使用 dialog 角色并通过 aria-controls 关联触发器；树节点使用 tree/treeitem/group 角色，勾选框 aria-checked 支持 mixed 半选。
