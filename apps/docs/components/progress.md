---
title: 进度条 Progress
---

# 进度条 <span class="page-head__en">Progress</span> <span class="doc-tag">数据展示</span>

展示任务进度百分比，支持线性与环形两种形态及成功 / 失败状态色。

## 功能特性

- type 支持 'line' 线性与 'circle' 环形（SVG 描边）
- percent 自动收敛到 [0, 100]，非数值按 0 处理
- status 支持 normal / success / error；percent 达到 100 且未显式指定时自动派生 success
- strokeWidth 自定义条粗 / 描边宽度，showText 控制百分比文本

### 使用场景

- 文件上传 / 下载、任务处理进度、加载完成度展示等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 线性与环形

同一百分比驱动 line 与 circle 两种形态，按钮模拟进度变化。

<ComponentDemo slug="progress" demo-id="basic" />

### 成功与失败状态

100% 默认派生 success；显式 status="error" 显示失败色。

<ComponentDemo slug="progress" demo-id="status" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="progress" kind="props" />

### 契约类型

**ProgressStatus**

```ts
type ProgressType = 'line' | 'circle'
type ProgressStatus = 'normal' | 'success' | 'error'
```

进度条形态与状态枚举。

## 注意事项

- 纯展示组件，无事件；达到 100% 时若未显式传入 status，颜色自动切换为成功色。

## 无障碍

- 进度根节点携带进度百分比语义（role="progressbar" 及 aria-valuenow / min / max）。
