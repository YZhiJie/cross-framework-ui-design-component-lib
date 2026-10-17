---
title: 对话框 Modal
---

# 对话框 <span class="page-head__en">Modal</span> <span class="doc-tag">基础组件</span>

模态对话框，承载需要用户明确处理的信息或操作；支持焦点陷阱 / 焦点恢复、自定义底部文案与受控、ref 命令式两种用法。

## 功能特性

- 受控 visible / 非受控 defaultVisible，Vue 端支持 v-model:visible
- title 标题、width 自定义宽度（数字按 px，字符串原样输出）
- closable 关闭按钮、maskClosable 遮罩点击关闭、closeOnEsc ESC 关闭
- 焦点陷阱：打开期间 Tab 循环约束在弹窗内（trapFocus 可关闭）；关闭后焦点恢复到打开前元素
- okText / cancelText 自定义默认底部按钮文案（未提供时取全局语言包，zh-CN 默认 确认 / 取消）
- default / title / footer 三个插槽（React 对应 children / renderTitle / renderFooter）
- 通过 ref 暴露 open() / close() 命令式方法（类型 ModalRef）

### 使用场景

- 操作确认、表单编辑、详情展示等需要打断主流程并聚焦用户注意力的场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 受控对话框

外部维护 visible 状态，footer 插槽自定义底部按钮。

<ComponentDemo slug="modal" demo-id="basic" />

### 自定义按钮文案

okText / cancelText 定制底部文案；ESC、遮罩、关闭按钮均可退出。

<ComponentDemo slug="modal" demo-id="custom" />

### ref 命令式打开

无需维护 visible，直接调用实例 open() / close()。

<ComponentDemo slug="modal" demo-id="ref" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="modal" kind="props" />

### Events / 回调

<ComponentApi slug="modal" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="modal" kind="slots" />

## 注意事项

- onOk / onCancel 触发后组件自动关闭；若使用自定义 footer，需自行调用 close() 或更新 visible。
- ref 实例类型为 ModalRef，提供 open() 与 close() 两个方法。
- 自定义 footer 插槽时 okText / cancelText 不生效（底部完全由插槽接管）。
- trapFocus 打开且面板内无可聚焦元素时，焦点锁定在面板自身（tabindex=-1）。

## 无障碍

- 面板携带 role="dialog" + aria-modal="true"；打开时聚焦面板，Tab / Shift+Tab 循环约束在弹窗内。
- 关闭后焦点恢复到打开前的元素，键盘用户不会丢失位置；支持 ESC 关闭（closeOnEsc）。
