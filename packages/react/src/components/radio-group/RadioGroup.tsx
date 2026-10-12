/**
 * RadioGroup - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * value 提供即受控（由 useEffect 同步到逻辑层），否则 defaultValue 非受控。
 * 组内原生 input 共用 name（useId 生成）以获得浏览器原生互斥与方向键导航。
 */

import { useEffect, useId, useMemo, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { RadioGroupProps } from '@xui-design/core';
import { createRadioGroupLogic } from '@xui-design/shared';
import type { RadioGroupLogicInstance } from '@xui-design/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';
import { Radio } from '../radio/Radio';
import { RadioGroupContext } from './context';
import type { RadioGroupContextValue } from './context';

/** RadioGroup 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type RadioGroupComponentProps = RadioGroupProps & {
  /** 自定义选项（渲染 Radio 子项；提供 options 时忽略） */
  children?: ReactNode;
};

export function RadioGroup(props: RadioGroupComponentProps) {
  const {
    value,
    defaultValue,
    disabled = false,
    options,
    className,
    style,
    onChange,
    children,
  } = props;

  // 同组原生 input 共用的 name（实例级唯一）
  const inputName = `xui-radio-${useId()}`;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onChange });
  callbacksRef.current = { onChange };

  // 逻辑实例只创建一次：value 提供即受控，否则用 defaultValue 非受控
  const logicRef = useRef<RadioGroupLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createRadioGroupLogic({
      value,
      defaultValue,
      disabled,
      onChange: (next) => callbacksRef.current.onChange?.(next),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（value 为受控同步，仅更新状态不触发回调）
  useEffect(() => {
    logic.updateOptions({ value, disabled });
  }, [logic, value, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      name: inputName,
      groupValue: state.value,
      groupDisabled: state.disabled,
      select: (next) => logic.select(next),
    }),
    [inputName, state.value, state.disabled, logic],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        className={cn('xui-radio-group', className)}
        style={style as CSSProperties}
        role="radiogroup"
      >
        {/* options 数组渲染优先；未提供 options 时渲染 children 的 Radio 子项 */}
        {options && options.length > 0
          ? options.map((option) => (
              <Radio key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </Radio>
            ))
          : children}
      </div>
    </RadioGroupContext.Provider>
  );
}
