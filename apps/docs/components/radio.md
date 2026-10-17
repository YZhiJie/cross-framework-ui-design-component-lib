---
title: 单选框 Radio
---

# 单选框 <span class="page-head__en">Radio</span> <span class="doc-tag">表单交互</span>

在一组互斥选项中选择一个，由 RadioGroup 管理选中值，Radio 作为子项；也支持 options 数组配置。

## 功能特性

- RadioGroup 受控 / 非受控双模式，Vue 端支持 v-model:value
- 两种渲染方式：Radio 子组件插槽，或 options 配置数组（二者取其一，options 优先）
- 支持整组 disabled 与单个选项 disabled（叠加生效）
- Radio 自身不维护状态、不发事件，选中统一由组上下文派生

### 使用场景

- 互斥条件选择、设置项中的单一选择、表单枚举字段等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### Radio 子组件

在 RadioGroup 默认插槽中放置 Radio，value 为选项取值。

<ComponentDemo slug="radio" demo-id="group" />

### options 配置与整组禁用

传入 options 数组即可渲染；disabled 作用于整组。

<ComponentDemo slug="radio" demo-id="options" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="radio" kind="props" />

### Events / 回调

<ComponentApi slug="radio" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="radio" kind="slots" />

### 契约类型

**RadioOption**

```ts
interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}
```

options 数组中的单项配置。

## 注意事项

- Radio 必须放在 RadioGroup 内使用，其选中态由组上下文决定，不要单独给 Radio 传 value 受控。
- options 模式下单项禁用通过该选项的 disabled: true 配置；插槽模式下在 &lt;Radio&gt; 上设置 disabled。

## 无障碍

- 组内选项使用原生 radio 语义并共享同一分组名，方向键可在组内移动选择。
