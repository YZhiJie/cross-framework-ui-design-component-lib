export type { TreeProps, TreeNode } from '@xui-design/core';

export { default as Tree } from './Tree.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 TreeRef 对齐） */
export interface TreeRef {
  /** 展开全部非叶子节点 */
  expandAll: () => void;
  /** 收起全部节点 */
  collapseAll: () => void;
  /** 勾选全部非禁用节点 */
  checkAll: () => void;
  /** 清空全部勾选 */
  uncheckAll: () => void;
}
