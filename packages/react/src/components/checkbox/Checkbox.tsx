/**
 * Checkbox - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * value 提供即受控（由 useEffect 同步到逻辑层），否则 defaultValue 非受控。
 * 原生 <input type="checkbox"> 保证键盘与读屏可访问性；indeterminate 为 DOM 属性，
 * 通过 ref 同步（React 不支持以 prop 形式传递）。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { CheckboxProps } from '@xui/core';
import { createCheckboxLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { CheckboxLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Checkbox 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type CheckboxComponentProps = CheckboxProps & {
  /** 标签内容 */
  children?: ReactNode;
  /** 自定义选中态图标（默认渲染内联 SVG） */
  renderCheckIcon?: () => ReactNode;
  /** 自定义半选态图标（默认渲染内联 SVG） */
  renderIndeterminateIcon?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<CheckboxRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface CheckboxRef {
  focus: () => void;
  /** 切换选中状态（disabled 时忽略） */
  toggle: () => void;
}

export function Checkbox(props: CheckboxComponentProps) {
  const {
    value,
    defaultValue,
    disabled = false,
    indeterminate = false,
    className,
    style,
    onChange,
    children,
    renderCheckIcon,
    renderIndeterminateIcon,
    ref,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onChange });
  callbacksRef.current = { onChange };

  // 逻辑实例只创建一次：value 提供即受控，否则用 defaultValue 非受控
  const logicRef = useRef<CheckboxLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createCheckboxLogic({
      value,
      defaultValue,
      disabled,
      indeterminate,
      onChange: (next) => callbacksRef.current.onChange?.(next),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（value 为受控同步，仅更新状态不触发回调）
  useEffect(() => {
    logic.updateOptions({ value, disabled, indeterminate });
  }, [logic, value, disabled, indeterminate]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // indeterminate 是 DOM 属性而非 React 受支持的 prop，需经 ref 同步
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = state.indeterminate;
    }
  }, [state.indeterminate]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      toggle: () => logic.toggle(),
    }),
    [logic],
  );

  return (
    <label
      className={cn(
        'xui-checkbox',
        {
          'is-checked': state.checked,
          'is-disabled': state.disabled,
          'is-indeterminate': state.indeterminate,
        },
        className,
      )}
      style={style as CSSProperties}
    >
      <input
        ref={inputRef}
        type="checkbox"
        className="xui-checkbox__input"
        checked={state.checked}
        disabled={state.disabled}
        aria-disabled={state.disabled}
        onChange={() => logic.toggle()}
      />
      <span className="xui-checkbox__box" aria-hidden="true">
        {state.indeterminate ? (
          renderIndeterminateIcon ? (
            renderIndeterminateIcon()
          ) : (
            <CheckboxIcon name="minus" />
          )
        ) : state.checked ? (
          renderCheckIcon ? (
            renderCheckIcon()
          ) : (
            <CheckboxIcon name="check" />
          )
        ) : null}
      </span>
      {children !== undefined && children !== null && (
        <span className="xui-checkbox__label">{children}</span>
      )}
    </label>
  );
}

/** 选中 / 半选图标（数据来自 @xui/icons） */
function CheckboxIcon({ name }: { name: 'check' | 'minus' }) {
  return (
    <svg
      className="xui-checkbox__icon"
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  );
}
