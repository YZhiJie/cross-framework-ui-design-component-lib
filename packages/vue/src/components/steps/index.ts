export type { StepsProps } from '@xui-design/core';

export { default as Steps } from './Steps.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 StepsRef 对齐） */
export interface StepsRef {
  /** 切换到下一步（越界或目标项禁用时 no-op） */
  next: () => void;
  /** 切换到上一步（越界或目标项禁用时 no-op） */
  prev: () => void;
  /** 切换到指定步骤（越界或目标项禁用时 no-op） */
  goTo: (index: number) => void;
}
