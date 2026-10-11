/**
 * Tooltip 组件规格
 *
 * useLogic 指向 @xui/shared 的 createTooltipLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * placement / trigger 为纯展示配置，由适配层直接读取 Props，
 * 逻辑层仅管理 open / disabled 状态。
 */

import { createTooltipLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { TooltipEvents, TooltipLogic, TooltipProps, TooltipSlots } from './types';

export const tooltipSpec = {
  name: 'Tooltip',
  props: {
    type: {
      content: String,
      placement: String,
      trigger: String,
      disabled: Boolean,
      className: String,
      style: Object,
    },
    defaults: {
      placement: 'top',
      trigger: 'hover',
      disabled: false,
    },
  },
  events: {},
  slots: {
    default: { description: '触发元素' },
    content: { description: '提示内容（覆盖 content prop）' },
  },
  useLogic: (props: TooltipProps) =>
    createTooltipLogic({
      disabled: props.disabled,
    }),
} satisfies ComponentSpec<TooltipProps, TooltipEvents, TooltipSlots, TooltipLogic>;
