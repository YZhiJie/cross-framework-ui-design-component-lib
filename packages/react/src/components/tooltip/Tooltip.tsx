/**
 * Tooltip - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * CSS 包裹定位（非 portal）：popper 相对根元素绝对定位，
 * 监听绑定在根元素上，悬停提示框本身不会触发 leave。
 * renderContent 回调对应 Vue 具名插槽 #content。
 */

import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { TooltipProps } from '@xui/core';
import { createTooltipLogic } from '@xui/shared';
import type { TooltipLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Tooltip 组件 Props（契约 Props + 插槽映射的渲染回调） */
export type TooltipComponentProps = TooltipProps & {
  /** 触发元素 */
  children?: ReactNode;
  /** 提示内容渲染回调（对应 Vue 具名插槽 #content，覆盖 content prop） */
  renderContent?: () => ReactNode;
};

export function Tooltip(props: TooltipComponentProps) {
  const {
    content,
    placement = 'top',
    trigger = 'hover',
    disabled = false,
    className,
    style,
    children,
    renderContent,
  } = props;

  const popperId = useId();

  const logicRef = useRef<TooltipLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createTooltipLogic({ disabled });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（运行时禁用会收起已展开的提示框）
  useEffect(() => {
    logic.updateOptions({ disabled });
  }, [logic, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // hover / focus 触发由 trigger prop 门控
  const handleEnter = () => {
    if (trigger === 'hover') logic.show();
  };
  const handleLeave = () => {
    if (trigger === 'hover') logic.hide();
  };
  const handleFocus = () => {
    if (trigger === 'focus') logic.show();
  };
  const handleBlur = () => {
    if (trigger === 'focus') logic.hide();
  };

  return (
    <span
      className={cn('xui-tooltip', className)}
      style={style as CSSProperties}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <span className="xui-tooltip__trigger" aria-describedby={state.open ? popperId : undefined}>
        {children}
      </span>
      {state.open && (
        <span id={popperId} className={cn('xui-tooltip__popper', `is-${placement}`)} role="tooltip">
          {renderContent ? renderContent() : content}
          <span className="xui-tooltip__arrow" aria-hidden="true" />
        </span>
      )}
    </span>
  );
}
