---
title: 警告提示 Alert
---

# 警告提示 <span class="page-head__en">Alert</span> <span class="doc-tag">反馈提示</span>

静态内嵌的提示横幅，用于展示需用户关注的信息，支持四种语义、图标与关闭。

## 功能特性

- 四种语义类型：info / success / warning / error
- title 标题 + description 描述（描述也可用默认插槽 / children）
- showIcon 显示类型图标，closable 可手动关闭（隐藏后触发 close）
- title / icon 均提供插槽，可完全自定义（React 对应 renderTitle / renderIcon）

### 使用场景

- 表单校验汇总、页面级通知、操作后果说明等常驻提示场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 四种语义

通过 type 切换 info / success / warning / error 配色与语义。

<ComponentDemo slug="alert" demo-id="basic" />

### 图标 / 关闭 / 自定义标题

showIcon + closable，标题通过 title 插槽自定义。

<ComponentDemo slug="alert" demo-id="closable" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="alert" kind="props" />

### Events / 回调

<ComponentApi slug="alert" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="alert" kind="slots" />

## 注意事项

- Alert 为页面内静态提示（非浮层）；需要自动消失的全局浮层请使用 Message。

## 无障碍

- 提示区域按类型携带 role="status" / "alert" 等语义，关闭按钮可键盘操作。
