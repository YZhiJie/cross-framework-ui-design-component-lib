/**
 * Form / FormItem 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createFormLogic 逻辑工厂。
 * FormItem 不持有独立逻辑实例——它通过 Form 的 provide/inject（Vue）
 * 或 Context（React）获取表单 context，本地仅维护渲染状态。
 */

import { createFormLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { LogicInstance } from '../../types';
import type {
  FormEvents,
  FormLogic,
  FormProps,
  FormSlots,
  FormItemEvents,
  FormItemProps,
  FormItemSlots,
  FormItemState,
} from './types';

export const formSpec = {
  name: 'Form',
  props: {
    type: {
      initialValues: Object,
      rules: Object,
      disabled: Boolean,
      readonly: Boolean,
      labelWidth: [String, Number],
      labelPosition: String,
      validateTrigger: [String, Array],
      scrollToFirstError: Boolean,
      className: String,
      style: Object,
      onSubmit: Function,
      onSubmitFail: Function,
      onValuesChange: Function,
    },
    defaults: {
      disabled: false,
      readonly: false,
      labelPosition: 'right',
      scrollToFirstError: false,
    },
  },
  events: {
    submit: { description: '表单提交（校验通过后触发）', payloadType: 'FormValues' },
    submitFail: { description: '提交校验失败', payloadType: 'FormErrors' },
    valuesChange: { description: '字段值变更', payloadType: 'FormValues' },
  },
  slots: {
    default: { description: '表单内容（FormItem 列表）' },
    actions: { description: '底部操作区域（提交按钮等）' },
  },
  useLogic: (props: FormProps) =>
    createFormLogic({
      initialValues: props.initialValues,
      rules: props.rules,
      disabled: props.disabled,
      readonly: props.readonly,
      validateTrigger: props.validateTrigger,
      onSubmit: props.onSubmit,
      onSubmitFail: props.onSubmitFail,
      onValuesChange: props.onValuesChange,
    }),
} satisfies ComponentSpec<FormProps, FormEvents, FormSlots, FormLogic>;

/** FormItem 逻辑形状（仅满足 ComponentSpec 约束，运行时通过 Form context 获取真实逻辑） */
type FormItemLogic = LogicInstance<FormItemProps, FormItemState>;

// FormItem 不持有独立 LogicInstance——通过 Form context 交互
// spec 仅为契约注册用途；适配层实现中 inject / useContext 获取真实逻辑
export const formItemSpec = {
  name: 'FormItem',
  props: {
    type: {
      name: String,
      label: String,
      rules: Array,
      required: Boolean,
      trigger: [String, Array],
      validateFirst: Boolean,
      hidden: Boolean,
      extra: String,
      labelAlign: String,
      className: String,
      style: Object,
    },
    defaults: {
      required: false,
      validateFirst: false,
      hidden: false,
      labelAlign: 'right',
    },
  },
  events: {
    change: { description: '字段值变更', payloadType: 'unknown' },
    blur: { description: '字段失焦', payloadType: 'unknown' },
  },
  slots: {
    default: { description: '表单控件' },
    label: { description: '自定义标签' },
    error: { description: '自定义错误提示' },
    extra: { description: '自定义额外提示' },
  },
  // FormItem 不通过 useLogic 创建独立实例——运行时从 Form context 获取
  useLogic: () => {
    throw new Error('FormItem does not own a logic instance; use Form context instead.');
  },
} satisfies ComponentSpec<FormItemProps, FormItemEvents, FormItemSlots, FormItemLogic>;
