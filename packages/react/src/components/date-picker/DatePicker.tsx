/**
 * DatePicker - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 支持 type='date'（单选）与 type='range'（范围选择），shortcuts 快捷选项。
 * ARIA combobox 模式：trigger role="combobox"，面板 role="dialog"。
 */

import { useEffect, useId, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react';
import type { DatePickerProps } from '@xui-design/core';
import {
  compareDate,
  createDatePickerLogic,
  getMonthMatrix,
} from '@xui-design/shared';
import type { DatePickerLogicInstance } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';
import { cn } from '../../utils/cn';

/** DatePicker 组件 Props（契约 Props 基础上扩展 React 专属属性） */
export type DatePickerComponentProps = DatePickerProps & {
  renderClearIcon?: () => ReactNode;
  renderCalendarIcon?: () => ReactNode;
  renderPrevIcon?: () => ReactNode;
  renderNextIcon?: () => ReactNode;
  ref?: Ref<DatePickerRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface DatePickerRef {
  focus: () => void;
  toggleOpen: () => void;
  close: () => void;
}

export function DatePicker(props: DatePickerComponentProps) {
  const {
    type = 'date',
    value,
    defaultValue,
    placeholder,
    disabled = false,
    clearable = false,
    shortcuts,
    className,
    style,
    onChange,
    onClear,
    renderClearIcon,
    renderCalendarIcon,
    renderPrevIcon,
    renderNextIcon,
    ref,
  } = props;

  const locale = useLocaleData();

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const panelId = useId();

  const callbacksRef = useRef({ onChange, onClear });
  callbacksRef.current = { onChange, onClear };

  const logicRef = useRef<DatePickerLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createDatePickerLogic({
      type,
      value,
      defaultValue,
      disabled,
      shortcuts,
      onChange: (v) => callbacksRef.current.onChange?.(v),
      onClear: () => callbacksRef.current.onClear?.(),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ value, disabled });
  }, [logic, value, disabled]);

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

  // 展示文案：date 模式显示单个日期；range 模式显示 "start - end"
  const displayValue = state.value
    ? Array.isArray(state.value)
      ? `${state.value[0]} ~ ${state.value[1]}`
      : state.value
    : null;

  // range 高亮区间：已确认的 value 或正在选择的 rangeStart~hover（简化为 value 区间）
  const rangeValue = state.value && Array.isArray(state.value) ? state.value : null;

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

  /** 判断日期单元格在 range 模式下的选中态 */
  const getDayClass = (date: string) => {
    if (type === 'date') {
      return date === state.value;
    }
    // range
    if (rangeValue) {
      return date === rangeValue[0] || date === rangeValue[1];
    }
    return state.rangeStart === date;
  };

  /** 判断日期是否在范围内（in-range） */
  const isInRange = (date: string) => {
    if (type !== 'range' || !rangeValue) return false;
    return compareDate(date, rangeValue[0]) >= 0 && compareDate(date, rangeValue[1]) <= 0;
  };

  return (
    <div
      ref={rootRef}
      className={cn('xui-date-picker', className, {
        'is-disabled': state.disabled,
        'is-open': state.open,
        'is-range': type === 'range',
      })}
      style={style as CSSProperties}
    >
      <div
        ref={triggerRef}
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
        {displayValue ? (
          <span className="xui-date-picker__value">{displayValue}</span>
        ) : (
          <span className="xui-date-picker__placeholder">
            {placeholder ?? locale.datePicker.placeholder}
          </span>
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
          <span className="xui-date-picker__icon" aria-hidden="true">
            {renderCalendarIcon ? (
              renderCalendarIcon()
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
                dangerouslySetInnerHTML={{ __html: icons.calendar }}
              />
            )}
          </span>
        )}
      </div>
      {state.open && (
        <div
          id={panelId}
          className="xui-date-picker__panel"
          role="dialog"
          aria-label={locale.datePicker.panel}
        >
          <div className="xui-date-picker__header">
            <button
              type="button"
              className="xui-date-picker__nav"
              aria-label={locale.datePicker.prevMonth}
              onClick={() => logic.prevMonth()}
            >
              {renderPrevIcon ? (
                renderPrevIcon()
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
                  dangerouslySetInnerHTML={{ __html: icons['arrow-left'] }}
                />
              )}
            </button>
            <span className="xui-date-picker__title">
              {locale.datePicker.titleFormat(state.viewYear, state.viewMonth)}
            </span>
            <button
              type="button"
              className="xui-date-picker__nav"
              aria-label={locale.datePicker.nextMonth}
              onClick={() => logic.nextMonth()}
            >
              {renderNextIcon ? (
                renderNextIcon()
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
                  dangerouslySetInnerHTML={{ __html: icons['arrow-right'] }}
                />
              )}
            </button>
          </div>
          <div className="xui-date-picker__weekdays" aria-hidden="true">
            {locale.datePicker.weekdays.map((label) => (
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
                  'is-selected': getDayClass(cell.date),
                  'is-in-range': isInRange(cell.date),
                  'is-range-start': type === 'range' && rangeValue && cell.date === rangeValue[0],
                  'is-range-end': type === 'range' && rangeValue && cell.date === rangeValue[1],
                })}
                aria-label={cell.date}
                onClick={() => logic.select(cell.date)}
              >
                {cell.day}
              </button>
            ))}
          </div>
          {shortcuts && shortcuts.length > 0 && (
            <div className="xui-date-picker__shortcuts">
              {shortcuts.map((sc) => (
                <button
                  key={sc.label}
                  type="button"
                  className="xui-date-picker__shortcut"
                  onClick={() => logic.selectShortcut(sc.value)}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
