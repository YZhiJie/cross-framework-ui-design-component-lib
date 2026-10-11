/**
 * Switch - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * value 提供即受控（由 useEffect 同步到逻辑层），否则 defaultValue 非受控。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { SwitchProps } from '@xui/core';
import { createSwitchLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { SwitchLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Switch 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type SwitchComponentProps = SwitchProps & {
  /** 自定义加载图标（loading 状态时替代内置 spinner） */
  renderLoadingIcon?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<SwitchRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface SwitchRef {
  focus: () => void;
}

export function Switch(props: SwitchComponentProps) {
  const {
    value,
    defaultValue,
    size = 'md',
    disabled = false,
    loading = false,
    checkedText,
    uncheckedText,
    className,
    style,
    onChange,
    renderLoadingIcon,
    ref,
  } = props;

  // 双态文本：任一文本提供即进入带文本模式（轨道加宽 + 滑块位移调整）
  const hasText = Boolean(checkedText || uncheckedText);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onChange });
  callbacksRef.current = { onChange };

  // 逻辑实例只创建一次：value 提供即受控，否则用 defaultValue 非受控
  const logicRef = useRef<SwitchLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createSwitchLogic({
      value,
      defaultValue,
      disabled,
      loading,
      onChange: (next) => callbacksRef.current.onChange?.(next),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（value 为受控同步，仅更新状态不触发回调）
  useEffect(() => {
    logic.updateOptions({ value, disabled, loading });
  }, [logic, value, disabled, loading]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => buttonRef.current?.focus(),
    }),
    // 工厂仅引用稳定的 ref；logic 实例只创建一次，依赖数组留空避免多余依赖警告
    [],
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      role="switch"
      className={cn(
        'xui-switch',
        `xui-switch--${size}`,
        {
          'is-checked': state.checked,
          'is-disabled': state.disabled,
          'is-loading': state.loading,
          'xui-switch--has-text': hasText,
        },
        className,
      )}
      style={style as CSSProperties}
      aria-checked={state.checked}
      aria-disabled={state.disabled || state.loading}
      disabled={state.disabled || state.loading}
      onClick={() => logic.toggle()}
    >
      <span className="xui-switch__core">
        {/* 双态文本：状态已由 role="switch" + aria-checked 传达，文本对读屏隐藏避免重复朗读 */}
        {(() => {
          const text = state.checked ? checkedText : uncheckedText;
          return text ? (
            <span
              className={cn(
                'xui-switch__text',
                state.checked ? 'xui-switch__text--checked' : 'xui-switch__text--unchecked',
              )}
              title={text}
              aria-hidden="true"
            >
              {text}
            </span>
          ) : null;
        })()}
        <span className="xui-switch__thumb">
          {state.loading && (renderLoadingIcon ? renderLoadingIcon() : <LoadingSpinner />)}
        </span>
      </span>
    </button>
  );
}

/** 加载图标（数据来自 @xui/icons，旋转动画由 CSS 驱动） */
function LoadingSpinner() {
  return (
    <svg
      className="xui-switch__spinner"
      viewBox="0 0 24 24"
      width="10"
      height="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icons.loading }}
    />
  );
}
