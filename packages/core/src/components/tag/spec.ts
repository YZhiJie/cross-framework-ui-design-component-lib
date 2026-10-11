/**
 * Tag 组件规格
 *
 * useLogic 指向 @xui/shared 的 createTagLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createTagLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { TagEvents, TagLogic, TagProps, TagSlots } from './types';

export const tagSpec = {
  name: 'Tag',
  props: {
    type: {
      type: String,
      size: String,
      closable: Boolean,
      className: String,
      style: Object,
      onClose: Function,
    },
    defaults: {
      type: 'default',
      size: 'md',
      closable: false,
    },
  },
  events: {
    close: { description: '点击关闭按钮时触发（组件随后隐藏）' },
  },
  slots: {
    default: { description: '标签内容' },
  },
  useLogic: (props: TagProps) =>
    createTagLogic({
      closable: props.closable,
      onClose: props.onClose,
    }),
} satisfies ComponentSpec<TagProps, TagEvents, TagSlots, TagLogic>;
