export type { SwitchProps } from '@xui-design/core';

export { default as Switch } from './Switch.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 SwitchRef 对齐） */
export interface SwitchRef {
  focus: () => void;
  /** 切换选中状态（disabled / loading 时忽略） */
  toggle: () => void;
}
