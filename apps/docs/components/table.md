---
title: 表格 Table
---

# 表格 <span class="page-head__en">Table</span> <span class="doc-tag">数据展示</span>

结构化数据表格，支持列定义、非受控排序、行选择、虚拟滚动、自定义单元格与空态。

## 功能特性

- columns 列定义 + dataSource 数据驱动，rowKey 指定行唯一键
- 列级排序：点击表头循环 升序 → 降序 → 取消（非受控内部排序）
- columns[].render(record, index) 自定义单元格内容（返回字符串）
- rowSelection 行选择：全选 / 半选联动、受控 selectedRowKeys、getCheckboxDisabled 禁用行
- virtual 虚拟滚动：1000+ 行仅渲染可视窗口，height / rowHeight 控制视口与行高
- onRowClick 行点击事件；className / style 自定义透传（支持 CSS 变量）
- stripe 斑马纹 / border 边框模式；空数据态支持插槽 / 回调覆盖

### 使用场景

- 列表页、详情面板、后台管理等结构化数据的展示场景。
- 大数据量表格浏览场景（配合 virtual 虚拟滚动，仅渲染可视窗口）。
- 需要勾选批量操作的列表场景（配合 rowSelection 行选择）。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础表格

列宽、对齐、斑马纹、边框与可排序列；点击"年龄"表头体验排序循环。

<ComponentDemo slug="table" demo-id="basic" />

### 自定义单元格与空态

render 返回自定义文本；无数据时通过插槽 / renderEmpty 渲染自定义空态。

<ComponentDemo slug="table" demo-id="custom" />

### 虚拟滚动与行选择

1000 行数据仅渲染可视窗口，滚动流畅；配合 rowSelection 勾选行，滚动时勾选状态保持。

<ComponentDemo slug="table" demo-id="virtual" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="table" kind="props" />

### Events / 回调

<ComponentApi slug="table" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="table" kind="slots" />

### 契约类型

**TableColumn**

```ts
type TableColumn = {
  key: string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (record: TableRow, index: number) => string;
};
```

列定义。width 数字按 px、字符串原样；render 返回字符串覆盖默认取值。

**TableSort**

```ts
type TableSort = {
  key: string;
  order: 'asc' | 'desc' | null;
};
```

排序事件载荷，order 为 null 表示已取消排序。

**TableRowSelection**

```ts
type TableRowSelection = {
  selectedRowKeys?: TableRowKey[];
  onChange?: (selectedRowKeys: TableRowKey[], selectedRows: TableRow[]) => void;
  getCheckboxDisabled?: (record: TableRow, index: number) => boolean;
};
```

行选择配置。提供 selectedRowKeys 即受控（内部状态不变，仅回调）；未全选含半选时点击全选选中全部可选行。

**TableRowKey**

```ts
type TableRowKey = string | number;
```

行唯一键（rowKey 字段取值）。

## 注意事项

- 非受控排序：排序状态由组件内部维护，外部仅通过 sortChange 感知，不修改传入的原数组。
- 排序比较：同为 number 按数值比较，否则按字符串（码点序）稳定排序。
- render 返回值仅支持字符串；单元格取值为 null / undefined 时显示为空字符串。
- 虚拟模式采用固定行高 + spacer 占位方案，保持原生 table 语义；行高必须与 rowHeight 一致。
- 行选择未提供 selectedRowKeys 时为非受控（内部维护）；禁用行（getCheckboxDisabled）不参与全选。

## 无障碍

- 可排序列表头携带 aria-sort（ascending / descending），未排序时省略。
- 表头使用 scope="col" 与数据行关联；全选框同步 indeterminate 半选语义。
