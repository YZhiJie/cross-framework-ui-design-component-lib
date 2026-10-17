---
title: 复选框 Checkbox
---

# 复选框 <span class="page-head__en">Checkbox</span> <span class="doc-tag">表单交互</span>

在一组可选项中进行多选，或单独使用表示两种状态的切换，支持半选态。

## 功能特性

- 受控 / 非受控双模式，Vue 端支持 v-model:value
- indeterminate 半选态（常用于"全选"联动，点击后切换为全选）
- disabled 禁用；label 文案通过默认插槽 / children 传入

### 使用场景

- 协议勾选、条件筛选、表格行选择与全选联动等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 受控复选框

绑定布尔值，监听 change 获取切换后的选中状态。

<ComponentDemo slug="checkbox" demo-id="basic" />

### 半选态与禁用

indeterminate 表示"部分选中"；disabled 下点击无效。

<ComponentDemo slug="checkbox" demo-id="state" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="checkbox" kind="props" />

### Events / 回调

<ComponentApi slug="checkbox" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="checkbox" kind="slots" />

## 注意事项

- 半选（indeterminate）仅是视觉状态，表示"部分选中"；点击后半选消除并切换为全选。
- 实现"全选 / 全不选 / 半选"三态联动时，需由外部根据子项选中数量计算 indeterminate 与 value。

## 无障碍

- 底层使用原生 checkbox 输入语义，键盘空格可切换，禁用状态携带 disabled 属性。
