/**
 * Table - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 非受控内部排序：点击可排序列表头循环 升序 → 降序 → 取消，
 * aria-sort 同步表头状态，renderEmpty 回调对应 Vue 具名插槽 #empty。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { TableColumn, TableProps } from '@xui/core';
import { createTableLogic, formatTableCellValue } from '@xui/shared';
import type { TableLogicInstance } from '@xui/shared';
import { icons } from '@xui/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Table 组件 Props（契约 Props + 插槽映射的渲染回调） */
export type TableComponentProps = TableProps & {
  /** 空数据内容渲染回调（对应 Vue 具名插槽 #empty） */
  renderEmpty?: () => React.ReactNode;
};

const cellStyle = (column: TableColumn): CSSProperties | undefined => {
  const style: CSSProperties = {};
  if (column.width !== undefined) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
  }
  if (column.align !== undefined) {
    style.textAlign = column.align;
  }
  return Object.keys(style).length > 0 ? style : undefined;
};

const ariaSort = (column: TableColumn, sortKey: string | null, sortOrder: string | null) => {
  if (sortKey !== column.key) return undefined;
  return sortOrder === 'asc' ? 'ascending' : 'descending';
};

export function Table(props: TableComponentProps) {
  const {
    columns,
    dataSource,
    rowKey,
    stripe = false,
    border = false,
    onSortChange,
    renderEmpty,
  } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onSortChange });
  callbacksRef.current = { onSortChange };

  const logicRef = useRef<TableLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createTableLogic({
      dataSource,
      onSortChange: (sort) => callbacksRef.current.onSortChange?.(sort),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（dataSource 变更保持当前排序重排）
  useEffect(() => {
    logic.updateOptions({ dataSource });
  }, [logic, dataSource]);

  const state = useLogicState(logic.subscribe, logic.getState);

  const rowKeyOf = (record: Record<string, unknown>, index: number): string | number => {
    if (rowKey === undefined) return index;
    const key = record[rowKey];
    return typeof key === 'string' || typeof key === 'number' ? key : index;
  };

  const cellText = (column: TableColumn, record: Record<string, unknown>, index: number): string =>
    column.render ? column.render(record, index) : formatTableCellValue(record[column.key]);

  const isEmpty = state.sortedData.length === 0;

  return (
    <div className={cn('xui-table', { 'is-striped': stripe, 'is-bordered': border })}>
      <table className="xui-table__table">
        <thead>
          <tr>
            {(columns ?? []).map((column) => (
              <th
                key={column.key}
                className="xui-table__th"
                style={cellStyle(column)}
                aria-sort={ariaSort(column, state.sortKey, state.sortOrder)}
                scope="col"
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className="xui-table__sort"
                    onClick={() => logic.toggleSort(column.key)}
                  >
                    {column.title}
                    <span className="xui-table__sort-icons" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        width="10"
                        height="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn({
                          'is-active': state.sortKey === column.key && state.sortOrder === 'asc',
                        })}
                        dangerouslySetInnerHTML={{ __html: icons['arrow-up'] }}
                      />
                      <svg
                        viewBox="0 0 24 24"
                        width="10"
                        height="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn({
                          'is-active': state.sortKey === column.key && state.sortOrder === 'desc',
                        })}
                        dangerouslySetInnerHTML={{ __html: icons['arrow-down'] }}
                      />
                    </span>
                  </button>
                ) : (
                  <span>{column.title}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.sortedData.map((record, index) => (
            <tr key={rowKeyOf(record, index)}>
              {(columns ?? []).map((column) => (
                <td key={column.key} className="xui-table__td" style={cellStyle(column)}>
                  {cellText(column, record, index)}
                </td>
              ))}
            </tr>
          ))}
          {isEmpty && (
            <tr>
              <td className="xui-table__empty" colSpan={(columns ?? []).length || 1}>
                {renderEmpty ? renderEmpty() : '暂无数据'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
