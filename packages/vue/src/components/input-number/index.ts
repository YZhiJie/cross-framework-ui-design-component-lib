export type { InputNumberProps } from '@xui-design/core';

export { default as InputNumber } from './InputNumber.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 InputNumberRef 对齐） */
export interface InputNumberRef {
  /** 聚焦输入框 */
  focus: () => void;
  /** 使输入框失焦（会触发 blur 提交） */
  blur: () => void;
  /** 步进：direction 为 1（加 step）/ -1（减 step）；disabled / 值不变时 no-op */
  stepValue: (direction: 1 | -1) => void;
}
