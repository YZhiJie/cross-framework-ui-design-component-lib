export { default as Drawer } from './Drawer.vue';

import type { DrawerPlacement, DrawerProps } from '@xui-design/core';

export type { DrawerPlacement, DrawerProps };

/** 通过 ref 暴露的命令式 API（与 React 适配层的 DrawerRef 对齐） */
export interface DrawerRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}
