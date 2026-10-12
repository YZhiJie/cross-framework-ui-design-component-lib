/**
 * Spin - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑。
 * size / spinning / tip 收敛在逻辑层完成；纯展示组件，无交互回调。
 * 支持独立模式（无 children）与包裹模式（children + 遮罩）。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { SpinProps } from '@xui-design/core';
import { createSpinLogic } from '@xui-design/shared';
import type { SpinLogicInstance } from '@xui-design/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Spin 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type SpinComponentProps = SpinProps & {
  /** 包裹内容（spinning 时覆盖半透明遮罩） */
  children?: ReactNode;
};

export function Spin(props: SpinComponentProps) {
  const { size = 'md', spinning = true, tip, className, style, children } = props;

  const logicRef = useRef<SpinLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createSpinLogic({ size, spinning, tip });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ size, spinning, tip });
  }, [logic, size, spinning, tip]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // 包裹模式：内容 + 加载遮罩
  if (children !== undefined) {
    return (
      <div
        className={cn('xui-spin', 'xui-spin--wrapper', className)}
        style={style as CSSProperties}
      >
        <div className={cn('xui-spin__content', { 'is-blur': state.spinning })}>{children}</div>
        {state.spinning && (
          <div className="xui-spin__mask" role="status" aria-live="polite">
            <span className={cn('xui-spin__indicator', `is-${state.size}`)} aria-hidden="true" />
            {state.tip && <span className="xui-spin__tip">{state.tip}</span>}
          </div>
        )}
      </div>
    );
  }

  // 独立模式：无包裹内容时单独渲染指示器（spinning=false 不渲染）
  if (!state.spinning) return null;
  return (
    <span
      className={cn('xui-spin', className)}
      style={style as CSSProperties}
      role="status"
      aria-live="polite"
    >
      <span className={cn('xui-spin__indicator', `is-${state.size}`)} aria-hidden="true" />
      {state.tip && <span className="xui-spin__tip">{state.tip}</span>}
    </span>
  );
}
