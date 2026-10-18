/**
 * Tree - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 递归渲染：TreeNodeView 内部自引用，展开/勾选/选中全部走逻辑层。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { TreeNode, TreeProps } from '@xui-design/core';
import { createTreeLogic, getNodeCheckState, isTreeLeaf } from '@xui-design/shared';
import type { TreeLogicInstance, TreeState } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Tree 命令式 API（通过 ref 暴露） */
export type TreeRef = {
  /** 展开全部非叶子节点 */
  expandAll: () => void;
  /** 收起全部节点 */
  collapseAll: () => void;
  /** 勾选全部非禁用节点 */
  checkAll: () => void;
  /** 清空全部勾选 */
  uncheckAll: () => void;
};

/** Tree 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type TreeComponentProps = TreeProps & {
  /** 自定义节点标题渲染（对应 Vue 的 title 作用域插槽） */
  renderTitle?: (node: TreeNode) => ReactNode;
  /** ref 命令式 API */
  ref?: Ref<TreeRef>;
};

function TreeNodeView(props: {
  node: TreeNode;
  logic: TreeLogicInstance;
  state: TreeState;
  checkable: boolean;
  checkStrictly: boolean;
  data: TreeNode[];
  depth: number;
  renderTitle?: (node: TreeNode) => ReactNode;
}) {
  const { node, logic, state, checkable, checkStrictly, data, depth, renderTitle } = props;
  const leaf = isTreeLeaf(node);
  const expanded = state.expandedKeys.includes(node.key);
  const selected = state.selectedKey === node.key;
  const checkState = getNodeCheckState(data, state.checkedKeys, node.key, checkStrictly);
  const checkboxDisabled = state.disabled || node.disabled || node.disableCheckbox;

  return (
    <li
      className={cn('xui-tree__node', {
        'is-expanded': expanded,
        'is-selected': selected,
        'is-disabled': node.disabled,
        'is-leaf': leaf,
      })}
      role="treeitem"
      aria-expanded={leaf ? undefined : expanded}
      aria-selected={selected}
      aria-disabled={node.disabled || undefined}
    >
      <div className="xui-tree__node-content" style={{ paddingLeft: `${depth * 16}px` }}>
        <span
          className={cn('xui-tree__switcher', {
            'is-leaf': leaf,
            'is-expanded': expanded,
          })}
          aria-hidden="true"
          onClick={(event) => {
            event.stopPropagation();
            if (!leaf) logic.toggleExpand(node.key);
          }}
        >
          {!leaf && (
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: icons['arrow-right'] }}
            />
          )}
        </span>
        {checkable && (
          <span
            className={cn('xui-tree__checkbox', { 'is-disabled': checkboxDisabled })}
            role="checkbox"
            aria-checked={checkState.indeterminate ? 'mixed' : checkState.checked}
            aria-disabled={checkboxDisabled || undefined}
            onClick={(event) => {
              event.stopPropagation();
              if (!checkboxDisabled) logic.toggleCheck(node.key);
            }}
          >
            <span
              className={cn('xui-tree__checkbox-inner', {
                'is-checked': checkState.checked,
                'is-indeterminate': checkState.indeterminate,
              })}
            />
          </span>
        )}
        <span className="xui-tree__title" onClick={() => logic.select(node.key)}>
          {renderTitle ? renderTitle(node) : node.label}
        </span>
      </div>
      {!leaf && expanded && (
        <ul className="xui-tree__children" role="group">
          {node.children!.map((child) => (
            <TreeNodeView
              key={child.key}
              node={child}
              logic={logic}
              state={state}
              checkable={checkable}
              checkStrictly={checkStrictly}
              data={data}
              depth={depth + 1}
              renderTitle={renderTitle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Tree(props: TreeComponentProps) {
  const {
    data,
    expandedKeys,
    defaultExpandedKeys,
    checkedKeys,
    defaultCheckedKeys,
    selectedKey,
    defaultSelectedKey,
    checkable = false,
    checkStrictly = false,
    defaultExpandAll = false,
    disabled = false,
    className,
    style,
    onExpand,
    onCheck,
    onSelect,
    renderTitle,
    ref,
  } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onExpand, onCheck, onSelect });
  callbacksRef.current = { onExpand, onCheck, onSelect };

  const logicRef = useRef<TreeLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createTreeLogic({
      data,
      expandedKeys,
      defaultExpandedKeys,
      checkedKeys,
      defaultCheckedKeys,
      selectedKey,
      defaultSelectedKey,
      checkable,
      checkStrictly,
      defaultExpandAll,
      disabled,
      onExpand: (keys, info) => callbacksRef.current.onExpand?.(keys, info),
      onCheck: (keys, info) => callbacksRef.current.onCheck?.(keys, info),
      onSelect: (key, info) => callbacksRef.current.onSelect?.(key, info),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({
      data,
      expandedKeys,
      checkedKeys,
      selectedKey,
      checkable,
      checkStrictly,
      disabled,
    });
  }, [logic, data, expandedKeys, checkedKeys, selectedKey, checkable, checkStrictly, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // ref 命令式 API（依赖数组为 [logic]：工厂仅引用稳定的 logic 实例）
  useImperativeHandle(
    ref,
    () => ({
      expandAll: () => logic.expandAll(),
      collapseAll: () => logic.collapseAll(),
      checkAll: () => logic.checkAll(),
      uncheckAll: () => logic.uncheckAll(),
    }),
    [logic],
  );

  return (
    <div
      className={cn('xui-tree', className, { 'is-disabled': state.disabled })}
      style={style as CSSProperties}
      role="tree"
    >
      <ul className="xui-tree__list">
        {data.map((node) => (
          <TreeNodeView
            key={node.key}
            node={node}
            logic={logic}
            state={state}
            checkable={checkable}
            checkStrictly={checkStrictly}
            data={data}
            depth={0}
            renderTitle={renderTitle}
          />
        ))}
      </ul>
    </div>
  );
}
