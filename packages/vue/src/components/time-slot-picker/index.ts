export type { TimeSlotGranularity, TimeSlotPickerProps } from '@xui-design/core';

export { default as TimeSlotPicker } from './TimeSlotPicker.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 TimeSlotPickerRef 对齐） */
export interface TimeSlotPickerRef {
  /** 清空全部选中时段 */
  clear: () => void;
  /** 选中当前粒度下的全部时段 */
  selectAll: () => void;
  /** 切换指定时段 */
  toggle: (key: string) => void;
}
