---
title: 输入框 Input
---

# 输入框 <span class="page-head__en">Input</span> <span class="doc-tag">基础组件</span>

基础文本输入框，支持受控 / 非受控、清除按钮、前后缀与多种原生类型。

## 功能特性

- 受控 / 非受控双模式（提供 value 即受控），Vue 端支持 v-model:value
- 支持 text / password / number / email / search / tel / url 原生类型
- disabled 禁用、readonly 只读、maxLength 最大长度
- clearable 显示清除按钮；prefix / suffix 前后缀内容可定制
- 通过 ref 暴露 focus() 命令式聚焦

### 使用场景

- 表单文本录入、搜索框、带图标的复合输入等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 受控用法

绑定 value 同步外部状态，clearable 提供一键清空。

<ComponentDemo slug="input" demo-id="basic" />

### 禁用 / 只读 / 前缀

禁用与只读均透传原生属性；prefix 插槽可放置图标等前置内容。

<ComponentDemo slug="input" demo-id="state" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="input" kind="props" />

### Events / 回调

<ComponentApi slug="input" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="input" kind="slots" />

## 注意事项

- input 事件在每次键入时触发；change 事件在失焦或回车时触发，二者语义不同，注意按需监听。
- readonly 允许聚焦与复制但不可编辑，disabled 完全不可交互且不会随表单提交。

## 无障碍

- 渲染为原生 &lt;input&gt;，disabled / readonly 透传原生属性，保留原生焦点与键盘输入行为。
