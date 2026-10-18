/**
 * TimePicker - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 面板为三列滚动列表（时 / 分 / 秒），点击数字选中；format='HH:mm' 时不渲染秒列。
 */

import { useEffect, useId, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react';
import type { TimePickerProps } from '@xui-design/core';
import {
  createTimePickerLogic,
  genTimeColumn,
  parseTimeString,
  snapToStep,
} from '@xui-design/shared';
import type { TimePickerLogicInstance } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';
import { cn } from '../../utils/cn';

/** TimePicker 组件 Props（契约 Props 基础上扩展 React 专属属性） */
export type TimePickerComponentProps = TimePickerProps & {
  /** 自定义清除图标（默认渲染内联 SVG） */
  renderClearIcon?: () => ReactNode;
  /** 自定义时钟图标（默认渲染内联 SVG） */
  renderClockIcon?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<TimePickerRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface TimePickerRef {
  /** 聚焦触发器 */
  focus: () => void;
  /** 切换面板展开/收起（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
}

export function TimePicker(props: TimePickerComponentProps) {
  const {
    value,
    defaultValue,
    placeholder,
    disabled = false,
    clearable = false,
    format = 'HH:mm:ss',
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    className,
    style,
    onChange,
    onClear,
    renderClearIcon,
    renderClockIcon,
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

  const logicRef = useRef<TimePickerLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createTimePickerLogic({
      value,
      defaultValue,
      disabled,
      format,
      hourStep,
      minuteStep,
      secondStep,
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

  // 面板打开时，将各列滚动到当前选中项（滚轮选择器定位到视觉中心）
  useEffect(() => {
    if (!state.open) return;
    const columns = rootRef.current?.querySelectorAll<HTMLElement>('.xui-time-picker__column');
    columns?.forEach((col) => {
      const selected = col.querySelector<HTMLElement>('.xui-time-picker__item.is-selected');
      if (selected && typeof selected.scrollIntoView === 'function') {
        selected.scrollIntoView({ block: 'center', inline: 'nearest' });
      }
    });
  }, [state.open]);

  const hours = genTimeColumn(24, hourStep);
  const minutes = genTimeColumn(60, minuteStep);
  const seconds = format === 'HH:mm:ss' ? genTimeColumn(60, secondStep) : [];

  // 当前选中值解析，用于高亮
  const parsed = state.value ? parseTimeString(state.value) : null;
  const showSeconds = format === 'HH:mm:ss';

  // 显示文案：按 format 决定是否省略秒
  const displayValue = state.value ? (showSeconds ? state.value : state.value.slice(0, 5)) : null;

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

  // 点击某列数字：若未选完整时分秒，则补全其余列后选中
  const handlePick = (col: 'hour' | 'minute' | 'second', num: number) => {
    const cur = parsed ?? { hour: 0, minute: 0, second: 0 };
    const next = { ...cur, [col]: num };
    logic.select(next.hour, next.minute, showSeconds ? next.second : 0);
  };

  return (
    <div
      ref={rootRef}
      className={cn('xui-time-picker', className, {
        'is-disabled': state.disabled,
        'is-open': state.open,
      })}
      style={style as CSSProperties}
    >
      <div
        ref={triggerRef}
        id={triggerId}
        className="xui-time-picker__trigger"
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
          <span className="xui-time-picker__value">{displayValue}</span>
        ) : (
          <span className="xui-time-picker__placeholder">
            {placeholder ?? locale.timePicker.placeholder}
          </span>
        )}
        {clearable && state.value && !state.disabled ? (
          <span
            className="xui-time-picker__clear"
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
          <span className="xui-time-picker__icon" aria-hidden="true">
            {renderClockIcon ? (
              renderClockIcon()
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
                dangerouslySetInnerHTML={{ __html: icons.clock }}
              />
            )}
          </span>
        )}
      </div>
      {state.open && (
        <div
          id={panelId}
          className="xui-time-picker__panel"
          role="dialog"
          aria-label={locale.timePicker.panel}
        >
          <div className="xui-time-picker__columns">
            <ul className="xui-time-picker__column" role="listbox" aria-label="hour">
              {hours.map((h) => (
                <li
                  key={h}
                  className={cn('xui-time-picker__item', {
                    'is-selected': parsed?.hour === snapToStep(h, hourStep, 24),
                  })}
                  role="option"
                  aria-selected={parsed?.hour === h}
                  onClick={() => handlePick('hour', h)}
                >
                  {String(h).padStart(2, '0')}
                </li>
              ))}
            </ul>
            <ul className="xui-time-picker__column" role="listbox" aria-label="minute">
              {minutes.map((m) => (
                <li
                  key={m}
                  className={cn('xui-time-picker__item', {
                    'is-selected': parsed?.minute === snapToStep(m, minuteStep, 60),
                  })}
                  role="option"
                  aria-selected={parsed?.minute === m}
                  onClick={() => handlePick('minute', m)}
                >
                  {String(m).padStart(2, '0')}
                </li>
              ))}
            </ul>
            {showSeconds && (
              <ul className="xui-time-picker__column" role="listbox" aria-label="second">
                {seconds.map((s) => (
                  <li
                    key={s}
                    className={cn('xui-time-picker__item', {
                      'is-selected': parsed?.second === snapToStep(s, secondStep, 60),
                    })}
                    role="option"
                    aria-selected={parsed?.second === s}
                    onClick={() => handlePick('second', s)}
                  >
                    {String(s).padStart(2, '0')}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
