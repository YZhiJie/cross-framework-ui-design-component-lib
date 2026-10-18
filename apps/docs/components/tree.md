---
title: 树形控件 Tree
---

# 树形控件 <span class="page-head__en">Tree</span> <span class="doc-tag">数据展示</span>

以树形结构展示层级数据，支持展开/收起、单选选中与级联勾选。

## 功能特性

- 树形 data：通过 children 递归定义层级，节点 key 全树唯一，叶子节点无 children
- expandedKeys / checkedKeys / selectedKey 三组状态均支持受控与非受控，Vue 端支持 v-model:expanded-keys / v-model:checked-keys / v-model:selected-key
- defaultExpandAll 默认展开全部非叶子节点；defaultExpandedKeys 指定初始展开集合
- checkable 显示勾选框：父子级联勾选（禁用节点不参与）、半选状态推导、checkStrictly 父子独立
- disabled 整体禁用；节点可单独 disabled（整节点）或 disableCheckbox（仅勾选框）
- ref 命令式 API：expandAll / collapseAll / checkAll / uncheckAll，双端一致

### 使用场景

- 文件目录、组织架构、分类树等层级数据的展示与选择场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

树形 data 渲染层级结构，defaultExpandAll 展开全部，点击标题选中节点。

<ComponentDemo slug="tree" demo-id="basic" />

### 勾选模式

checkable 开启勾选框，勾选父级级联勾选全部非禁用后代；禁用节点不参与级联且计入父级半选推导。

<ComponentDemo slug="tree" demo-id="checkable" />

### 命令式操作

通过 ref 调用 expandAll / collapseAll / checkAll / uncheckAll，受控 checkedKeys 配合 v-model 同步。

<ComponentDemo slug="tree" demo-id="actions" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="tree" kind="props" />

### Events / 回调

<ComponentApi slug="tree" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="tree" kind="slots" />

### 命令式方法

<ComponentApi slug="tree" kind="methods" />

### 契约类型

**TreeNode**

```ts
interface TreeNode {
  key: string
  label: string
  children?: TreeNode[]
  disabled?: boolean
  disableCheckbox?: boolean
}
```

树节点（key 全树唯一；children 非空表示非叶子；disabled 禁用整节点；disableCheckbox 仅禁用勾选框）。

## 注意事项

- 三组状态（expandedKeys / checkedKeys / selectedKey）各自独立受控：提供对应 prop 即进入受控模式，未提供则内部自维护（可用 defaultXxx 指定初始值）。
- 级联勾选口径：勾选父级会勾选全部非禁用后代（含中间节点）；半选父级点击后勾选全部非禁用后代；取消已全选父级会移除全部后代勾选。禁用节点不参与级联勾选，但计入父级勾选态推导的分母——存在未勾选的禁用后代时父级最多显示半选。
- checkStrictly=true 时勾选父子完全独立，仅按自身 key 精确匹配，无级联与半选态。

## 无障碍

- 根容器 role=tree，节点 role=treeitem，子级容器 role=group；勾选框 role=checkbox（aria-checked 支持 mixed 半选态）；非叶子节点 aria-expanded 反映展开状态。
