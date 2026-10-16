export type { TooltipProps } from '@xui-design/core';

export { default as Tooltip } from './Tooltip.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 TooltipRef 对齐） */
export interface TooltipRef {
  /** 显示提示框（disabled 时不展开） */
  show: () => void;
  /** 隐藏提示框（未展开时为 no-op） */
  hide: () => void;
}
