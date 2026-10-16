export type { PopconfirmProps } from '@xui-design/core';

export { default as Popconfirm } from './Popconfirm.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 PopconfirmRef 对齐） */
export interface PopconfirmRef {
  /** 显示确认气泡（已展开时 no-op） */
  show: () => void;
  /** 隐藏确认气泡（不触发回调） */
  hide: () => void;
  /** 切换确认气泡展开/收起 */
  toggle: () => void;
}
