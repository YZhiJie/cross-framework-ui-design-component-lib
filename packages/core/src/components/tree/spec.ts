/**
 * Tree 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createTreeLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createTreeLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { TreeEvents, TreeLogic, TreeProps, TreeSlots } from './types';

export const treeSpec = {
  name: 'Tree',
  props: {
    type: {
      data: Array,
      expandedKeys: Array,
      defaultExpandedKeys: Array,
      checkedKeys: Array,
      defaultCheckedKeys: Array,
      selectedKey: String,
      defaultSelectedKey: String,
      checkable: Boolean,
      checkStrictly: Boolean,
      defaultExpandAll: Boolean,
      disabled: Boolean,
      className: String,
      style: Object,
      onExpand: Function,
      onCheck: Function,
      onSelect: Function,
    },
    defaults: {
      checkable: false,
      checkStrictly: false,
      defaultExpandAll: false,
      disabled: false,
    },
  },
  events: {
    expand: {
      description: '节点展开/收起时触发',
      payloadType: '(string[], { key: string; expanded: boolean })',
    },
    check: {
      description: '节点勾选状态变更时触发',
      payloadType: '(string[], { key: string; checked: boolean })',
    },
    select: {
      description: '节点选中时触发',
      payloadType: '(string | null, { key: string })',
    },
  },
  slots: {
    title: { description: '自定义节点标题（scope 含当前节点）' },
  },
  useLogic: (props: TreeProps) =>
    createTreeLogic({
      data: props.data,
      expandedKeys: props.expandedKeys,
      defaultExpandedKeys: props.defaultExpandedKeys,
      checkedKeys: props.checkedKeys,
      defaultCheckedKeys: props.defaultCheckedKeys,
      selectedKey: props.selectedKey,
      defaultSelectedKey: props.defaultSelectedKey,
      checkable: props.checkable,
      checkStrictly: props.checkStrictly,
      defaultExpandAll: props.defaultExpandAll,
      disabled: props.disabled,
      onExpand: props.onExpand,
      onCheck: props.onCheck,
      onSelect: props.onSelect,
    }),
} satisfies ComponentSpec<TreeProps, TreeEvents, TreeSlots, TreeLogic>;
