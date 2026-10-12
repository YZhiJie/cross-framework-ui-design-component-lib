/**
 * Table - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 非受控内部排序：点击可排序列表头循环 升序 → 降序 → 取消，
 * aria-sort 同步表头状态，renderEmpty 回调对应 Vue 具名插槽 #empty。
 * 虚拟滚动由 createVirtualListLogic 驱动（spacer 行 + 可视窗口切片），
 * 行选择由逻辑层维护（受控 rowSelection.selectedRowKeys 优先）。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { TableColumn, TableProps, TableRow } from '@xui/core';
import {
  createTableLogic,
  createVirtualListLogic,
  formatTableCellValue,
  getRowKeyOf,
} from '@xui/shared';
import type { TableLogicInstance } from '@xui/shared';
import { icons } from '@xui/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';
import { cn } from '../../utils/cn';

/** Table 组件 Props（契约 Props + 插槽映射的渲染回调） */
export type TableComponentProps = TableProps & {
  /** 空数据内容渲染回调（对应 Vue 具名插槽 #empty） */
  renderEmpty?: () => React.ReactNode;
  /** 自定义排序图标（asc / desc 各调用一次，默认渲染内联 SVG） */
  renderSortIcon?: (ctx: { order: 'asc' | 'desc' }) => ReactNode;
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
    virtual = false,
    height,
    rowHeight = 40,
    rowSelection,
    className,
    style,
    onSortChange,
    onRowClick,
    renderEmpty,
    renderSortIcon,
  } = props;

  // 空态回退文案 / 行选择 aria 取全局语言包（setLocale / registerLocale 后响应式更新）
  const locale = useLocaleData();

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onSortChange });
  callbacksRef.current = { onSortChange };

  const logicRef = useRef<TableLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createTableLogic({
      dataSource,
      rowKey,
      rowSelection,
      onSortChange: (sort) => callbacksRef.current.onSortChange?.(sort),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（dataSource 变更保持当前排序重排）
  useEffect(() => {
    logic.updateOptions({ dataSource, rowKey, rowSelection });
  }, [logic, dataSource, rowKey, rowSelection]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // ---- 虚拟滚动 ----
  const vlRef = useRef<ReturnType<typeof createVirtualListLogic> | null>(null);
  if (vlRef.current === null) {
    vlRef.current = createVirtualListLogic({ itemCount: 0, itemHeight: rowHeight });
  }
  const vl = vlRef.current;

  const vlState = useLogicState(vl.subscribe, vl.getState);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!virtual) return;
    const el = scrollRef.current;
    if (!el) return;
    vl.updateOptions({ viewportHeight: el.clientHeight });
    // jsdom / 旧环境无 ResizeObserver：跳过视口尺寸跟随（初始值已同步）
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      vl.updateOptions({ viewportHeight: el.clientHeight });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [vl, virtual]);

  useEffect(() => {
    if (!virtual) return;
    vl.updateOptions({ itemCount: state.sortedData.length, itemHeight: rowHeight });
  }, [vl, virtual, state.sortedData.length, rowHeight]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!virtual) return;
    vl.scrollTo(event.currentTarget.scrollTop);
  };

  // 渲染窗口：虚拟模式切片，否则全量
  const data = state.sortedData;
  const useWindow = virtual && vlState.startIndex <= vlState.endIndex;
  const rows = useWindow ? data.slice(vlState.startIndex, vlState.endIndex + 1) : data;
  const rowOffset = (i: number): number => (virtual ? vlState.startIndex + i : i);

  // ---- 自定义透传与派生标志 ----
  const hasSelection = rowSelection !== undefined;
  const colspan = (columns ?? []).length + (hasSelection ? 1 : 0);

  // CSS 变量键（--xui-*）不在 CSSProperties 索引内，经 Record 组装后断言
  const rootStyle = {
    ...style,
    ...(virtual
      ? {
          ...(height !== undefined
            ? { height: typeof height === 'number' ? `${height}px` : height }
            : {}),
          '--xui-table-row-height': `${rowHeight}px`,
        }
      : {}),
  } as CSSProperties;

  const isEmpty = data.length === 0;

  const cellText = (column: TableColumn, record: TableRow, index: number): string =>
    column.render ? column.render(record, index) : formatTableCellValue(record[column.key]);

  return (
    <div
      ref={scrollRef}
      className={cn('xui-table', className, {
        'is-striped': stripe,
        'is-bordered': border,
        'is-virtual': virtual,
      })}
      style={Object.keys(rootStyle).length > 0 ? rootStyle : undefined}
      onScroll={handleScroll}
    >
      <table className="xui-table__table">
        <thead>
          <tr>
            {hasSelection && (
              <th className="xui-table__th" style={{ width: '42px' }}>
                <input
                  ref={(el) => {
                    // indeterminate 为 DOM property，React JSX 不支持，经 ref 设置
                    if (el) el.indeterminate = state.indeterminate;
                  }}
                  type="checkbox"
                  className="xui-table__check"
                  checked={state.allSelected}
                  aria-label={locale.table.selectAll}
                  onChange={() => logic.toggleAll()}
                />
              </th>
            )}
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
                      {renderSortIcon ? (
                        <>
                          {renderSortIcon({ order: 'asc' })}
                          {renderSortIcon({ order: 'desc' })}
                        </>
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            width="10"
                            height="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className={cn({
                              'is-active':
                                state.sortKey === column.key && state.sortOrder === 'asc',
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
                            aria-hidden="true"
                            className={cn({
                              'is-active':
                                state.sortKey === column.key && state.sortOrder === 'desc',
                            })}
                            dangerouslySetInnerHTML={{ __html: icons['arrow-down'] }}
                          />
                        </>
                      )}
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
          {useWindow && vlState.offsetY > 0 && (
            <tr className="xui-table__spacer" aria-hidden="true">
              <td style={{ height: `${vlState.offsetY}px` }} colSpan={colspan} />
            </tr>
          )}
          {rows.map((record, i) => {
            const index = rowOffset(i);
            const key = getRowKeyOf(record, index, rowKey);
            const selected = state.selectedRowKeys.includes(key);
            const checkboxDisabled = rowSelection?.getCheckboxDisabled?.(record, index) ?? false;
            return (
              <tr
                key={key}
                className={cn({
                  'is-even': index % 2 === 1,
                  'is-selected': hasSelection && selected,
                  'is-clickable': onRowClick !== undefined,
                })}
                onClick={() => onRowClick?.(record, index)}
              >
                {hasSelection && (
                  <td className="xui-table__td" onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="xui-table__check"
                      checked={selected}
                      disabled={checkboxDisabled}
                      aria-label={locale.table.selectRow(index)}
                      onChange={() => logic.toggleRow(key)}
                    />
                  </td>
                )}
                {(columns ?? []).map((column) => (
                  <td key={column.key} className="xui-table__td" style={cellStyle(column)}>
                    {cellText(column, record, index)}
                  </td>
                ))}
              </tr>
            );
          })}
          {useWindow && vlState.fillerHeight > 0 && (
            <tr className="xui-table__spacer" aria-hidden="true">
              <td style={{ height: `${vlState.fillerHeight}px` }} colSpan={colspan} />
            </tr>
          )}
          {isEmpty && (
            <tr>
              <td className="xui-table__empty" colSpan={colspan}>
                {renderEmpty ? renderEmpty() : locale.table.empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
