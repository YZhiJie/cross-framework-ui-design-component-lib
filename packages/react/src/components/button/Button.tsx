/**
 * Button - React 19 适配层
 *
 * 使用 ref-as-prop（无需 forwardRef）+ useSyncExternalStore 桥接 @xui/shared 逻辑。
 * 通过 useImperativeHandle 暴露 focus / setLoading。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, MouseEvent, ReactNode, Ref } from 'react';
import type { ButtonProps } from '@xui/core';
import { createButtonLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { ButtonLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Button 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type ButtonComponentProps = ButtonProps & {
  /** 按钮内容 */
  children?: ReactNode;
  /** 自定义前置图标 */
  renderIcon?: () => ReactNode;
  /** 自定义加载态图标（默认渲染内联 SVG Spinner） */
  renderLoadingIcon?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<ButtonRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface ButtonRef {
  focus: () => void;
  setLoading: (loading: boolean) => void;
}

export function Button(props: ButtonComponentProps) {
  const {
    type = 'default',
    size = 'md',
    disabled = false,
    loading = false,
    block = false,
    className,
    style,
    onClick,
    children,
    renderIcon,
    renderLoadingIcon,
    ref,
  } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

  // 逻辑实例只创建一次：onClick 通过闭包转发到 props.onClick
  const logicRef = useRef<ButtonLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createButtonLogic({
      disabled,
      loading,
      onClick: (event) => onClick?.(event),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（回调变更也需更新，保证最新引用被调用）
  useEffect(() => {
    logic.updateOptions({
      disabled,
      loading,
      onClick: (event) => onClick?.(event),
    });
  }, [logic, disabled, loading, onClick]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => buttonRef.current?.focus(),
      setLoading: (next: boolean) => logic.updateOptions({ loading: next }),
    }),
    [logic],
  );

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    logic.handleClick(e.nativeEvent);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        'xui-button',
        `xui-button--${type}`,
        `xui-button--${size}`,
        {
          'is-disabled': state.disabled,
          'is-loading': state.loading,
          'is-block': block,
        },
        className,
      )}
      style={style as CSSProperties}
      disabled={state.disabled || state.loading}
      onClick={handleClick}
    >
      {state.loading && (
        <span className="xui-button__loading-icon" aria-hidden="true">
          {renderLoadingIcon ? renderLoadingIcon() : <LoadingSpinner />}
        </span>
      )}
      {!state.loading && renderIcon && (
        <span className="xui-button__icon" aria-hidden="true">
          {renderIcon()}
        </span>
      )}
      <span className="xui-button__content">{children}</span>
    </button>
  );
}

/** 加载图标（数据来自 @xui/icons，旋转动画由 CSS 驱动） */
function LoadingSpinner() {
  return (
    <svg
      className="xui-button__spinner"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      dangerouslySetInnerHTML={{ __html: icons.loading }}
    />
  );
}
