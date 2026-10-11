/**
 * Pagination - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * role="navigation" + aria-current="page"，页码序列由 createPageItems 纯函数生成。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { PaginationProps } from '@xui/core';
import { createPageItems, createPaginationLogic } from '@xui/shared';
import type { PageItem, PaginationLogicInstance } from '@xui/shared';
import { icons } from '@xui/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Pagination 组件 Props（契约 Props 原样透传） */
export type PaginationComponentProps = PaginationProps;

const isNumberItem = (item: PageItem): item is number => typeof item === 'number';

export function Pagination(props: PaginationComponentProps) {
  const {
    value,
    defaultValue,
    total,
    pageSize = 10,
    disabled = false,
    className,
    style,
    onChange,
  } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onChange });
  callbacksRef.current = { onChange };

  // 逻辑实例只创建一次：value 提供即受控，否则用 defaultValue 非受控
  const logicRef = useRef<PaginationLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createPaginationLogic({
      value,
      defaultValue,
      total,
      pageSize,
      disabled,
      onChange: (page) => callbacksRef.current.onChange?.(page),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（受控模式：value 变更 → 逻辑层；total/pageSize 变更重算页数）
  useEffect(() => {
    logic.updateOptions({ value, total, pageSize, disabled });
  }, [logic, value, total, pageSize, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  const pageItems = createPageItems(state.page, state.pageCount);

  return (
    <nav
      className={cn('xui-pagination', className, { 'is-disabled': state.disabled })}
      style={style as CSSProperties}
      role="navigation"
      aria-label="分页"
    >
      <button
        type="button"
        className="xui-pagination__nav"
        disabled={state.disabled || state.page <= 1}
        aria-label="上一页"
        onClick={() => logic.prev()}
      >
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
          dangerouslySetInnerHTML={{ __html: icons['arrow-left'] }}
        />
      </button>
      {pageItems.map((item, index) =>
        isNumberItem(item) ? (
          <button
            key={`${item}-${index}`}
            type="button"
            className={cn('xui-pagination__page', { 'is-active': item === state.page })}
            aria-current={item === state.page ? 'page' : undefined}
            disabled={state.disabled}
            onClick={() => logic.goTo(item)}
          >
            {item}
          </button>
        ) : (
          <span key={`${item}-${index}`} className="xui-pagination__ellipsis" aria-hidden="true">
            ···
          </span>
        ),
      )}
      <button
        type="button"
        className="xui-pagination__nav"
        disabled={state.disabled || state.page >= state.pageCount}
        aria-label="下一页"
        onClick={() => logic.next()}
      >
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
          dangerouslySetInnerHTML={{ __html: icons['arrow-right'] }}
        />
      </button>
    </nav>
  );
}
