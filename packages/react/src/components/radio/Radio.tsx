/**
 * Radio - React 19 适配层
 *
 * Radio 是 RadioGroup 的子项组件：通过 useContext 获取组上下文，
 * 选中态派生自组值（不进入逻辑层），选中变更统一由组触发 change。
 * 原生 <input type="radio"> 保证互斥、方向键与读屏可访问性；
 * 受控模式下 React 依据 checked={checked} 自动恢复 DOM 状态（外部未回写时视觉回退）。
 */

import { useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { RadioProps } from '@xui/core';
import { createRadioLogic } from '@xui/shared';
import type { RadioLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';
import { RadioGroupContext } from '../radio-group/context';

/** Radio 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type RadioComponentProps = RadioProps & {
  /** 选项文案 */
  children?: ReactNode;
};

export function Radio(props: RadioComponentProps) {
  const { value, disabled = false, children } = props;

  const logicRef = useRef<RadioLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createRadioLogic({ disabled });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ disabled });
  }, [logic, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  const group = useContext(RadioGroupContext);

  const checked = group ? group.groupValue === value : false;
  const isDisabled = state.disabled || (group ? group.groupDisabled : false);

  const handleChange = () => {
    // 自身禁用时忽略（fireEvent 等程序化事件会绕过原生 disabled 行为）；
    // 组级禁用由组逻辑 select 内部忽略
    if (isDisabled) return;
    // 组外兜底由 React 受控机制自动恢复（checked 恒 false），无需手动处理
    group?.select(value);
  };

  return (
    <label
      className={cn('xui-radio', {
        'is-checked': checked,
        'is-disabled': isDisabled,
      })}
    >
      <input
        className="xui-radio__input"
        type="radio"
        name={group?.name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        onChange={handleChange}
      />
      <span className="xui-radio__dot" aria-hidden="true" />
      {children !== undefined && children !== null && (
        <span className="xui-radio__label">{children}</span>
      )}
    </label>
  );
}
