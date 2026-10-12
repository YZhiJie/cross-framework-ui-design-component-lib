/**
 * Skeleton - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑。
 * rows 收敛在逻辑层完成；纯展示组件，无交互回调。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { SkeletonProps } from '@xui-design/core';
import { createSkeletonLogic } from '@xui-design/shared';
import type { SkeletonLogicInstance } from '@xui-design/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';
import { cn } from '../../utils/cn';

/** Skeleton 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type SkeletonComponentProps = SkeletonProps & {
  /** 真实内容（loading=false 时渲染） */
  children?: ReactNode;
};

export function Skeleton(props: SkeletonComponentProps) {
  const { loading = true, avatar = false, rows = 3, className, style, children } = props;

  // 状态 aria-label 取全局语言包（setLocale / registerLocale 后响应式更新）
  const locale = useLocaleData();

  const logicRef = useRef<SkeletonLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createSkeletonLogic({ loading, avatar, rows });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ loading, avatar, rows });
  }, [logic, loading, avatar, rows]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // 真实内容：loading=false 时渲染 children（无 children 则不渲染）
  if (!state.loading) {
    return children !== undefined ? <>{children}</> : null;
  }

  // 骨架占位：头像 + 段落行（末行短宽度）
  return (
    <div
      className={cn('xui-skeleton', className)}
      style={style as CSSProperties}
      role="status"
      aria-label={locale.skeleton.loading}
    >
      {state.avatar && <span className="xui-skeleton__avatar" aria-hidden="true" />}
      <div className="xui-skeleton__rows" aria-hidden="true">
        {Array.from({ length: state.rows }, (_, index) => (
          <span
            key={index}
            className={index === state.rows - 1 ? 'xui-skeleton__row is-last' : 'xui-skeleton__row'}
          />
        ))}
      </div>
    </div>
  );
}
