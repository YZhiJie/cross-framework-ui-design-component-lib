---
title: 加载中 Spin
---

# 加载中 <span class="page-head__en">Spin</span> <span class="doc-tag">反馈提示</span>

加载状态指示器，可独立使用，也可包裹内容以遮罩形式表示区块加载。

## 功能特性

- size 支持 sm / md / lg（默认 md），tip 显示指示器下方提示文案
- 包裹内容时由 spinning 控制半透明遮罩显隐（默认 true）

### 使用场景

- 局部数据加载、按钮 / 卡片等待状态、全屏或区块加载占位等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 尺寸与提示

独立使用的三档指示器，tip 附带文字说明。

<ComponentDemo slug="spin" demo-id="basic" />

### 包裹内容

spinning 时在内容上覆盖遮罩并阻止交互，结束后恢复。

<ComponentDemo slug="spin" demo-id="wrapper" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="spin" kind="props" />

### Slots / 渲染回调

<ComponentApi slug="spin" kind="slots" />

## 注意事项

- 纯展示组件，无事件；指示器动画由样式驱动，可通过 prefers-reduced-motion 减弱。

## 无障碍

- 加载指示器携带 aria-live 区域与 busy 状态，读屏可感知"加载中"；tip 作为可朗读说明。
