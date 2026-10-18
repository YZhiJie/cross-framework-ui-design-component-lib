---
title: 日期选择 DatePicker
---

# 日期选择 <span class="page-head__en">DatePicker</span> <span class="doc-tag">表单交互</span>

点击弹出月历面板选择单个日期，值统一为 YYYY-MM-DD 字符串，零日期依赖。

## 功能特性

- 受控 / 非受控双模式，Vue 端支持 v-model:value
- 值格式统一为 'YYYY-MM-DD' 字符串（序列化友好），非法值回退 null
- 月历面板支持上个月 / 下个月切换（跨年自动滚动），42 格完整周视图
- 面板采用草稿 + 确认 / 取消模式：点选仅更新草稿，点击确认才提交值，取消或点击外部丢弃草稿
- clearable 清空、disabled 禁用；确认、取消或点击外部后自动收起

### 使用场景

- 生日、预约、查询时间范围等需要选择某一天的表单场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 受控选择

外部维护 YYYY-MM-DD 字符串，可一键清空。

<ComponentDemo slug="date-picker" demo-id="basic" />

### 默认值与禁用

defaultValue 定位初始日期；disabled 下不可打开面板。

<ComponentDemo slug="date-picker" demo-id="state" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="date-picker" kind="props" />

### Events / 回调

<ComponentApi slug="date-picker" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="date-picker" kind="slots" />

## 注意事项

- 契约只接受 / 输出 'YYYY-MM-DD' 字符串，不引入 Date 对象；非法字符串回退为 null。
- 面板打开时视图自动定位到选中日期所在月份，无选中值时定位到当前月。

## 无障碍

- 日期按钮可通过键盘聚焦与选择，月份切换与日期格具备可读的文本语义。
