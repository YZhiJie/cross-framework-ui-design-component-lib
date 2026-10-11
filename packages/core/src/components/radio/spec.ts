/**
 * Radio 组件规格
 *
 * useLogic 指向 @xui/shared 的 createRadioLogic 逻辑工厂。
 * Radio 通过组上下文（Vue provide/inject、React Context）受 RadioGroup 控制，
 * 选中变更统一由 RadioGroup 触发 change 事件，本组件无契约事件。
 */

import { createRadioLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { RadioEvents, RadioLogic, RadioProps, RadioSlots } from './types';

export const radioSpec = {
  name: 'Radio',
  props: {
    type: {
      value: String,
      disabled: Boolean,
    },
    defaults: {
      disabled: false,
    },
  },
  events: {},
  slots: {
    default: { description: '选项文案' },
  },
  useLogic: (props: RadioProps) =>
    createRadioLogic({
      disabled: props.disabled,
    }),
} satisfies ComponentSpec<RadioProps, RadioEvents, RadioSlots, RadioLogic>;
