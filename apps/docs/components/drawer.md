---
title: 抽屉 Drawer
---

# 抽屉 <span class="page-head__en">Drawer</span> <span class="doc-tag">基础组件</span>

从屏幕边缘滑出的抽屉面板，承载表单、详情等次级内容；支持四个方向、自定义尺寸、焦点陷阱 / 焦点恢复与 ref 命令式控制。

## 功能特性

- 受控 visible / 非受控 defaultVisible，Vue 端支持 v-model:visible
- placement 四个滑入方向：left / right / top / bottom（默认 right）
- size 自定义尺寸：左右方向为宽度，上下方向为高度（数字按 px，字符串原样输出，默认 378）
- mask 可关闭遮罩；maskClosable 遮罩点击关闭、closeOnEsc ESC 关闭
- 焦点陷阱：打开期间 Tab 循环约束在抽屉内（trapFocus 可关闭）；关闭后焦点恢复到打开前元素
- default / title / footer / closeIcon 插槽（React 对应 children / renderTitle / renderFooter / renderCloseIcon）
- 通过 ref 暴露 open() / close() / toggle() 命令式方法（类型 DrawerRef）

### 使用场景

- 表单编辑、详情查看、筛选面板等不打断主流程但需要较大展示面积的场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 受控抽屉

外部维护 visible 状态，footer 插槽自定义底部按钮。

<ComponentDemo slug="drawer" demo-id="basic" />

### 四个方向

placement 控制抽屉从左 / 右 / 上 / 下哪个边缘滑入。

<ComponentDemo slug="drawer" demo-id="placement" />

### ref 命令式控制

无需维护 visible，直接调用实例 open() / close() / toggle()。

<ComponentDemo slug="drawer" demo-id="ref" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="drawer" kind="props" />

### Events / 回调

<ComponentApi slug="drawer" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="drawer" kind="slots" />

### 命令式方法

<ComponentApi slug="drawer" kind="methods" />

## 注意事项

- footer 无默认按钮（与 Modal 不同），底部操作区完全由 footer 插槽接管。
- ref 实例类型为 DrawerRef，提供 open() / close() / toggle() 三个方法。
- size 作用于交叉轴：left/right 方向设置 width，top/bottom 方向设置 height。

## 无障碍

- 面板携带 role="dialog"（mask 开启时附加 aria-modal="true"）；打开时聚焦面板，Tab / Shift+Tab 循环约束在抽屉内。
- 关闭后焦点恢复到打开前的元素，键盘用户不会丢失位置；支持 ESC 关闭（closeOnEsc）。
