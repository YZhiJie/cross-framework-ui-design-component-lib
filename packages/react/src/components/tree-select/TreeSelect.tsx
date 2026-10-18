/**
 * TreeSelect - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 触发器复用 Cascader 的 combobox 形态（placeholder / 多选标签 / 清空 / 箭头），
 * 面板为递归渲染的树（TreeSelectNodeView 内部自引用），展开/勾选/选中全部走逻辑层。
 */

import { useEffect, useId, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react';
import type { TreeNode, TreeSelectProps } from '@xui-design/core';
import { createTreeSelectLogic, flattenTree } from '@xui-design/shared';
import type { TreeSelectLogicInstance, TreeSelectState } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';
import { cn } from '../../utils/cn';

/** 通过 ref 暴露的命令式 API */
export interface TreeSelectRef {
  /** 聚焦触发器 */
  focus: () => void;
  /** 切换面板展开/收起（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
}

/** TreeSelect 组件 Props（契约 Props 基础上扩展 React 专属属性） */
export type TreeSelectComponentProps = TreeSelectProps & {
  /** 自定义清除图标（默认渲染内联 SVG） */
  renderClearIcon?: () => ReactNode;
  /** 自定义下拉箭头图标（默认渲染内联 SVG） */
  renderSuffixIcon?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<TreeSelectRef>;
};

function TreeSelectNodeView(props: {
  node: TreeNode;
  logic: TreeSelectLogicInstance;
  state: TreeSelectState;
  multiple: boolean;
  depth: number;
}) {
  const { node, logic, state, multiple, depth } = props;
  const leaf = !node.children || node.children.length === 0;
  const expanded = state.expandedKeys.includes(node.key);
  const selected = state.selectedKey === node.key;
  const checkState = logic.getCheckState(node.key);
  const checkboxDisabled = state.disabled || node.disabled || node.disableCheckbox;

  const handleTitleClick = () => {
    if (multiple) {
      if (!checkboxDisabled) logic.toggleCheck(node.key);
      return;
    }
    logic.selectNode(node.key);
  };

  return (
    <li
      className={cn('xui-tree-select__node', {
        'is-expanded': expanded,
        'is-selected': !multiple && selected,
        'is-disabled': node.disabled,
        'is-leaf': leaf,
      })}
      role="treeitem"
      aria-expanded={leaf ? undefined : expanded}
      aria-selected={!multiple ? selected : undefined}
      aria-disabled={node.disabled || undefined}
    >
      <div className="xui-tree-select__node-content" style={{ paddingLeft: `${depth * 16}px` }}>
        <span
          className={cn('xui-tree-select__switcher', {
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
        {multiple && (
          <span
            className={cn('xui-tree-select__checkbox', { 'is-disabled': checkboxDisabled })}
            role="checkbox"
            aria-checked={checkState.indeterminate ? 'mixed' : checkState.checked}
            aria-disabled={checkboxDisabled || undefined}
            onClick={(event) => {
              event.stopPropagation();
              if (!checkboxDisabled) logic.toggleCheck(node.key);
            }}
          >
            <span
              className={cn('xui-tree-select__checkbox-inner', {
                'is-checked': checkState.checked,
                'is-indeterminate': checkState.indeterminate,
              })}
            />
          </span>
        )}
        <span className="xui-tree-select__title" onClick={handleTitleClick}>
          {node.label}
        </span>
      </div>
      {!leaf && expanded && (
        <ul className="xui-tree-select__children" role="group">
          {node.children!.map((child) => (
            <TreeSelectNodeView
              key={child.key}
              node={child}
              logic={logic}
              state={state}
              multiple={multiple}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeSelect(props: TreeSelectComponentProps) {
  const {
    value,
    defaultValue,
    treeData,
    multiple = false,
    checkStrictly = false,
    placeholder,
    disabled = false,
    clearable = false,
    defaultExpandAll = false,
    className,
    style,
    onChange,
    onClear,
    renderClearIcon,
    renderSuffixIcon,
    ref,
  } = props;

  const locale = useLocaleData();

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const panelId = useId();

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑
  const callbacksRef = useRef({ onChange, onClear });
  callbacksRef.current = { onChange, onClear };

  const logicRef = useRef<TreeSelectLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createTreeSelectLogic({
      value,
      defaultValue,
      treeData,
      multiple,
      checkStrictly,
      defaultExpandAll,
      disabled,
      onChange: (v) => callbacksRef.current.onChange?.(v),
      onClear: () => callbacksRef.current.onClear?.(),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ value, treeData, checkStrictly, disabled });
  }, [logic, value, treeData, checkStrictly, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => triggerRef.current?.focus(),
      toggleOpen: () => logic.toggleOpen(),
      close: () => logic.close(),
    }),
    [logic],
  );

  // 点击组件外部 / Esc 收起面板
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        logic.close();
      }
    };
    const handleDocKeydown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') logic.close();
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleDocKeydown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleDocKeydown);
    };
  }, [logic]);

  const { keyMap } = flattenTree(treeData);

  // 单选：选中节点展示文案
  const displayLabel =
    !multiple && typeof state.value === 'string'
      ? (keyMap.get(state.value)?.node.label ?? null)
      : null;

  // 多选：已勾选的标签列表（checkedKeys 逐项映射 label）
  const checkedTags =
    multiple && Array.isArray(state.value)
      ? state.value
          .map((key) => {
            const entry = keyMap.get(key);
            return entry ? { key, label: entry.node.label } : null;
          })
          .filter(Boolean) as { key: string; label: string }[]
      : [];

  const hasValue = multiple ? checkedTags.length > 0 : !!state.value;

  const handleTriggerKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        logic.toggleOpen();
        break;
      case 'Escape':
        if (state.open) {
          event.preventDefault();
          logic.close();
        }
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn('xui-tree-select', className, {
        'is-disabled': state.disabled,
        'is-open': state.open,
        'is-multiple': multiple,
      })}
      style={style as CSSProperties}
    >
      <div
        ref={triggerRef}
        id={triggerId}
        className="xui-tree-select__trigger"
        role="combobox"
        aria-expanded={state.open}
        aria-haspopup="dialog"
        aria-controls={state.open ? panelId : undefined}
        aria-disabled={state.disabled || undefined}
        tabIndex={state.disabled ? -1 : 0}
        onClick={() => logic.toggleOpen()}
        onKeyDown={handleTriggerKeydown}
      >
        {multiple ? (
          checkedTags.length === 0 ? (
            <span className="xui-tree-select__placeholder">
              {placeholder ?? locale.treeSelect.placeholder}
            </span>
          ) : (
            <span className="xui-tree-select__tags">
              {checkedTags.map((tag) => (
                <span key={tag.key} className="xui-tree-select__tag">
                  <span className="xui-tree-select__tag-label">{tag.label}</span>
                  <span
                    className="xui-tree-select__tag-close"
                    role="button"
                    aria-label="remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      logic.toggleCheck(tag.key);
                    }}
                  >
                    ×
                  </span>
                </span>
              ))}
            </span>
          )
        ) : displayLabel ? (
          <span className="xui-tree-select__value">{displayLabel}</span>
        ) : (
          <span className="xui-tree-select__placeholder">
            {placeholder ?? locale.treeSelect.placeholder}
          </span>
        )}
        {clearable && hasValue && !state.disabled ? (
          <span
            className="xui-tree-select__clear"
            role="button"
            aria-label="clear"
            onClick={(event) => {
              event.stopPropagation();
              logic.clear();
            }}
          >
            {renderClearIcon ? (
              renderClearIcon()
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: icons.clear }}
              />
            )}
          </span>
        ) : (
          <span
            className={cn('xui-tree-select__arrow', { 'is-open': state.open })}
            aria-hidden="true"
          >
            {renderSuffixIcon ? (
              renderSuffixIcon()
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: icons['arrow-down'] }}
              />
            )}
          </span>
        )}
      </div>
      {state.open && (
        <div
          id={panelId}
          className="xui-tree-select__panel"
          role="dialog"
          aria-label={locale.treeSelect.panel}
          onClick={(event) => event.stopPropagation()}
        >
          <ul className="xui-tree-select__list" role="tree" aria-label={locale.treeSelect.panel}>
            {treeData.map((node) => (
              <TreeSelectNodeView
                key={node.key}
                node={node}
                logic={logic}
                state={state}
                multiple={multiple}
                depth={0}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
