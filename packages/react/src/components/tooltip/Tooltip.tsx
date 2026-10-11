/**
 * Tooltip - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * CSS 包裹定位（非 portal）：popper 相对 trigger 元素绝对定位（trigger 始终贴合触发器，
 * 避免包裹根在 flex/grid stretch 布局中被拉宽导致气泡错位）；
 * 打开时经 resolveFloatingPosition 做视口避让（空间不足翻转方位 + 交叉轴钳制），
 * 监听绑定在根元素上，悬停提示框本身不会触发 leave。
 * renderContent 回调对应 Vue 具名插槽 #content。
 */
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { TooltipProps } from '@xui/core';
import {
  bindViewportUpdate,
  createTooltipLogic,
  getViewport,
  resolveFloatingPosition,
} from '@xui/shared';
import type { FloatingPlacement, TooltipLogicInstance } from '@xui/shared';
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

  // 视口避让：实际方位（可能翻转）与交叉轴 shift（px）
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const popperRef = useRef<HTMLSpanElement | null>(null);
  const [resolved, setResolved] = useState<{ placement: FloatingPlacement; shift: number }>({
    placement,
    shift: 0,
  });

  useLayoutEffect(() => {
    if (!state.open) return;
    setResolved({ placement, shift: 0 });
    // 以首选方位完成首帧布局后再测量（setState 后的 layout effect 中 popper 已按首选方位挂载）
    const update = () => {
      const triggerEl = triggerRef.current;
      const popperEl = popperRef.current;
      if (!triggerEl || !popperEl) return;
      const popperRect = popperEl.getBoundingClientRect();
      // 零尺寸表示未完成布局（jsdom 环境恒为 0），保持首选方位避免误翻转
      if (popperRect.width === 0 && popperRect.height === 0) return;
      setResolved(
        resolveFloatingPosition(triggerEl.getBoundingClientRect(), popperRect, getViewport(), {
          placement,
          gap: 8,
        }),
      );
    };
    const raf = requestAnimationFrame(update);
    const unbind = bindViewportUpdate(update);
    return () => {
      cancelAnimationFrame(raf);
      unbind();
    };
  }, [state.open, placement]);

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

  const popperStyle: CSSProperties =
    resolved.placement === 'top' || resolved.placement === 'bottom'
      ? { marginLeft: `${resolved.shift}px` }
      : { marginTop: `${resolved.shift}px` };

  return (
    <span
      className={cn('xui-tooltip', className)}
      style={style as CSSProperties}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <span
        className="xui-tooltip__trigger"
        ref={triggerRef}
        aria-describedby={state.open ? popperId : undefined}
      >
        {children}
        {state.open && (
          <span
            ref={popperRef}
            id={popperId}
            className={cn('xui-tooltip__popper', `is-${resolved.placement}`)}
            style={popperStyle}
            role="tooltip"
          >
            {renderContent ? renderContent() : content}
            <span className="xui-tooltip__arrow" aria-hidden="true" />
          </span>
        )}
      </span>
    </span>
  );
}
