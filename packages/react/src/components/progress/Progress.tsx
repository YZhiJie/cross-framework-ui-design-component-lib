/**
 * Progress - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑。
 * percent 收敛与 status 派生在逻辑层完成；纯展示组件，无交互回调。
 */

import { useEffect, useRef } from 'react';
import type { ProgressProps } from '@xui/core';
import { createProgressLogic } from '@xui/shared';
import type { ProgressLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Progress 组件 Props（与契约 Props 一致） */
export type ProgressComponentProps = ProgressProps;

export function Progress(props: ProgressComponentProps) {
  const { percent = 0, type = 'line', strokeWidth = 6, showText = true, status = 'normal' } = props;

  const logicRef = useRef<ProgressLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createProgressLogic({ percent, strokeWidth, status });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ percent, strokeWidth, status });
  }, [logic, percent, strokeWidth, status]);

  const state = useLogicState(logic.subscribe, logic.getState);

  const text = `${Math.round(state.percent)}%`;

  // circle 类型的圆环几何（viewBox 0 0 100 100，12 点方向起始）
  const radius = (100 - state.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - state.percent / 100);

  return (
    <div
      className={cn('xui-progress', `xui-progress--${type}`, `is-${state.status}`)}
      role="progressbar"
      aria-valuenow={Math.round(state.percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {type === 'circle' ? (
        <>
          <svg className="xui-progress__svg" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              className="xui-progress__track"
              cx={50}
              cy={50}
              r={radius}
              fill="none"
              strokeWidth={state.strokeWidth}
            />
            <circle
              className="xui-progress__bar"
              cx={50}
              cy={50}
              r={radius}
              fill="none"
              strokeWidth={state.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          {showText && (
            <span className="xui-progress__text xui-progress__text--circle">{text}</span>
          )}
        </>
      ) : (
        <>
          <div className="xui-progress__track" style={{ height: `${state.strokeWidth}px` }}>
            <div className="xui-progress__bar" style={{ width: `${state.percent}%` }} />
          </div>
          {showText && <span className="xui-progress__text">{text}</span>}
        </>
      )}
    </div>
  );
}
