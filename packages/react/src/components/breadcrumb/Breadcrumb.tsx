/**
 * Breadcrumb - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 末项判定 / 可点击守卫在逻辑层完成；href 导航由 <a> 原生完成。
 */

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { BreadcrumbProps } from '@xui/core';
import { createBreadcrumbLogic } from '@xui/shared';
import type { BreadcrumbLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Breadcrumb 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type BreadcrumbComponentProps = BreadcrumbProps & {
  /** 自定义内容区（覆盖 items 渲染） */
  children?: ReactNode;
};

export function Breadcrumb(props: BreadcrumbComponentProps) {
  const { items, separator = '/', onItemClick, children } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onItemClick });
  callbacksRef.current = { onItemClick };

  const logicRef = useRef<BreadcrumbLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createBreadcrumbLogic({
      items,
      separator,
      onItemClick: (item, index) => callbacksRef.current.onItemClick?.(item, index),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ items, separator });
  }, [logic, items, separator]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // 自定义内容区：children 覆盖 items 渲染
  if (children !== undefined) {
    return (
      <nav className="xui-breadcrumb" aria-label="面包屑">
        {children}
      </nav>
    );
  }

  const last = state.items.length - 1;
  return (
    <nav className="xui-breadcrumb" aria-label="面包屑">
      <ol className="xui-breadcrumb__list">
        {state.items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className={cn('xui-breadcrumb__item', {
              'is-active': index === last,
              'is-disabled': item.disabled,
            })}
          >
            {item.href && index !== last && !item.disabled ? (
              <a
                className="xui-breadcrumb__link"
                href={item.href}
                onClick={() => logic.selectItem(index)}
              >
                {item.label}
              </a>
            ) : (
              <span
                className="xui-breadcrumb__label"
                aria-current={index === last ? 'page' : undefined}
                onClick={() => logic.selectItem(index)}
              >
                {item.label}
              </span>
            )}
            {index !== last && (
              <span className="xui-breadcrumb__separator" aria-hidden="true">
                {state.separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
