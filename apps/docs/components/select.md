---
title: 下拉选择 Select
---

# 下拉选择 <span class="page-head__en">Select</span> <span class="doc-tag">表单交互</span>

从弹出的选项面板中选择值，支持单选 / 多选 / 可搜索 / 虚拟滚动，键盘操作与 ARIA 语义完整。

## 功能特性

- 受控 / 非受控双模式，Vue 端支持 v-model:value
- multiple 多选：选中值为 string[]，点击选项切换选中且面板不关闭，tag 可单独移除
- searchable 可搜索：面板顶部搜索框按选项文案过滤（大小写不敏感）
- virtual 虚拟滚动：1000+ 选项仅渲染可视窗口，maxHeight 控制面板视口高度
- clearable 已选中时显示清空按钮（多选清空全部）；disabled 整体禁用
- 键盘支持：上下方向键移动高亮（跳过禁用项）、Enter 确认、Esc 关闭
- 分组选项：options 支持 SelectOptionGroup 混合结构，分组内选项统一展示

### 使用场景

- 选项数量较多、不适合用 Radio 平铺的单选 / 多选表单字段。
- 选项上千条的大数据量选择场景（配合 virtual 虚拟滚动）。
- 需要按文案快速定位选项的检索式选择场景（配合 searchable）。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 受控与清空

options 中可对单项设置 disabled；clearable 支持一键清空。

<ComponentDemo slug="select" demo-id="basic" />

### 默认值与禁用

defaultValue 指定初始选中；disabled 禁用整个选择器。

<ComponentDemo slug="select" demo-id="state" />

### 多选 / 可搜索 / 虚拟滚动

multiple 以 tag 展示选中项；searchable 按文案过滤；virtual 渲染 1000 项仅维护可视窗口。

<ComponentDemo slug="select" demo-id="advanced" />

### 分组选项

options 传入 SelectOptionGroup 结构，分组内选项统一展示，支持分组级 disabled。

<ComponentDemo slug="select" demo-id="grouped" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="select" kind="props" />

### Events / 回调

<ComponentApi slug="select" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="select" kind="slots" />

### 契约类型

**SelectOption**

```ts
interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}
```

下拉选项配置。

**SelectOptionGroup**

```ts
interface SelectOptionGroup {
  label: string
  options: SelectOption[]
  disabled?: boolean
}
```

下拉选项分组配置。

**SelectSource**

```ts
type SelectSource = (SelectOption | SelectOptionGroup)[];
```

options 数据源：支持扁平选项数组或分组混合。

**SelectValue**

```ts
type SelectValue = string | string[];
```

选中值：单选为 string，多选为 string[]（向后兼容：单选行为与旧版一致）。

## 注意事项

- 禁用选项不响应点击与键盘高亮，选中禁用项的操作会被静默忽略。
- 点击组件外部会收起面板且不改变选中值；多选模式点击选项后面板保持展开。
- 虚拟模式要求选项行高固定（默认 30px，可用 CSS 变量 --xui-select-item-height 对齐调整）。
- 多选删除某个 tag 即切换取消该项，触发 onChange 携带最新数组。
- 自带视口避让：视口下方空间不足时面板自动向上展开（根元素加 is-drop-up），滚动与窗口 resize 时实时重算；overflow: hidden 祖先仍可能裁剪面板。

## 无障碍

- 选择器可通过 Tab 聚焦，方向键 / Enter / Esc 完成全部键盘操作；禁用项携带禁用语义。
- 多选面板携带 aria-multiselectable；搜索框独立 role=searchbox。
