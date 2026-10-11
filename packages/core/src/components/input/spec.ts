/**
 * Input 组件规格
 *
 * useLogic 指向 @xui/shared 的 createInputLogic 逻辑工厂。
 */

import { createInputLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { InputEvents, InputLogic, InputProps, InputSlots } from './types';

export const inputSpec = {
  name: 'Input',
  props: {
    type: {
      value: String,
      defaultValue: String,
      type: String,
      placeholder: String,
      disabled: Boolean,
      readonly: Boolean,
      maxLength: Number,
      clearable: Boolean,
      className: String,
      style: Object,
      onInput: Function,
      onChange: Function,
      onFocus: Function,
      onBlur: Function,
      onClear: Function,
    },
    defaults: {
      type: 'text',
      disabled: false,
      readonly: false,
      clearable: false,
    },
  },
  events: {
    input: { description: '输入时触发', payloadType: 'string' },
    change: { description: '值变更提交时触发（失焦或回车）', payloadType: 'string' },
    focus: { description: '获得焦点时触发', payloadType: 'FocusEvent' },
    blur: { description: '失去焦点时触发', payloadType: 'FocusEvent' },
    clear: { description: '点击清除图标时触发' },
  },
  slots: {
    prefix: { description: '前置内容' },
    suffix: { description: '后置内容' },
    clearIcon: { description: '清除图标（clearable 模式下生效）' },
  },
  useLogic: (props: InputProps) =>
    createInputLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      disabled: props.disabled,
      readonly: props.readonly,
      onInput: props.onInput,
      onChange: props.onChange,
      onFocus: props.onFocus,
      onBlur: props.onBlur,
      onClear: props.onClear,
    }),
} satisfies ComponentSpec<InputProps, InputEvents, InputSlots, InputLogic>;
