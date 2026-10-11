/**
 * Select - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * ARIA combobox 模式：trigger role="combobox"，面板 role="listbox"，
 * 键盘 Enter/Space/Escape/ArrowDown/ArrowUp，点击组件外部收起面板。
 */

import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { SelectProps } from '@xui/core';
import { createSelectLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { SelectLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Select 组件 Props（契约 Props 原样透传） */
export type SelectComponentProps = SelectProps;

export function Select(props: SelectComponentProps) {
  const {
    value,
    defaultValue,
    options,
    placeholder,
    disabled = false,
    clearable = false,
    onChange,
    onClear,
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const listboxId = useId();

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onChange, onClear });
  callbacksRef.current = { onChange, onClear };

  // 逻辑实例只创建一次：value 提供即受控，否则用 defaultValue 非受控
  const logicRef = useRef<SelectLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createSelectLogic({
      value,
      defaultValue,
      options,
      disabled,
      clearable,
      onChange: (v) => callbacksRef.current.onChange?.(v),
      onClear: () => callbacksRef.current.onClear?.(),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（受控模式：value 变更 → 逻辑层）
  useEffect(() => {
    logic.updateOptions({ value, options, disabled, clearable });
  }, [logic, value, options, disabled, clearable]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // 点击组件外部时收起面板（close 内部有未展开守卫，未打开时为 no-op）
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        logic.close();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [logic]);

  const selectedOption = options?.find((option) => option.value === state.value);

  const handleTriggerKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (state.open) logic.confirmHighlight();
        else logic.toggleOpen();
        break;
      case 'Escape':
        if (state.open) {
          event.preventDefault();
          logic.close();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (state.open) logic.moveHighlight(1);
        else logic.toggleOpen();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (state.open) logic.moveHighlight(-1);
        else logic.toggleOpen();
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn('xui-select', { 'is-disabled': state.disabled, 'is-open': state.open })}
    >
      <div
        id={triggerId}
        className="xui-select__trigger"
        role="combobox"
        aria-expanded={state.open}
        aria-haspopup="listbox"
        aria-controls={state.open ? listboxId : undefined}
        aria-activedescendant={
          state.open && state.activeIndex !== -1
            ? `${listboxId}-option-${state.activeIndex}`
            : undefined
        }
        aria-disabled={state.disabled || undefined}
        tabIndex={state.disabled ? -1 : 0}
        onClick={() => logic.toggleOpen()}
        onKeyDown={handleTriggerKeydown}
      >
        {selectedOption ? (
          <span className="xui-select__value">{selectedOption.label}</span>
        ) : (
          <span className="xui-select__placeholder">{placeholder ?? '请选择'}</span>
        )}
        {clearable && state.value !== null && !state.disabled ? (
          <span
            className="xui-select__clear"
            role="button"
            aria-label="clear"
            onClick={(event) => {
              event.stopPropagation();
              logic.clear();
            }}
          >
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
          </span>
        ) : (
          <span className="xui-select__arrow" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: icons['arrow-down'] }}
            />
          </span>
        )}
      </div>
      {state.open && (
        <ul
          id={listboxId}
          className="xui-select__dropdown"
          role="listbox"
          aria-labelledby={triggerId}
        >
          {(options ?? []).map((option, index) => (
            <li
              id={`${listboxId}-option-${index}`}
              key={option.value}
              className={cn('xui-select__option', {
                'is-selected': option.value === state.value,
                'is-active': index === state.activeIndex,
                'is-disabled': option.disabled,
              })}
              role="option"
              aria-selected={option.value === state.value}
              aria-disabled={option.disabled || undefined}
              onClick={() => logic.select(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
