import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import ValidationVue from './demos/validation.vue';
import DynamicVue from './demos/dynamic.vue';
import LayoutVue from './demos/layout.vue';
import BasicReact from './demos/basic';
import ValidationReact from './demos/validation';
import DynamicReact from './demos/dynamic';
import LayoutReact from './demos/layout';

import basicVueSource from './demos/basic.vue?raw';
import validationVueSource from './demos/validation.vue?raw';
import dynamicVueSource from './demos/dynamic.vue?raw';
import layoutVueSource from './demos/layout.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import validationReactSource from './demos/validation.tsx?raw';
import dynamicReactSource from './demos/dynamic.tsx?raw';
import layoutReactSource from './demos/layout.tsx?raw';

export const formMeta: ComponentMeta = {
  name: 'Form',
  slug: 'form',
  title: '表单',
  category: 'form',
  summary: {
    'zh-CN':
      '功能完整的表单容器组件，支持字段注册、同步/异步校验、跨字段关联、条件校验、动态增删字段，以及禁用/只读/标签布局等场景。',
    'en-US':
      'A full-featured form container with field registration, sync/async validation, cross-field rules, conditional validation, dynamic add/remove fields, and disabled/readonly/label layout support.',
  },
  features: [
    {
      'zh-CN': 'Form + FormItem 复合容器，通过 provide/inject（Vue）或 Context（React）自动连接',
      'en-US':
        'Form + FormItem compound container; auto-connected via provide/inject (Vue) or Context (React)',
    },
    {
      'zh-CN': 'FormItem 通过 VNode 克隆自动注入 value / onChange / onBlur，子组件无需手动绑定',
      'en-US':
        'FormItem auto-injects value / onChange / onBlur via VNode cloning; no manual binding needed',
    },
    {
      'zh-CN': '内置校验规则：required / email / phone / number / length / regex / url / custom',
      'en-US':
        'Built-in validators: required / email / phone / number / length / regex / url / custom',
    },
    {
      'zh-CN': '支持同步与异步校验、条件校验（when）、跨字段关联校验（validator 可访问全部值）',
      'en-US':
        'Sync and async validation, conditional rules (when), cross-field validation (validator receives all values)',
    },
    {
      'zh-CN': '校验触发时机：change / blur / submit，可在规则级与表单级配置',
      'en-US': 'Validation triggers: change / blur / submit, configurable at rule and form level',
    },
    {
      'zh-CN':
        '通过 ref 暴露 validate / resetFields / getFieldValue / setFieldValue / clearValidate / submit 等命令式 API',
      'en-US':
        'Imperative API via ref: validate / resetFields / getFieldValue / setFieldValue / clearValidate / submit',
    },
    {
      'zh-CN': '支持表单禁用、只读、标签位置（left / right / top）、标签宽度自定义',
      'en-US':
        'Form-level disabled, readonly, label position (left / right / top), and custom label width',
    },
  ],
  scenarios: [
    {
      'zh-CN': '注册表单、设置表单、多步表单、条件表单、动态字段表单等场景。',
      'en-US':
        'Registration forms, settings forms, multi-step forms, conditional forms, dynamic field forms.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic Usage' },
      description: {
        'zh-CN': '使用 Form + FormItem 组合，配置 rules 校验，提交后触发回调。',
        'en-US':
          'Compose Form + FormItem, configure rules for validation, and handle submit callback.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'validation',
      title: { 'zh-CN': '复杂校验', 'en-US': 'Complex Validation' },
      description: {
        'zh-CN':
          '内置规则（required/email/phone/length）、跨字段关联（密码确认）、条件校验（when）。',
        'en-US':
          'Built-in rules (required/email/phone/length), cross-field validation (password confirm), conditional rules (when).',
      },
      vueComponent: ValidationVue,
      reactComponent: ValidationReact,
      vueSource: validationVueSource,
      reactSource: validationReactSource,
    },
    {
      id: 'dynamic',
      title: { 'zh-CN': '动态增删字段', 'en-US': 'Dynamic Fields' },
      description: {
        'zh-CN': '通过 v-for 循环渲染 FormItem，动态增删字段列表。',
        'en-US': 'Render FormItems via v-for loop, dynamically add/remove field items.',
      },
      vueComponent: DynamicVue,
      reactComponent: DynamicReact,
      vueSource: dynamicVueSource,
      reactSource: dynamicReactSource,
    },
    {
      id: 'layout',
      title: { 'zh-CN': '禁用 / 标签布局', 'en-US': 'Disabled / Label Layout' },
      description: {
        'zh-CN': 'disabled 禁用全部字段，labelPosition 切换标签位置（left / right / top）。',
        'en-US':
          'disabled disables all fields, labelPosition toggles label position (left / right / top).',
      },
      vueComponent: LayoutVue,
      reactComponent: LayoutReact,
      vueSource: layoutVueSource,
      reactSource: layoutReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'initialValues',
        type: 'Record<string, unknown>',
        default: '{}',
        description: {
          'zh-CN': '表单初始值（非受控模式下的字段初始值）',
          'en-US': 'Form initial values (non-controlled initial field values)',
        },
      },
      {
        name: 'rules',
        type: 'Record<string, ValidationRule[]>',
        default: '—',
        description: {
          'zh-CN': '字段级校验规则映射（key 为字段名）',
          'en-US': 'Field-level validation rules map (key is field name)',
        },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '全局禁用', 'en-US': 'Disable all fields' },
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '全局只读', 'en-US': 'Readonly for all fields' },
      },
      {
        name: 'labelWidth',
        type: 'string | number',
        default: '—',
        description: {
          'zh-CN': '标签宽度（数值按 px，字符串原样输出）',
          'en-US': 'Label width (number as px, string as-is)',
        },
      },
      {
        name: 'labelPosition',
        type: `'left' | 'right' | 'top'`,
        default: `'right'`,
        description: { 'zh-CN': '标签位置', 'en-US': 'Label position' },
      },
      {
        name: 'validateTrigger',
        type: `'change' | 'blur' | 'submit' | Array`,
        default: '—',
        description: { 'zh-CN': '校验触发时机', 'en-US': 'Validation trigger timing' },
      },
      {
        name: 'scrollToFirstError',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '校验失败时滚动到第一个错误字段',
          'en-US': 'Scroll to first error field on validation failure',
        },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '自定义类名', 'en-US': 'Custom class name' },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: { 'zh-CN': '自定义样式', 'en-US': 'Custom styles' },
      },
    ],
    events: [
      {
        vue: 'submit',
        react: 'onSubmit',
        payload: 'FormValues',
        description: { 'zh-CN': '提交（校验通过后）', 'en-US': 'Submit (after validation passes)' },
      },
      {
        vue: 'submitFail',
        react: 'onSubmitFail',
        payload: 'FormErrors',
        description: { 'zh-CN': '校验失败', 'en-US': 'Validation failed' },
      },
      {
        vue: 'valuesChange',
        react: 'onValuesChange',
        payload: '(changed, all)',
        description: { 'zh-CN': '字段值变更', 'en-US': 'Field value changed' },
      },
    ],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: {
          'zh-CN': '表单内容（FormItem 列表）',
          'en-US': 'Form content (FormItem list)',
        },
      },
      {
        vue: 'actions',
        react: '—',
        description: { 'zh-CN': '底部操作区域', 'en-US': 'Bottom actions area' },
      },
    ],
    methods: [
      {
        name: 'validate',
        signature: '(trigger?: ValidationTrigger) => Promise<FormValidationResult>',
        description: { 'zh-CN': '校验全部字段', 'en-US': 'Validate all fields' },
      },
      {
        name: 'validateField',
        signature: '(name: string, trigger?) => Promise<string[]>',
        description: { 'zh-CN': '校验指定字段', 'en-US': 'Validate a specific field' },
      },
      {
        name: 'getFieldValue',
        signature: '(name: string) => unknown',
        description: { 'zh-CN': '获取字段值', 'en-US': 'Get field value' },
      },
      {
        name: 'getFieldsValue',
        signature: '() => FormValues',
        description: { 'zh-CN': '获取全部字段值', 'en-US': 'Get all field values' },
      },
      {
        name: 'setFieldValue',
        signature: '(name: string, value: unknown) => void',
        description: { 'zh-CN': '设置字段值', 'en-US': 'Set field value' },
      },
      {
        name: 'setFieldsValue',
        signature: '(values: FormValues) => void',
        description: { 'zh-CN': '批量设置字段值', 'en-US': 'Batch set field values' },
      },
      {
        name: 'resetFields',
        signature: '(names?: string[]) => void',
        description: { 'zh-CN': '重置字段', 'en-US': 'Reset fields' },
      },
      {
        name: 'clearValidate',
        signature: '(names?: string[]) => void',
        description: { 'zh-CN': '清除校验错误', 'en-US': 'Clear validation errors' },
      },
      {
        name: 'submit',
        signature: '() => Promise<FormValidationResult>',
        description: { 'zh-CN': '提交表单', 'en-US': 'Submit the form' },
      },
    ],
    types: [
      {
        name: 'ValidationRule',
        definition: `type ValidationRule = {
  type?: 'required' | 'email' | 'phone' | 'number' | 'length' | 'regex' | 'url' | 'custom'
  message?: string
  trigger?: 'change' | 'blur' | 'submit'
  min?: number        // number/length 最小值
  max?: number        // number/length 最大值
  exact?: number      // 精确值/长度
  pattern?: string | RegExp  // regex 正则
  validator?: (value: unknown, values: FormValues) => boolean | string | Promise<boolean | string>
  when?: (values: FormValues) => boolean  // 条件校验
}`,
        description: {
          'zh-CN': '校验规则定义（validator 返回 true 表示通过，返回 string 表示错误信息）',
          'en-US': 'Validation rule definition (validator returns true for pass, string for error)',
        },
      },
      {
        name: 'FormItemProps',
        definition: `type FormItemProps = {
  name?: string         // 字段名（对应 rules/initialValues 的 key）
  label?: string        // 标签文本
  rules?: ValidationRule[]  // 字段级规则
  required?: boolean    // 是否必填（影响星号显示）
  trigger?: ValidationTrigger | ValidationTrigger[]  // 本字段校验触发
  validateFirst?: boolean  // 仅显示第一条错误
  hidden?: boolean     // 是否隐藏
  extra?: string        // 额外提示
  labelAlign?: 'left' | 'right'
}`,
        description: {
          'zh-CN': 'FormItem 属性',
          'en-US': 'FormItem props',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        'FormItem 通过 VNode 克隆自动注入 value 和事件，无需手动绑定——只需用 <FormItem name="xxx"> 包裹子组件即可。',
      'en-US':
        'FormItem auto-injects value and events via VNode cloning—no manual binding needed. Just wrap child components with <FormItem name="xxx">.',
    },
    {
      'zh-CN':
        '所有 XUI 表单组件（Input / Select / Checkbox / Switch / DatePicker 等）统一使用 value 作为受控 prop，因此 FormItem 可自动注入。',
      'en-US':
        'All XUI form components (Input / Select / Checkbox / Switch / DatePicker) use value as the controlled prop, enabling auto-injection.',
    },
    {
      'zh-CN': 'submit 触发时机执行所有规则（忽略 trigger 过滤）；change / blur 仅执行匹配的规则。',
      'en-US':
        'submit executes all rules (bypasses trigger filter); change / blur only execute matching rules.',
    },
    {
      'zh-CN': 'rules 可在 Form 级和 FormItem 级同时配置，合并执行（FormItem 规则优先在前）。',
      'en-US':
        'rules can be configured at both Form and FormItem level; merged with FormItem rules first.',
    },
  ],
  a11y: [
    {
      'zh-CN': '渲染为原生 <form> 元素，标签使用 <label> 包裹，保留原生提交行为。',
      'en-US':
        'Renders as a native <form> element with <label> wrapping, preserving native submit behavior.',
    },
  ],
};
