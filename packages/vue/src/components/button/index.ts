export type { ButtonProps } from '@xui-design/core';

export { default as Button } from './Button.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 ButtonRef 对齐） */
export interface ButtonRef {
  focus: () => void;
  setLoading: (loading: boolean) => void;
}
