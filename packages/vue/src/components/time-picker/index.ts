export type { TimePickerProps } from '@xui-design/core';

export { default as TimePicker } from './TimePicker.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 TimePickerRef 对齐） */
export interface TimePickerRef {
  /** 聚焦触发器 */
  focus: () => void;
  /** 切换面板展开/收起（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
}
