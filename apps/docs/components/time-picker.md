---
title: 时间选择 TimePicker
---

# 时间选择 <span class="page-head__en">TimePicker</span> <span class="doc-tag">表单交互</span>

从时 / 分 / 秒三列面板中选择时间，值为 HH:mm:ss 格式字符串，支持步长与格式配置。

## 功能特性

- 受控 / 非受控双模式，值为 HH:mm:ss 字符串，Vue 端支持 v-model:value
- format 支持 HH:mm:ss（默认）与 HH:mm（隐藏秒列）
- hourStep / minuteStep / secondStep 自定义各列步长
- clearable 已选中时显示清空按钮；disabled 整体禁用

### 使用场景

- 需要精确选择时分秒的表单字段，如预约时间、日程时间。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

默认 HH:mm:ss 格式，三列滚动选择，支持 clearable。

<ComponentDemo slug="time-picker" demo-id="basic" />

### 格式与步长

format="HH:mm" 仅显示时分；hourStep=2，minuteStep=10。

<ComponentDemo slug="time-picker" demo-id="state" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="time-picker" kind="props" />

### Events / 回调

<ComponentApi slug="time-picker" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="time-picker" kind="slots" />

## 注意事项

- 值统一为 HH:mm:ss 字符串；当 format 为 HH:mm 时，秒固定为 00。
- 选中时间后面板自动收起；点击外部收起面板。

## 无障碍

- 触发器 role=combobox，面板 role=dialog；Enter/Space 展开，Esc 收起。
