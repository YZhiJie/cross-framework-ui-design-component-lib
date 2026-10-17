---
title: 数字输入框 InputNumber
---

# 数字输入框 <span class="page-head__en">InputNumber</span> <span class="doc-tag">表单交互</span>

通过步进按钮或直接键入输入数字，自动完成范围收敛、步长对齐与精度处理。

## 功能特性

- 受控 / 非受控双模式，值为 number | null（清空或非法输入为 null），Vue 端支持 v-model:value
- min / max 边界收敛，step 步长（非正数回退 1），上下步进按钮循环对齐
- precision 小数位数（0-20），提交时统一格式化；非法 / 越界输入自动回退或 clamp
- disabled 禁用与 placeholder 占位文本

### 使用场景

- 数量、金额、比例等需要精确数字输入与步进调节的场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 范围 / 步长 / 精度

0-10 范围、0.5 步长、两位小数，步进与键入都会自动收敛。

<ComponentDemo slug="input-number" demo-id="basic" />

### 非受控与禁用

defaultValue 提供初始值；越界值在提交时 clamp 到边界。

<ComponentDemo slug="input-number" demo-id="state" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="input-number" kind="props" />

### Events / 回调

<ComponentApi slug="input-number" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="input-number" kind="slots" />

## 注意事项

- 输入文本在失焦或回车时提交：空串 / 非法内容收敛为 null，合法值先 clamp 到 [min, max] 再按 precision 格式化。
- 步进结果始终是 step 的整数倍并按精度显示；到达边界继续步进为 no-op。

## 无障碍

- 步进按钮为可聚焦的原生按钮，输入区为 number 语义，禁用状态透传 disabled。
