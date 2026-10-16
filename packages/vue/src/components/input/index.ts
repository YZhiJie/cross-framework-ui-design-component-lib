export type { InputProps } from '@xui-design/core';

export { default as Input } from './Input.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 InputRef 对齐） */
export interface InputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}
