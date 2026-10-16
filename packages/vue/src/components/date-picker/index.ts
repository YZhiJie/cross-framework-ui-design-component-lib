export type { DatePickerProps } from '@xui-design/core';

export { default as DatePicker } from './DatePicker.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 DatePickerRef 对齐） */
export interface DatePickerRef {
  /** 聚焦触发器 */
  focus: () => void;
  /** 切换面板展开/收起（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
}
