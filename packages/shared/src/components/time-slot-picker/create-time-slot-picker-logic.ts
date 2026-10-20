/**
 * TimeSlotPicker 纯逻辑工厂
 *
 * 视觉参考 GitHub 贡献热力图：每个格子代表一个投放时段。
 * 网格模型完全由 granularity + referenceDate 推导，双端渲染同一份数据：
 * - day：1 行 × 24 小时；
 * - week：7 行（周一至周日）× 24 小时；
 * - month：周一开始的当月日历，日期格展示在 7 列中；
 * - year：周一开始的整年周列热力图，列头标注每月 1 日所在周。
 *
 * 状态：value（选中 key，去重升序）/ total（当前粒度格子数）/
 *       selectedCount（当前粒度下可见的选中数）/ paint（拖拽框选预览）。
 * 交互：toggle / setSelected / beginPaint + paintTo + endPaint（矩形框选）/
 *       clear / selectAll。
 * 框选：mousedown 锚点 + 当前悬停格子构成矩形，拖拽期间只更新 paint 预览，
 *       mouseup（endPaint）时一次性提交，避免缩小矩形时需要回滚已应用的选择。
 * 受控模式：创建时提供 value 选项即进入受控模式，内部不自行更新 value，
 *       仅回调 onChange；updateOptions 只同步受控值与网格配置。
 *
 * key 规则：
 * - day   h:00 ~ h:23
 * - week  w:1:00 ~ w:7:23（周一 = 1）
 * - month / year  YYYY-MM-DD（两个视图共享日期 key）
 */

import type { LogicInstance, StateListener } from '../../types';

/** 投放时段粒度（与 core 契约一致） */
export type TimeSlotGranularity = 'day' | 'week' | 'month' | 'year';

/** 网格列头类型：小时 / 星期 / 月份 / 空列 */
export type TimeSlotGridColumnKind = 'hour' | 'weekday' | 'month' | 'none';

/** 网格列头 */
export type TimeSlotGridColumn = {
  key: string;
  kind: TimeSlotGridColumnKind;
  /** hour: 0-23；weekday: 1-7；month: 1-12；none: -1 */
  index: number;
};

/** 可选时段格子 */
export type TimeSlotGridCell = {
  key: string;
  /** YYYY-MM-DD（month / year 视图） */
  date?: string;
  /** 1-31（month / year 视图） */
  day?: number;
  /** 0-23（day / week 视图） */
  hour?: number;
  /** 1-7，周一为 1（week / month / year 视图） */
  weekday?: number;
};

/** 网格行（首列为行头，由适配层按 weekday 渲染） */
export type TimeSlotGridRow = {
  key: string;
  /** 1-7，周一为 1（week / year 视图） */
  weekday?: number;
  cells: Array<TimeSlotGridCell | null>;
};

/** 网格布局模型 */
export type TimeSlotGrid = {
  granularity: TimeSlotGranularity;
  columns: TimeSlotGridColumn[];
  rows: TimeSlotGridRow[];
  /** 当前粒度下可选择的格子总数 */
  total: number;
  /** 参考日期所在年份 */
  year: number;
  /** 参考日期所在月份（1-12） */
  month: number;
};

/** TimeSlotPicker 逻辑配置（由适配层从 Props 中提取注入） */
export type TimeSlotPickerLogicOptions = {
  granularity?: TimeSlotGranularity;
  /** 受控选中时段 key 数组（提供即受控） */
  value?: string[];
  /** 非受控初始选中时段 key 数组 */
  defaultValue?: string[];
  /** 月 / 年视图的参考日期（YYYY-MM-DD，默认当天） */
  referenceDate?: string;
  onChange?: (value: string[]) => void;
};

/** 拖拽框选预览：矩形内格子与本次拖拽的统一目标状态 */
export type TimeSlotPickerPaint = {
  /** 矩形覆盖的时段 key（升序） */
  keys: string[];
  /** true 表示框选后选中，false 表示框选后取消选中 */
  selected: boolean;
};

/** TimeSlotPicker 状态快照 */
export type TimeSlotPickerState = {
  value: string[];
  total: number;
  selectedCount: number;
  /** 拖拽框选预览，未处于框选时为 null */
  paint: TimeSlotPickerPaint | null;
};

