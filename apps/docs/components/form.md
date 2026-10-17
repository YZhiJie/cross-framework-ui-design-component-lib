---
title: 表单 Form
---

# 表单 <span class="page-head__en">Form</span> <span class="doc-tag">表单交互</span>

功能完整的表单容器组件，支持字段注册、同步/异步校验、跨字段关联、条件校验、动态增删字段，以及禁用/只读/标签布局等场景。

## 功能特性

- Form + FormItem 复合容器，通过 provide/inject（Vue）或 Context（React）自动连接
- FormItem 通过 VNode 克隆自动注入 value / onChange / onBlur，子组件无需手动绑定
- 内置校验规则：required / email / phone / number / length / regex / url / custom
- 支持同步与异步校验、条件校验（when）、跨字段关联校验（validator 可访问全部值）
- 校验触发时机：change / blur / submit，可在规则级与表单级配置
- 通过 ref 暴露 validate / resetFields / getFieldValue / setFieldValue / clearValidate / submit 等命令式 API
- 支持表单禁用、只读、标签位置（left / right / top）、标签宽度自定义

### 使用场景

- 注册表单、设置表单、多步表单、条件表单、动态字段表单等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

使用 Form + FormItem 组合，配置 rules 校验，提交后触发回调。

<ComponentDemo slug="form" demo-id="basic" />

### 复杂校验

内置规则（required/email/phone/length）、跨字段关联（密码确认）、条件校验（when）。

<ComponentDemo slug="form" demo-id="validation" />

### 动态增删字段

通过 v-for 循环渲染 FormItem，动态增删字段列表。

<ComponentDemo slug="form" demo-id="dynamic" />

### 禁用 / 标签布局

disabled 禁用全部字段，labelPosition 切换标签位置（left / right / top）。

<ComponentDemo slug="form" demo-id="layout" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="form" kind="props" />

### Events / 回调

<ComponentApi slug="form" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="form" kind="slots" />

### 命令式方法

<ComponentApi slug="form" kind="methods" />

### 契约类型

**ValidationRule**

```ts
type ValidationRule = {
  type?: 'required' | 'email' | 'phone' | 'number' | 'length' | 'regex' | 'url' | 'custom'
  message?: string
  trigger?: 'change' | 'blur' | 'submit'
  min?: number        // number/length 最小值
  max?: number        // number/length 最大值
  exact?: number      // 精确值/长度
  pattern?: string | RegExp  // regex 正则
  validator?: (value: unknown, values: FormValues) => boolean | string | Promise<boolean | string>
  when?: (values: FormValues) => boolean  // 条件校验
}
```

校验规则定义（validator 返回 true 表示通过，返回 string 表示错误信息）

**FormItemProps**

```ts
type FormItemProps = {
  name?: string         // 字段名（对应 rules/initialValues 的 key）
  label?: string        // 标签文本
  rules?: ValidationRule[]  // 字段级规则
  required?: boolean    // 是否必填（影响星号显示）
  trigger?: ValidationTrigger | ValidationTrigger[]  // 本字段校验触发
  validateFirst?: boolean  // 仅显示第一条错误
  hidden?: boolean     // 是否隐藏
  extra?: string        // 额外提示
  labelAlign?: 'left' | 'right'
}
```

FormItem 属性

## 注意事项

- FormItem 通过 VNode 克隆自动注入 value 和事件，无需手动绑定——只需用 &lt;FormItem name="xxx"&gt; 包裹子组件即可。
- 所有 XUI 表单组件（Input / Select / Checkbox / Switch / DatePicker 等）统一使用 value 作为受控 prop，因此 FormItem 可自动注入。
- submit 触发时机执行所有规则（忽略 trigger 过滤）；change / blur 仅执行匹配的规则。
- rules 可在 Form 级和 FormItem 级同时配置，合并执行（FormItem 规则优先在前）。

## 无障碍

- 渲染为原生 &lt;form&gt; 元素，标签使用 &lt;label&gt; 包裹，保留原生提交行为。
