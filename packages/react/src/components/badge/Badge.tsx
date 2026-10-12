/**
 * Badge - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑。
 * 可见性与文本派生在逻辑层完成；纯展示组件，无交互回调。
 * 有 children 时为包裹模式（徽标叠加在内容右上角），否则独立渲染。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { BadgeProps } from '@xui-design/core';
import { createBadgeLogic } from '@xui-design/shared';
import type { BadgeLogicInstance } from '@xui-design/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Badge 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type BadgeComponentProps = BadgeProps & {
  /** 徽标包裹的内容（未提供时徽标独立渲染） */
  children?: ReactNode;
};

export function Badge(props: BadgeComponentProps) {
  const { count, max = 99, dot = false, showZero = false, className, style, children } = props;

  const logicRef = useRef<BadgeLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createBadgeLogic({ count, max, dot, showZero });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ count, max, dot, showZero });
  }, [logic, count, max, dot, showZero]);

  const state = useLogicState(logic.subscribe, logic.getState);

  if (children !== undefined && children !== null) {
    return (
      <span className={cn('xui-badge', className)} style={style as CSSProperties}>
        {children}
        {state.visible ? (
          <sup className={cn('xui-badge__sup', { 'is-dot': dot })} aria-hidden={dot || undefined}>
            {state.text}
          </sup>
        ) : null}
      </span>
    );
  }
  return state.visible ? (
    <sup
      className={cn('xui-badge__sup', 'xui-badge__sup--standalone', { 'is-dot': dot })}
      aria-hidden={dot || undefined}
    >
      {state.text}
    </sup>
  ) : null;
}