/** TimeSlotPicker 逻辑实例 */
export interface TimeSlotPickerLogicInstance extends LogicInstance<
  TimeSlotPickerLogicOptions,
  TimeSlotPickerState
> {
  /** 切换单个时段 */
  toggle: (key: string) => void;
  /** 设置单个时段的选中状态 */
  setSelected: (key: string, selected: boolean) => void;
  /** 开始矩形框选，返回本次拖拽的统一目标状态 */
  beginPaint: (key: string) => boolean;
  /** 框选移动到指定时段，与锚点构成矩形并更新预览 */
  paintTo: (key: string) => void;
  /** 结束框选并提交预览结果 */
  endPaint: () => void;
  /** 清空当前全部选中项 */
  clear: () => void;
  /** 选中当前粒度下的全部时段 */
  selectAll: () => void;
  /** 获取当前网格模型（引用稳定，config 变更时重建） */
  getGrid: () => TimeSlotGrid;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad2 = (value: number): string => String(value).padStart(2, '0');

const toISODate = (year: number, month: number, day: number): string =>
  `${year}-${pad2(month)}-${pad2(day)}`;

/** 周一为 1，周日为 7 */
const toWeekday = (date: Date): number => ((date.getDay() + 6) % 7) + 1;

const resolveReferenceDate = (input?: string): Date => {
  if (input) {
    const match = DATE_PATTERN.exec(input);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        return date;
      }
    }
  }
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const createHourColumns = (): TimeSlotGridColumn[] =>
  HOURS.map((hour) => ({
    key: `h-${pad2(hour)}`,
    kind: 'hour',
    index: hour,
  }));

const buildDayGrid = (year: number, month: number): TimeSlotGrid => ({
  granularity: 'day',
  columns: createHourColumns(),
  rows: [
    {
      key: 'day',
      cells: HOURS.map((hour) => ({
        key: `h:${pad2(hour)}`,
        hour,
      })),
    },
  ],
  total: HOURS.length,
  year,
  month,
});

const buildWeekGrid = (year: number, month: number): TimeSlotGrid => ({
  granularity: 'week',
  columns: createHourColumns(),
  rows: Array.from({ length: 7 }, (_, index) => {
    const weekday = index + 1;
    return {
      key: `wd-${weekday}`,
      weekday,
      cells: HOURS.map((hour) => ({
        key: `w:${weekday}:${pad2(hour)}`,
        weekday,
        hour,
      })),
    };
  }),
  total: 7 * HOURS.length,
  year,
  month,
});

const buildMonthGrid = (reference: Date): TimeSlotGrid => {
  const year = reference.getFullYear();
  const month = reference.getMonth() + 1;
  const dayCount = new Date(year, month, 0).getDate();
  const firstWeekday = toWeekday(new Date(year, month - 1, 1));

  const flat: Array<TimeSlotGridCell | null> = [];
  for (let index = 1; index < firstWeekday; index += 1) {
    flat.push(null);
  }
  for (let day = 1; day <= dayCount; day += 1) {
    flat.push({
      key: toISODate(year, month, day),
      date: toISODate(year, month, day),
      day,
      weekday: ((firstWeekday - 1 + day - 1) % 7) + 1,
    });
  }
  while (flat.length % 7 !== 0) {
    flat.push(null);
  }

  const rows: TimeSlotGridRow[] = [];
  for (let index = 0; index < flat.length; index += 7) {
    rows.push({
      key: `row-${index / 7}`,
      cells: flat.slice(index, index + 7),
    });
  }

  return {
    granularity: 'month',
    columns: Array.from({ length: 7 }, (_, index) => ({
      key: `wd-${index + 1}`,
      kind: 'weekday' as const,
      index: index + 1,
    })),
    rows,
    total: dayCount,
    year,
    month,
  };
};

