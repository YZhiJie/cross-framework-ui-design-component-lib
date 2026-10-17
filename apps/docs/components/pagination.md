---
title: 分页 Pagination
---

# 分页 <span class="page-head__en">Pagination</span> <span class="doc-tag">导航布局</span>

数据分页导航，页码从 1 开始，自动计算总页数并收敛越界操作。

## 功能特性

- 受控 value / 非受控 defaultValue，页码从 1 开始，Vue 端支持 v-model:value
- total 总条数 + pageSize 每页条数（默认 10）自动计算总页数
- 上一页 / 下一页在边界自动 no-op，越界页码自动 clamp
- disabled 禁用整个分页器

### 使用场景

- 长列表 / 表格 / 搜索结果等数据量较大需要分页浏览的场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 受控分页

285 条数据、每页 10 条共 29 页，外部同步当前页码。

<ComponentDemo slug="pagination" demo-id="basic" />

### 每页条数与禁用

pageSize 改变分页粒度；disabled 下所有翻页操作无效。

<ComponentDemo slug="pagination" demo-id="variants" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="pagination" kind="props" />

### Events / 回调

<ComponentApi slug="pagination" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="pagination" kind="slots" />

## 注意事项

- 当前页超出总页数时（如 total 变小）会自动 clamp 到有效范围并触发一次 change。
- total 变化后总页数自动重算，无需外部维护页数。

## 无障碍

- 导航区域具备分页语义，页码按钮可键盘聚焦，当前页携带 aria-current，边界按钮自动禁用。
