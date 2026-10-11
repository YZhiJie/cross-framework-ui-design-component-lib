/**
 * DatePicker - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * ARIA combobox 模式：trigger role="combobox"，面板 role="dialog"，
 * 键盘 Enter/Space/Escape，点击组件外部收起面板。
 */

import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { DatePickerProps } from '@xui/core';
import { createDatePickerLogic, DATE_WEEKDAY_LABELS, getMonthMatrix } from '@xui/shared';
import type { DatePickerLogicInstance } from '@xui/shared';
import { icons } from '@xui/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** DatePicker 组件 Props（契约 Props 原样透传） */
export type DatePickerComponentProps = DatePickerProps;

export function DatePicker(props: DatePickerComponentProps) {
  const {
    value,
    defaultValue,
    placeholder,
    disabled = false,
    clearable = false,
    onChange,
    onClear,
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const panelId = useId();

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onChange, onClear });
  callbacksRef.current = { onChange, onClear };

  // 逻辑实例只创建一次：value 提供即受控，否则用 defaultValue 非受控
  const logicRef = useRef<DatePickerLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createDatePickerLogic({
      value,
      defaultValue,
      disabled,
      onChange: (v) => callbacksRef.current.onChange?.(v),
      onClear: () => callbacksRef.current.onClear?.(),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（受控模式：value 变更 → 逻辑层）
  useEffect(() => {
    logic.updateOptions({ value, disabled });
  }, [logic, value, disabled]);

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

  const monthCells = getMonthMatrix(state.viewYear, state.viewMonth);

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
      className={cn('xui-date-picker', {
        'is-disabled': state.disabled,
        'is-open': state.open,
      })}
    >
      <div
        id={triggerId}
        className="xui-date-picker__trigger"
        role="combobox"
        aria-expanded={state.open}
        aria-haspopup="dialog"
        aria-controls={state.open ? panelId : undefined}
        aria-disabled={state.disabled || undefined}
        tabIndex={state.disabled ? -1 : 0}
        onClick={() => logic.toggleOpen()}
        onKeyDown={handleTriggerKeydown}
      >
        {state.value ? (
          <span className="xui-date-picker__value">{state.value}</span>
        ) : (
          <span className="xui-date-picker__placeholder">{placeholder ?? '请选择日期'}</span>
        )}
        {clearable && state.value && !state.disabled ? (
          <span
            className="xui-date-picker__clear"
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
          <span className="xui-date-picker__icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: icons.calendar }}
            />
          </span>
        )}
      </div>
      {state.open && (
        <div id={panelId} className="xui-date-picker__panel" role="dialog" aria-label="选择日期">
          <div className="xui-date-picker__header">
            <button
              type="button"
              className="xui-date-picker__nav"
              aria-label="上个月"
              onClick={() => logic.prevMonth()}
            >
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
                dangerouslySetInnerHTML={{ __html: icons['arrow-left'] }}
              />
            </button>
            <span className="xui-date-picker__title">
              {state.viewYear} 年 {String(state.viewMonth).padStart(2, '0')} 月
            </span>
            <button
              type="button"
              className="xui-date-picker__nav"
              aria-label="下个月"
              onClick={() => logic.nextMonth()}
            >
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
                dangerouslySetInnerHTML={{ __html: icons['arrow-right'] }}
              />
            </button>
          </div>
          <div className="xui-date-picker__weekdays" aria-hidden="true">
            {DATE_WEEKDAY_LABELS.map((label) => (
              <span key={label} className="xui-date-picker__weekday">
                {label}
              </span>
            ))}
          </div>
          <div className="xui-date-picker__grid">
            {monthCells.map((cell) => (
              <button
                key={cell.date}
                type="button"
                className={cn('xui-date-picker__day', {
                  'is-outside': !cell.inMonth,
                  'is-today': cell.isToday,
                  'is-selected': cell.date === state.value,
                })}
                aria-label={cell.date}
                onClick={() => logic.select(cell.date)}
              >
                {cell.day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
