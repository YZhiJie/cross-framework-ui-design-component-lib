/**
 * TimeSlotPicker - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 的网格与选择逻辑；
 * 视觉参考贡献热力图，支持按日 / 周 / 月 / 年四种粒度。
 * 交互：点击切换、按住拖拽矩形框选（mousedown 锚点与当前格子构成矩形，
 * mouseup 提交；从已选格子开始拖拽为取消选中）。
 */

import { Fragment, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import type { CSSProperties, MouseEvent, Ref } from 'react';
import { createTimeSlotPickerLogic } from '@xui-design/shared';
import type {
  TimeSlotGrid,
  TimeSlotGridCell,
  TimeSlotGridColumn,
  TimeSlotGridRow,
} from '@xui-design/shared';
import type { TimeSlotPickerProps } from '@xui-design/core';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';
import { cn } from '../../utils/cn';

/** 通过 ref 暴露的命令式 API（与 Vue 适配层的 TimeSlotPickerRef 对齐） */
export interface TimeSlotPickerRef {
  /** 清空全部选中时段 */
  clear: () => void;
  /** 选中当前粒度下的全部时段 */
  selectAll: () => void;
  /** 切换指定时段 */
  toggle: (key: string) => void;
}

/** TimeSlotPicker 组件 Props（契约 Props 基础上扩展 React 19 ref-as-prop） */
export type TimeSlotPickerComponentProps = TimeSlotPickerProps & {
  ref?: Ref<TimeSlotPickerRef>;
};

const pad2 = (value: number): string => String(value).padStart(2, '0');

export function TimeSlotPicker(props: TimeSlotPickerComponentProps) {
  const {
    granularity = 'week',
    value,
    defaultValue = [],
    referenceDate = '',
    showFooter = true,
    disabled = false,
    className,
    style,
    onChange,
    ref,
  } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑
  const callbacksRef = useRef({ onChange });
  callbacksRef.current = { onChange };

  const logicRef = useRef<ReturnType<typeof createTimeSlotPickerLogic> | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createTimeSlotPickerLogic({
      granularity,
      value,
      defaultValue,
      referenceDate,
      onChange: (next) => callbacksRef.current.onChange?.(next),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ granularity, value, referenceDate });
  }, [logic, granularity, value, referenceDate]);

  const state = useLogicState(logic.subscribe, logic.getState);
  const locale = useLocaleData();
  const grid: TimeSlotGrid = logic.getGrid();
  const selectedSet = useMemo(() => new Set(state.value), [state.value]);
  const paintKeys = useMemo(() => new Set(state.paint?.keys ?? []), [state.paint]);

  /** 格子类名：选中态 + 框选预览态（预览只改变视觉，不等同于已提交的选中） */
  const cellClass = (key: string) => {
    const selected = selectedSet.has(key);
    const session = state.paint;
    const previewing = session !== null && paintKeys.has(key);
    return {
      'is-selected': selected,
      'is-preview-selected': previewing && session !== null && session.selected && !selected,
      'is-preview-unselected': previewing && session !== null && !session.selected && selected,
    };
  };

  const paintModeRef = useRef<boolean | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      if (paintModeRef.current === null) return;
      paintModeRef.current = null;
      logic.endPaint();
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [logic]);

  useImperativeHandle(
    ref,
    () => ({
      clear: () => logic.clear(),
      selectAll: () => logic.selectAll(),
      toggle: (key: string) => logic.toggle(key),
    }),
    [logic],
  );

  const showColumnHeader = granularity !== 'day';
  const showCellText = granularity === 'day' || granularity === 'month';

  const columnLabel = (column: TimeSlotGridColumn): string => {
    const data = locale.timeSlotPicker;
    if (column.kind === 'hour') {
      return granularity === 'week' && column.index % 3 === 0 ? pad2(column.index) : '';
    }
    if (column.kind === 'weekday') return data.weekdays[column.index - 1] ?? '';
    if (column.kind === 'month') return data.months[column.index - 1] ?? '';
    return '';
  };

  const rowLabel = (row: TimeSlotGridRow): string => {
    if (row.weekday === undefined) return '';
    return locale.timeSlotPicker.weekdays[row.weekday - 1] ?? '';
  };

  const cellLabel = (cell: TimeSlotGridCell): string => {
    const data = locale.timeSlotPicker;
    if (cell.hour !== undefined) {
      const hour = data.hour(cell.hour);
      if (cell.weekday !== undefined) {
        return `${data.weekdays[cell.weekday - 1] ?? ''} ${hour}`;
      }
      return hour;
    }
    if (cell.date) {
      const [year, month, day] = cell.date.split('-').map(Number);
      return data.dateLabel(year, month, day);
    }
    return '';
  };

  const cellText = (cell: TimeSlotGridCell): string => {
    if (granularity === 'month') return String(cell.day ?? '');
    if (granularity === 'day') return pad2(cell.hour ?? 0);
    return '';
  };

  const summaryText =
    state.selectedCount === 0
      ? locale.timeSlotPicker.hint
      : locale.timeSlotPicker.summary(state.selectedCount, state.total);

  const gridStyle = {
    '--xui-time-slot-columns': String(grid.columns.length),
  } as CSSProperties;

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>, key: string) => {
    if (disabled) return;
    // 阻止拖拽框选时触发文本选择 / 原生拖拽
    event.preventDefault();
    paintModeRef.current = logic.beginPaint(key);
  };

  const handleMouseEnter = (key: string) => {
    if (disabled || paintModeRef.current === null) return;
    logic.paintTo(key);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>, key: string) => {
    if (disabled) return;
    // 鼠标点击已由 mousedown 处理；键盘触发的 click（detail 为 0 / undefined）在此切换
    if (!event.detail) logic.toggle(key);
  };

  return (
    <div
      className={cn(
        'xui-time-slot-picker',
        `xui-time-slot-picker--${granularity}`,
        { 'is-disabled': disabled },
        className,
      )}
      style={style as CSSProperties}
      role="group"
      aria-label={locale.timeSlotPicker.region}
      aria-disabled={disabled || undefined}
    >
      <div className="xui-time-slot-picker__scroll">
        <div className="xui-time-slot-picker__grid" style={gridStyle}>
          {showColumnHeader && (
            <>
              <span className="xui-time-slot-picker__corner" aria-hidden="true" />
              {grid.columns.map((column) => (
                <span
                  key={column.key}
                  className={cn('xui-time-slot-picker__col-label', {
                    'is-month': column.kind === 'month',
                  })}
                  aria-hidden="true"
                >
                  {columnLabel(column)}
                </span>
              ))}
            </>
          )}

          {grid.rows.map((row) => (
            <Fragment key={row.key}>
              <span className="xui-time-slot-picker__row-label" aria-hidden="true">
                {rowLabel(row)}
              </span>
              {row.cells.map((cell, index) =>
                cell ? (
                  <button
                    key={cell.key}
                    type="button"
                    className={cn('xui-time-slot-picker__cell', cellClass(cell.key))}
                    disabled={disabled}
                    aria-pressed={selectedSet.has(cell.key)}
                    aria-label={cellLabel(cell)}
                    title={cellLabel(cell)}
                    onMouseDown={(event) => handleMouseDown(event, cell.key)}
                    onMouseEnter={() => handleMouseEnter(cell.key)}
                    onClick={(event) => handleClick(event, cell.key)}
                  >
                    {showCellText && (
                      <span className="xui-time-slot-picker__cell-text">{cellText(cell)}</span>
                    )}
                  </button>
                ) : (
                  <span
                    key={`${row.key}-blank-${index}`}
                    className="xui-time-slot-picker__cell is-empty"
                    aria-hidden="true"
                  />
                ),
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {showFooter && (
        <div className="xui-time-slot-picker__footer">
          <span className="xui-time-slot-picker__summary">{summaryText}</span>
          <span className="xui-time-slot-picker__legend">
            <span className="xui-time-slot-picker__legend-item">
              <span className="xui-time-slot-picker__legend-swatch" aria-hidden="true" />
              {locale.timeSlotPicker.unselected}
            </span>
            <span className="xui-time-slot-picker__legend-item">
              <span
                className="xui-time-slot-picker__legend-swatch is-selected"
                aria-hidden="true"
              />
              {locale.timeSlotPicker.selected}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
