---
title: 下拉菜单 Dropdown
---

# 下拉菜单 <span class="page-head__en">Dropdown</span> <span class="doc-tag">导航布局</span>

把一组动作收纳到触发元素的下拉菜单里，支持悬停 / 点击两种触发方式、四方位弹出与视口避让。

## 功能特性

- trigger 支持悬停（默认，带 100ms 展开 / 150ms 收起防抖）与点击两种方式，收起后回调 select 并携带 key 与完整菜单项
- menu 数组驱动渲染：disabled 禁用项点击无效、danger 危险项红色文案、divided 分隔线、icon 内置图标
- placement 控制四方位弹出，空间不足自动翻转、溢出视口自动钳制，滚动与 resize 实时重算
- 点击菜单外部或按 Esc 仅收起菜单，不触发 select；onVisibleChange 通知展开 / 收起

### 使用场景

- 工具栏“更多操作”聚合、用户头像菜单、表格行操作过多需要收纳等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

悬停触发元素展开菜单，点击菜单项后收起并回调 select。

<ComponentDemo slug="dropdown" demo-id="basic" />

### 点击触发 / 菜单项变体 / 禁用

trigger 切换为点击，placement 右侧弹出；菜单项演示禁用、分隔线、危险项与图标；disabled 下悬停点击均无效。

<ComponentDemo slug="dropdown" demo-id="variants" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="dropdown" kind="props" />

### Events / 回调

<ComponentApi slug="dropdown" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="dropdown" kind="slots" />

## 注意事项

- hover 触发内置 100ms 展开 / 150ms 收起防抖，鼠标划过触发器与菜单之间 8px 间隙不会误收起；click 触发时悬停无效。
- 菜单为 CSS 包裹定位（同 Tooltip / Popconfirm），需注意父容器 overflow 裁剪；ref 命令式 API 提供 show / hide / toggle。
- icon 取值为 @xui-design/icons 的图标名（如 user / calendar / close），未知名静默忽略不渲染。

## 无障碍

- 菜单容器 role="menu"、菜单项 role="menuitem"，禁用项带 aria-disabled；Esc 可收起菜单。方向键在菜单项间移动暂未支持。
