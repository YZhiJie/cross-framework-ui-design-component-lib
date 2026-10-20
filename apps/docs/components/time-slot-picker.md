---
title: 投放时段 TimeSlotPicker
---

# 投放时段 <span class="page-head__en">TimeSlotPicker</span> <span class="doc-tag">表单交互</span>

热力图形式的时段选择器，支持按日、周、月、年四种粒度选择，点击切换 + 拖拽矩形框选。

## 功能特性

- 支持四种粒度切换：日（小时格）/ 周（周 × 小时格）/ 月（日历格）/ 年（整年热力图）
- 两种选择交互：点击切换单个，按住鼠标拖拽按矩形区域批量选中/取消（锚点与当前格子围成矩形，mouseup 提交）
- 受控 / 非受控双模式兼容，支持 v-model / value + onValueChange 两种绑定形式
- 参考日期决定月视图和年视图，默认参考当天日期
- 底部可选显示统计与图例，显示当前粒度下已选 / 总格子数
- 提供命令式 API 供外部操作：clear / selectAll / toggle

### 使用场景

- 广告投放时段选择、预约可预约时段、排班表时段选择
- 统计热力图形式的日期/时段勾选

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

四种粒度切换，点击切换单个时段，或按住鼠标拖拽矩形区域批量选中/取消，支持 v-model 双向绑定。

<ComponentDemo slug="time-slot-picker" demo-id="basic" />

### 命令式 API

通过 ref 调用 selectAll 全选当前月份，clear 清空所有选择。

<ComponentDemo slug="time-slot-picker" demo-id="actions" />

### 矩形框选

月视图中按住鼠标拖拽，锚点与当前格子围成矩形并半透明预览，松开鼠标后一次性提交；从已选格子开始拖拽则批量取消。

<ComponentDemo slug="time-slot-picker" demo-id="rectangle" />

### 非受控用法

通过 defaultValue 设置初始值，组件内部维护选中状态，仅通过 change / onChange 向外通知；配合 showFooter=false 隐藏底部统计。

<ComponentDemo slug="time-slot-picker" demo-id="uncontrolled" />

### 禁用与自定义样式

disabled 禁用全部交互；通过 style 传入组件级 CSS 变量，可单独调整格子尺寸、间距与主题色，不影响其他实例。

<ComponentDemo slug="time-slot-picker" demo-id="custom" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="time-slot-picker" kind="props" />

### Events / 回调

<ComponentApi slug="time-slot-picker" kind="events" />

### 命令式方法

<ComponentApi slug="time-slot-picker" kind="methods" />

## 注意事项

- key 格式规则：day → `h:HH`；week → `w:W:HH`；month/year → `YYYY-MM-DD`。
- 矩形框选：按下鼠标的格子作为锚点，与当前悬停格子围成矩形；拖拽期间以半透明预览，松开鼠标后一次性提交。锚点为未选 → 矩形内全部选中；锚点已选 → 矩形内全部取消。
- 年份视图为周一开头的列布局，第一行是周一，最后一行是周日，列头标注每个月第一天所在列。

## 无障碍

- 根节点 role=group，aria-label 标注区域；每个格子为 button 元素，aria-pressed 表示选中状态；键盘可聚焦切换。
