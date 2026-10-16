export type { CheckboxProps } from '@xui-design/core';

export { default as Checkbox } from './Checkbox.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 CheckboxRef 对齐） */
export interface CheckboxRef {
  focus: () => void;
  /** 切换选中状态（disabled 时忽略） */
  toggle: () => void;
}
