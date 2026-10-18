/**
 * Cascader - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 面板为多列滚动列表（每级一列），点击选项展开下一列或确认选中。
 * 多选模式：value 为 string[][]，叶子节点可勾选，支持级联、全选、反选与标签管理。
 */

import { useEffect, useId, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react';
import type { CascaderProps } from '@xui-design/core';
import {
  createCascaderLogic,
  getColumnsByPath,
  getPathCheckState,
  resolvePath,
} from '@xui-design/shared';
import type { CascaderLogicInstance, CascaderOption } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';
import { cn } from '../../utils/cn';

/** Cascader 组件 Props（契约 Props 基础上扩展 React 专属属性） */
export type CascaderComponentProps = CascaderProps & {
  /** 自定义清除图标（默认渲染内联 SVG） */
  renderClearIcon?: () => ReactNode;
  /** 自定义后缀图标（默认渲染内联 SVG） */
  renderSuffixIcon?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<CascaderRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface CascaderRef {
  /** 聚焦触发器 */
  focus: () => void;
  /** 切换面板展开/收起（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
}

export function Cascader(props: CascaderComponentProps) {
  const {
    value,
    defaultValue,
    options,
    placeholder,
    disabled = false,
    clearable = false,
    separator = ' / ',
    changeOnSelect = false,
    multiple = false,
    checkStrictly = false,
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

  const callbacksRef = useRef({ onChange, onClear });
  callbacksRef.current = { onChange, onClear };

  const logicRef = useRef<CascaderLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createCascaderLogic({
      value,
      defaultValue,
      options,
      disabled,
      separator,
      changeOnSelect,
      multiple,
      checkStrictly,
      onChange: (v, labels) => callbacksRef.current.onChange?.(v, labels),
      onClear: () => callbacksRef.current.onClear?.(),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ value, disabled, options, changeOnSelect, checkStrictly });
  }, [logic, value, disabled, options, changeOnSelect, checkStrictly]);

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

  // 点击组件外部时收起面板
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        logic.close();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [logic]);

  // 根据 activePath 计算各列
  const columns = getColumnsByPath(options, state.activePath);

  // 单选：选中路径的展示文案
  const displayLabel =
    !multiple && state.value
      ? (resolvePath(options, state.value as string[])?.labels.join(separator) ?? null)
      : null;

  // 多选：已勾选的标签列表
  const checkedTags = (() => {
    if (!multiple || !state.value) return [];
    const paths = state.value as string[][];
    return paths
      .map((path) => {
        const resolved = resolvePath(options, path);
        return resolved ? { path, label: resolved.labels.join(separator) } : null;
      })
      .filter(Boolean) as { path: string[]; label: string }[];
  })();

  const hasValue = multiple ? checkedTags.length > 0 : !!state.value;

  /** 判断某选项路径是否被勾选（父级由后代叶子全选推导） */
  const isOptionChecked = (level: number, option: CascaderOption): boolean => {
    if (!multiple) return false;
    const path = [...state.activePath.slice(0, level), option.value];
    return getPathCheckState(options, state.value as string[][], path, checkStrictly).checked;
  };

  /** 判断某选项是否半选（部分后代叶子被勾选） */
  const isOptionIndeterminate = (level: number, option: CascaderOption): boolean => {
    if (!multiple) return false;
    const path = [...state.activePath.slice(0, level), option.value];
    return getPathCheckState(options, state.value as string[][], path, checkStrictly).indeterminate;
  };

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
      className={cn('xui-cascader', className, {
        'is-disabled': state.disabled,
        'is-open': state.open,
        'is-multiple': multiple,
      })}
      style={style as CSSProperties}
    >
      <div
        ref={triggerRef}
        id={triggerId}
        className="xui-cascader__trigger"
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
            <span className="xui-cascader__placeholder">
              {placeholder ?? locale.cascader.placeholder}
            </span>
          ) : (
            <span className="xui-cascader__tags">
              {checkedTags.map((tag) => (
                <span key={tag.path.join('/')} className="xui-cascader__tag">
                  <span className="xui-cascader__tag-label">{tag.label}</span>
                  <span
                    className="xui-cascader__tag-close"
                    role="button"
                    aria-label="remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      logic.toggleCheck(tag.path);
                    }}
                  >
                    ×
                  </span>
                </span>
              ))}
            </span>
          )
        ) : displayLabel ? (
          <span className="xui-cascader__value">{displayLabel}</span>
        ) : (
          <span className="xui-cascader__placeholder">
            {placeholder ?? locale.cascader.placeholder}
          </span>
        )}
        {clearable && hasValue && !state.disabled ? (
          <span
            className="xui-cascader__clear"
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
          <span className={cn('xui-cascader__arrow', { 'is-open': state.open })} aria-hidden="true">
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
          className="xui-cascader__panel"
          role="dialog"
          aria-label={locale.cascader.panel}
        >
          <div className="xui-cascader__columns">
            {columns.map((column, level) => (
              <ul
                key={level}
                className="xui-cascader__column"
                role="listbox"
                aria-label={`level-${level}`}
              >
                {column.map((option) => {
                  const isActive = state.activePath[level] === option.value;
                  const checked = isOptionChecked(level, option);
                  const indeterminate = isOptionIndeterminate(level, option);
                  return (
                    <li
                      key={option.value}
                      className={cn('xui-cascader__item', {
                        'is-active': isActive,
                        'is-disabled': option.disabled,
                        'is-checked': multiple && checked,
                      })}
                      role="option"
                      aria-selected={isActive}
                      aria-disabled={option.disabled || undefined}
                      onClick={() => {
                        if (!option.disabled) logic.select(level, option.value);
                      }}
                    >
                      {multiple && (
                        <span className="xui-cascader__checkbox" aria-hidden="true">
                          <span
                            className={cn('xui-cascader__checkbox-inner', {
                              'is-checked': checked,
                              'is-indeterminate': indeterminate,
                            })}
                          />
                        </span>
                      )}
                      <span className="xui-cascader__item-label">{option.label}</span>
                      {option.children && option.children.length > 0 && (
                        <span className="xui-cascader__item-arrow" aria-hidden="true">
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
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
          {multiple && (
            <div className="xui-cascader__footer">
              <button
                type="button"
                className="xui-cascader__footer-btn"
                onClick={() => logic.checkAll()}
              >
                全选
              </button>
              <button
                type="button"
                className="xui-cascader__footer-btn"
                onClick={() => logic.uncheckAll()}
              >
                清空
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
