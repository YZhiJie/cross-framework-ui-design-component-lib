---
title: Table
---

# Table <span class="page-head__en">表格</span> <span class="doc-tag">Data Display</span>

A structured data table with column definitions, uncontrolled sorting, row selection, virtual scrolling, custom cells, and an empty state.

## Features

- Driven by columns definitions and dataSource, with rowKey as the unique row key
- Column sorting: clicking the header cycles ascending → descending → cleared (uncontrolled internal sorting)
- columns[].render(record, index) customizes cell content (returns a string)
- rowSelection row selection: linked select-all / indeterminate states, controlled selectedRowKeys, and getCheckboxDisabled for disabled rows
- virtual scrolling: 1000+ rows render only the visible window; height / rowHeight control the viewport and row height
- onRowClick row-click event; className / style pass-through customization (CSS variables supported)
- stripe zebra striping / border mode; the empty state can be overridden via slot / render callback

### When to Use

- Displaying structured data in list pages, detail panels, admin consoles, and more.
- Browsing large datasets (with virtual scrolling rendering only the visible window).
- Lists that need batch operations on checked rows (with rowSelection).

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic Table

Column width, alignment, zebra striping, borders, and sortable columns; click the "Age" header to try the sort cycle.

<ComponentDemo slug="table" demo-id="basic" />

### Custom Cells &amp; Empty State

render returns custom text; when there is no data, use the slot / renderEmpty to render a custom empty state.

<ComponentDemo slug="table" demo-id="custom" />

### Virtual Scrolling &amp; Row Selection

Only the visible window of 1000 rows is rendered for smooth scrolling; with rowSelection, checked state is preserved while scrolling.

<ComponentDemo slug="table" demo-id="virtual" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="table" kind="props" />

### Events / Callbacks

<ComponentApi slug="table" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="table" kind="slots" />

### Contract Types

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

Column definition. A numeric width is treated as px while strings are used as-is; render returns a string to override the default cell value.

**TableSort**

```ts
type TableSort = {
  key: string;
  order: 'asc' | 'desc' | null;
};
```

Sort event payload; order set to null means sorting has been cleared.

**TableRowSelection**

```ts
type TableRowSelection = {
  selectedRowKeys?: TableRowKey[];
  onChange?: (selectedRowKeys: TableRowKey[], selectedRows: TableRow[]) => void;
  getCheckboxDisabled?: (record: TableRow, index: number) => boolean;
};
```

Row selection config. Providing selectedRowKeys makes it controlled (internal state stays unchanged; callbacks only). When not all rows are selected (including the indeterminate state), clicking select-all selects every selectable row.

**TableRowKey**

```ts
type TableRowKey = string | number;
```

Unique row key (value of the rowKey field).

## Notes

- Uncontrolled sorting: sort state is maintained internally; the outside only observes it via sortChange, and the original array passed in is never mutated.
- Sort comparison: two numbers compare numerically; otherwise values are stably sorted as strings (by code point).
- render only supports returning strings; a cell value of null / undefined renders as an empty string.
- Virtual mode uses fixed row height plus a spacer placeholder while keeping native table semantics; the actual row height must match rowHeight.
- Row selection is uncontrolled (internally maintained) without selectedRowKeys; disabled rows (getCheckboxDisabled) are excluded from select-all.

## Accessibility

- Sortable column headers carry aria-sort (ascending / descending), omitted when unsorted.
- Headers use scope="col" to associate with data rows; the select-all checkbox syncs the indeterminate semantics.
