---
title: Form
---

# Form <span class="page-head__en">表单</span> <span class="doc-tag">Form</span>

A full-featured form container with field registration, sync/async validation, cross-field rules, conditional validation, dynamic add/remove fields, and disabled/readonly/label layout support.

## Features

- Form + FormItem compound container; auto-connected via provide/inject (Vue) or Context (React)
- FormItem auto-injects value / onChange / onBlur via VNode cloning; no manual binding needed
- Built-in validators: required / email / phone / number / length / regex / url / custom
- Sync and async validation, conditional rules (when), cross-field validation (validator receives all values)
- Validation triggers: change / blur / submit, configurable at rule and form level
- Imperative API via ref: validate / resetFields / getFieldValue / setFieldValue / clearValidate / submit
- Form-level disabled, readonly, label position (left / right / top), and custom label width

### When to Use

- Registration forms, settings forms, multi-step forms, conditional forms, dynamic field forms.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic Usage

Compose Form + FormItem, configure rules for validation, and handle submit callback.

<ComponentDemo slug="form" demo-id="basic" />

### Complex Validation

Built-in rules (required/email/phone/length), cross-field validation (password confirm), conditional rules (when).

<ComponentDemo slug="form" demo-id="validation" />

### Dynamic Fields

Render FormItems via v-for loop, dynamically add/remove field items.

<ComponentDemo slug="form" demo-id="dynamic" />

### Disabled / Label Layout

disabled disables all fields, labelPosition toggles label position (left / right / top).

<ComponentDemo slug="form" demo-id="layout" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="form" kind="props" />

### Events / Callbacks

<ComponentApi slug="form" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="form" kind="slots" />

### Imperative Methods

<ComponentApi slug="form" kind="methods" />

### Contract Types

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

Validation rule definition (validator returns true for pass, string for error)

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

FormItem props

## Notes

- FormItem auto-injects value and events via VNode cloning—no manual binding needed. Just wrap child components with &lt;FormItem name="xxx"&gt;.
- All XUI form components (Input / Select / Checkbox / Switch / DatePicker) use value as the controlled prop, enabling auto-injection.
- submit executes all rules (bypasses trigger filter); change / blur only execute matching rules.
- rules can be configured at both Form and FormItem level; merged with FormItem rules first.

## Accessibility

- Renders as a native &lt;form&gt; element with &lt;label&gt; wrapping, preserving native submit behavior.
