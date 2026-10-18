/**
 * Steps - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 图标：finish 对勾 / error 叉 / 其余数字；连接线随完成态填充主色。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { createStepsLogic } from '@xui-design/shared';
import type { StepStatus } from '@xui-design/shared';
import type { StepsProps } from '@xui-design/core';
import { icons } from '@xui-design/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** 通过 ref 暴露的命令式 API */
export interface StepsRef {
  /** 切换到下一步（越界或目标项禁用时 no-op） */
  next: () => void;
  /** 切换到上一步（越界或目标项禁用时 no-op） */
  prev: () => void;
  /** 切换到指定步骤（越界或目标项禁用时 no-op） */
  goTo: (index: number) => void;
}

/** Steps 组件 Props（契约 Props 基础上扩展 React 专属属性） */
export type StepsComponentProps = StepsProps & {
  /** 自定义步骤图标渲染（参数为推导状态与索引） */
  renderIcon?: (status: StepStatus, index: number) => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<StepsRef>;
};

function StepIcon({
  status,
  index,
  renderIcon,
}: {
  status: StepStatus;
  index: number;
  renderIcon?: (status: StepStatus, index: number) => ReactNode;
}) {
  if (renderIcon) return <>{renderIcon(status, index)}</>;
  if (status === 'finish') {
    return (
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: icons.check }}
      />
    );
  }
  if (status === 'error') {
    return (
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: icons.close }}
      />
    );
  }
  return <span className="xui-steps__index">{index + 1}</span>;
}

export function Steps(props: StepsComponentProps) {
  const {
    items,
    value,
    defaultValue,
    status,
    direction = 'horizontal',
    className,
    style,
    onChange,
    renderIcon,
    ref,
  } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑
  const callbacksRef = useRef({ onChange });
  callbacksRef.current = { onChange };

  const logicRef = useRef<ReturnType<typeof createStepsLogic> | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createStepsLogic({
      items,
      value,
      defaultValue,
      status,
      direction,
      onChange: (index) => callbacksRef.current.onChange?.(index),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ items, value, status, direction });
  }, [logic, items, value, status, direction]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      next: () => logic.next(),
      prev: () => logic.prev(),
      goTo: (index: number) => logic.select(index),
    }),
    [logic],
  );

  return (
    <div
      className={cn('xui-steps', className, `is-${state.direction}`)}
      style={style as CSSProperties}
      role="list"
    >
      {items.map((item, index) => {
        const stepStatus = logic.getStatus(index);
        return (
          <div
            key={item.key}
            className={cn('xui-steps__item', `is-${stepStatus}`, {
              'is-disabled': item.disabled,
              'is-current': index === state.value,
            })}
            role="listitem"
            aria-current={index === state.value ? 'step' : undefined}
            aria-disabled={item.disabled || undefined}
            onClick={() => logic.select(index)}
          >
            {index > 0 && (
              <span
                className={cn('xui-steps__line', {
                  'is-finished': stepStatus === 'finish',
                })}
              />
            )}
            <span className="xui-steps__icon">
              <StepIcon status={stepStatus} index={index} renderIcon={renderIcon} />
            </span>
            <span className="xui-steps__body">
              <span className="xui-steps__title">{item.title}</span>
              {item.description && (
                <span className="xui-steps__description">{item.description}</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