const buildYearGrid = (reference: Date): TimeSlotGrid => {
  const year = reference.getFullYear();
  const januaryFirst = new Date(year, 0, 1);
  const lead = toWeekday(januaryFirst) - 1;
  const dayCount = Math.round((Date.UTC(year, 11, 31) - Date.UTC(year, 0, 1)) / 86400000) + 1;
  const weekCount = Math.ceil((lead + dayCount) / 7);

  const rows: TimeSlotGridRow[] = Array.from({ length: 7 }, (_, index) => ({
    key: `wd-${index + 1}`,
    weekday: index + 1,
    cells: [],
  }));
  const columns: TimeSlotGridColumn[] = [];

  for (let week = 0; week < weekCount; week += 1) {
    let monthStart = 0;
    for (let weekday = 1; weekday <= 7; weekday += 1) {
      const offset = week * 7 + (weekday - 1) - lead;
      if (offset < 0 || offset >= dayCount) {
        rows[weekday - 1].cells.push(null);
        continue;
      }
      const date = new Date(year, 0, 1 + offset);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      if (day === 1) {
        monthStart = month;
      }
      rows[weekday - 1].cells.push({
        key: toISODate(year, month, day),
        date: toISODate(year, month, day),
        day,
        weekday,
      });
    }
    columns.push(
      monthStart > 0
        ? { key: `week-${week}`, kind: 'month', index: monthStart }
        : { key: `week-${week}`, kind: 'none', index: -1 },
    );
  }

  return {
    granularity: 'year',
    columns,
    rows,
    total: dayCount,
    year,
    month: reference.getMonth() + 1,
  };
};

/** 根据粒度与参考日期生成网格模型（纯函数，供逻辑层与测试复用） */
export function getTimeSlotGrid(
  granularity: TimeSlotGranularity = 'week',
  referenceDate?: string,
): TimeSlotGrid {
  const reference = resolveReferenceDate(referenceDate);
  const year = reference.getFullYear();
  const month = reference.getMonth() + 1;

  switch (granularity) {
    case 'day':
      return buildDayGrid(year, month);
    case 'month':
      return buildMonthGrid(reference);
    case 'year':
      return buildYearGrid(reference);
    case 'week':
    default:
      return buildWeekGrid(year, month);
  }
}

/** 提取网格中的全部可选 key */
export function getTimeSlotGridKeys(grid: TimeSlotGrid): string[] {
  const keys: string[] = [];
  grid.rows.forEach((row) => {
    row.cells.forEach((cell) => {
      if (cell !== null) keys.push(cell.key);
    });
  });
  return keys;
}

const normalizeGranularity = (raw?: TimeSlotGranularity): TimeSlotGranularity => {
  if (raw === 'day' || raw === 'week' || raw === 'month' || raw === 'year') return raw;
  return 'week';
};

const normalizeKeys = (keys?: readonly string[]): string[] => {
  if (!Array.isArray(keys)) return [];
  return Array.from(
    new Set(keys.filter((key): key is string => typeof key === 'string' && key.length > 0)),
  ).sort();
};

const sameKeys = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((key, index) => key === right[index]);

/** 格子在网格中的行列坐标（用于矩形框选） */
type CellPosition = { row: number; col: number };

const buildPositionMap = (grid: TimeSlotGrid): Map<string, CellPosition> => {
  const positions = new Map<string, CellPosition>();
  grid.rows.forEach((row, rowIndex) => {
    row.cells.forEach((cell, colIndex) => {
      if (cell !== null) positions.set(cell.key, { row: rowIndex, col: colIndex });
    });
  });
  return positions;
};

