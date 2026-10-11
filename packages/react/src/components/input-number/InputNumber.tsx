/**
 * InputNumber - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 输入显示文本为适配层本地编辑态：提交 / 步进后与逻辑收敛值对齐，
 * 受控值（value 非 undefined，null 也是有效值）变化时由 effect 对齐显示。
 */

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { InputNumberProps } from '@xui/core';
import { createInputNumberLogic } from '@xui/shared';
import type { InputNumberLogicInstance } from '@xui/shared';
import { icons } from '@xui/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** InputNumber 组件 Props（与契约 Props 一致） */
export type InputNumberComponentProps = InputNumberProps;

/** 收敛值的显示文本（precision 存在时固定小数位） */
function formatValue(value: number | null, precision: number | null): string {
  if (value === null) return '';
  return precision !== null ? value.toFixed(precision) : String(value);
}

export function InputNumber(props: InputNumberComponentProps) {
  const {
    value,
    defaultValue,
    min,
    max,
    step = 1,
    precision,
    disabled = false,
    placeholder,
    className,
    style,
    onChange,
  } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onChange });
  callbacksRef.current = { onChange };

  const logicRef = useRef<InputNumberLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createInputNumberLogic({
      value,
      defaultValue,
      min,
      max,
      step,
      precision,
      disabled,
      onChange: (next) => callbacksRef.current.onChange?.(next),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ value, min, max, step, precision, disabled });
  }, [logic, value, min, max, step, precision, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // 输入框显示文本：编辑期自由文本，提交 / 步进后与逻辑收敛值对齐
  const [inputText, setInputText] = useState(() => formatValue(state.value, state.precision));

  // 受控值变化时对齐显示（非受控由 commit / step 处理器对齐）
  useEffect(() => {
    if (value !== undefined) {
      setInputText(formatValue(state.value, state.precision));
    }
  }, [value, state.value, state.precision]);

  const commit = () => {
    logic.commitText(inputText);
    const next = logic.getState();
    setInputText(formatValue(next.value, next.precision));
  };

  const stepBy = (direction: 1 | -1) => {
    logic.stepValue(direction);
    const next = logic.getState();
    setInputText(formatValue(next.value, next.precision));
  };

  return (
    <div
      className={cn('xui-input-number', className, { 'is-disabled': state.disabled })}
      style={style as CSSProperties}
    >
      <input
        className="xui-input-number__input"
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-valuenow={state.value ?? undefined}
        aria-valuemin={Number.isFinite(state.min) ? state.min : undefined}
        aria-valuemax={Number.isFinite(state.max) ? state.max : undefined}
        placeholder={placeholder}
        disabled={state.disabled}
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            stepBy(1);
          } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            stepBy(-1);
          }
        }}
      />
      <div className="xui-input-number__step" aria-hidden="true">
        <button
          className="xui-input-number__btn"
          type="button"
          tabIndex={-1}
          disabled={state.disabled}
          onClick={() => stepBy(1)}
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: icons['arrow-up'] }}
          />
        </button>
        <button
          className="xui-input-number__btn"
          type="button"
          tabIndex={-1}
          disabled={state.disabled}
          onClick={() => stepBy(-1)}
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: icons['arrow-down'] }}
          />
        </button>
      </div>
    </div>
  );
}
