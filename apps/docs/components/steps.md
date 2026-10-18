---
title: 步骤条 Steps
---

# 步骤条 <span class="page-head__en">Steps</span> <span class="doc-tag">导航布局</span>

引导用户按流程完成任务的导航条，支持水平/垂直两种布局、点击切换步骤与 error 状态标记。

## 功能特性

- 状态自动推导：小于当前 finish（对勾）、等于 process、大于 wait
- status 覆盖当前步骤状态（error 标记出错步骤）
- 水平 / 垂直两种布局方向
- 点击非禁用步骤切换，配合受控 value 驱动外部流程
- 双端命令式 API：next / prev / goTo（禁用目标 no-op）
- 受控/非受控双模式（value + onChange 约定）

### 使用场景

- 注册、支付等多步流程引导
- 物流跟踪、审批流等垂直时间线展示
- 向导式表单分步填写

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

受控 value 驱动当前步骤，点击步骤标题亦可切换；status="error" 将当前步骤标记为出错（渲染叉图标）。

<ComponentDemo slug="steps" demo-id="basic" />

### 垂直步骤条

direction="vertical" 切换为垂直布局，连接线转为纵向，适合时间线类展示。

<ComponentDemo slug="steps" demo-id="vertical" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="steps" kind="props" />

### Events / 回调

<ComponentApi slug="steps" kind="events" />

### 命令式方法

<ComponentApi slug="steps" kind="methods" />

### 契约类型

**StepItem**

```ts
type StepItem = {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
};
```

步骤项结构；disabled 步骤点击与命令式切换均 no-op

## 注意事项

- 点击当前步骤本身不触发 change（重复选中 no-op）。
- next/prev 不会自动跳过禁用步骤：目标被禁用时保持不动，由业务层决定绕行。
- 连接线仅在相邻步骤间渲染，最后一项不渲染出线。

## 无障碍

- 根节点为 list 角色，步骤项为 listitem；当前步骤带 aria-current="step"，禁用步骤带 aria-disabled。