export function createTimeSlotPickerLogic(
  options: TimeSlotPickerLogicOptions = {},
): TimeSlotPickerLogicInstance {
  const controlled = options.value !== undefined;

  let granularity = normalizeGranularity(options.granularity);
  let referenceDate = options.referenceDate ?? '';
  let onChange = options.onChange;
  let grid = getTimeSlotGrid(granularity, referenceDate);
  let gridKeys = new Set(getTimeSlotGridKeys(grid));
  let positions = buildPositionMap(grid);

  let value = normalizeKeys(controlled ? options.value : options.defaultValue);

  // 矩形框选会话：锚点坐标 + 统一目标状态 + 预览覆盖的 key
  let paintAnchor: CellPosition | null = null;
  let paintTarget = false;
  let paintKeys: string[] = [];

  const listeners = new Set<StateListener<TimeSlotPickerState>>();

  const countSelected = (): number =>
    value.reduce((count, key) => count + (gridKeys.has(key) ? 1 : 0), 0);

  const buildState = (): TimeSlotPickerState => ({
    value: [...value],
    total: grid.total,
    selectedCount: countSelected(),
    paint: paintAnchor === null ? null : { keys: [...paintKeys], selected: paintTarget },
  });

  let state: TimeSlotPickerState = buildState();

  const notify = () => {
    state = buildState();
    listeners.forEach((listener) => listener(state));
  };

  const emit = (next: readonly string[]) => {
    onChange?.([...next]);
  };

  const apply = (next: readonly string[]) => {
    const normalized = normalizeKeys(next);
    if (sameKeys(value, normalized)) return;
    if (!controlled) {
      value = normalized;
      notify();
    }
    emit(normalized);
  };

  const resetPaint = () => {
    paintAnchor = null;
    paintTarget = false;
    paintKeys = [];
  };

  const refreshGrid = () => {
    grid = getTimeSlotGrid(granularity, referenceDate);
    gridKeys = new Set(getTimeSlotGridKeys(grid));
    positions = buildPositionMap(grid);
    resetPaint();
  };

  /** 收集锚点与目标格子围成的矩形内全部有效 key（自动跳过日历占位） */
  const collectRectangleKeys = (anchor: CellPosition, target: CellPosition): string[] => {
    const rowStart = Math.min(anchor.row, target.row);
    const rowEnd = Math.max(anchor.row, target.row);
    const colStart = Math.min(anchor.col, target.col);
    const colEnd = Math.max(anchor.col, target.col);
    const keys: string[] = [];
    for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex += 1) {
      const row = grid.rows[rowIndex];
      if (row === undefined) continue;
      for (let colIndex = colStart; colIndex <= colEnd; colIndex += 1) {
        const cell = row.cells[colIndex];
        if (cell !== null) keys.push(cell.key);
      }
    }
    return keys.sort();
  };

  const setSelected = (key: string, selected: boolean) => {
    if (typeof key !== 'string' || key.length === 0) return;
    const has = value.includes(key);
    if (has === selected) return;
    apply(selected ? [...value, key] : value.filter((item) => item !== key));
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getState() {
      return state;
    },
    updateOptions(next) {
      let changed = false;

      const nextGranularity = normalizeGranularity(next.granularity ?? granularity);
      const nextReferenceDate = next.referenceDate ?? referenceDate;
      if (nextGranularity !== granularity || nextReferenceDate !== referenceDate) {
        granularity = nextGranularity;
        referenceDate = nextReferenceDate;
        refreshGrid();
        changed = true;
      }

      if (controlled && next.value !== undefined) {
        const normalized = normalizeKeys(next.value);
        if (!sameKeys(value, normalized)) {
          value = normalized;
          changed = true;
        }
      }

      if (next.onChange !== undefined) {
        onChange = next.onChange;
      }

      if (changed) notify();
    },
    toggle(key) {
      if (typeof key !== 'string' || key.length === 0) return;
      setSelected(key, !value.includes(key));
    },
    setSelected,
    beginPaint(key) {
      const anchor = positions.get(key);
      if (anchor === undefined) return false;
      const mode = !value.includes(key);
      paintAnchor = anchor;
      paintTarget = mode;
      paintKeys = [key].sort();
      notify();
      return mode;
    },
    paintTo(key) {
      if (paintAnchor === null) return;
      const target = positions.get(key);
      if (target === undefined) return;
      paintKeys = collectRectangleKeys(paintAnchor, target);
      notify();
    },
    endPaint() {
      if (paintAnchor === null) return;
      const affected = paintKeys;
      const mode = paintTarget;
      const next = new Set(value);
      // 统一应用目标状态：true 选中矩形内全部、false 取消矩形内全部
      if (mode) {
        affected.forEach((key) => next.add(key));
      } else {
        affected.forEach((key) => next.delete(key));
      }
      resetPaint();
      const normalized = normalizeKeys([...next]);
      // 提交后始终通知一次，将 paint 预览清空
      if (!sameKeys(value, normalized)) {
        apply(normalized);
        if (controlled) notify();
      } else {
        notify();
      }
    },
    clear() {
      apply([]);
    },
    selectAll() {
      apply([...value, ...gridKeys]);
    },
    getGrid() {
      return grid;
    },
  };
}
