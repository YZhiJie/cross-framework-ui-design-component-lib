/**
 * Pagination 纯逻辑工厂
 *
 * 状态：page / pageCount / disabled
 * 交互：goTo / prev / next（disabled 或越界/重复跳转时静默忽略）
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新页码，由外部通过 updateOptions 同步。
 * 页码始终 clamp 到 [1, pageCount]，total/pageSize 变更时重算页数并收敛当前页。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Pagination 逻辑配置（由适配层从 Props 中提取注入） */
export type PaginationLogicOptions = {
  /** 受控当前页（提供时进入受控模式） */
  value?: number;
  /** 非受控初始页码 */
  defaultValue?: number;
  /** 数据总条数 */
  total?: number;
  /** 每页条数 */
  pageSize?: number;
  disabled?: boolean;
  onChange?: (page: number) => void;
};

/** Pagination 状态快照 */
export type PaginationState = {
  /** 当前页（1 起始） */
  page: number;
  /** 总页数（至少为 1） */
  pageCount: number;
  disabled: boolean;
};

/** Pagination 逻辑实例 */
export interface PaginationLogicInstance extends LogicInstance<
  PaginationLogicOptions,
  PaginationState
> {
  /** 跳转指定页：clamp 后与当前页相同则为 no-op */
  goTo: (page: number) => void;
  /** 上一页 */
  prev: () => void;
  /** 下一页 */
  next: () => void;
}

const clampPage = (page: number, pageCount: number): number =>
  Math.min(Math.max(Math.floor(page), 1), pageCount);

export function createPaginationLogic(
  options: PaginationLogicOptions = {},
): PaginationLogicInstance {
  const controlled = options.value !== undefined;

  const resolvePageCount = (total: number | undefined, pageSize: number): number =>
    Math.max(1, Math.ceil(Math.max(total ?? 0, 0) / pageSize));

  const resolvePageSize = (pageSize: number | undefined): number =>
    Math.max(1, Math.floor(pageSize ?? 10));

  const pageSize = resolvePageSize(options.pageSize);
  const pageCount = resolvePageCount(options.total, pageSize);

  const state: PaginationState = {
    page: clampPage(options.value ?? options.defaultValue ?? 1, pageCount),
    pageCount,
    disabled: options.disabled ?? false,
  };

  let onChange = options.onChange;
  const listeners = new Set<StateListener<PaginationState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      let changed = false;

      const nextPageSize = resolvePageSize(next.pageSize ?? pageSize);
      const nextPageCount = resolvePageCount(next.total ?? options.total, nextPageSize);

      if (nextPageCount !== state.pageCount) {
        state.pageCount = nextPageCount;
        changed = true;
      }

      const nextDisabled = next.disabled ?? state.disabled;
      if (nextDisabled !== state.disabled) {
        state.disabled = nextDisabled;
        changed = true;
      }

      // 受控页码同步（clamp 后与当前页不同才生效）
      if (next.value !== undefined) {
        const target = clampPage(next.value, state.pageCount);
        if (target !== state.page) {
          state.page = target;
          changed = true;
        }
      }

      // total/pageSize 收缩时收敛当前页
      const bounded = clampPage(state.page, state.pageCount);
      if (bounded !== state.page) {
        state.page = bounded;
        changed = true;
      }

      if (next.onChange !== undefined) {
        onChange = next.onChange;
      }

      if (changed) notify();
    },

    goTo(page) {
      if (state.disabled) return;
      const target = clampPage(page, state.pageCount);
      if (target === state.page) return;
      if (!controlled) {
        state.page = target;
        notify();
      }
      onChange?.(target);
    },

    prev() {
      if (state.page <= 1) return;
      this.goTo(state.page - 1);
    },

    next() {
      if (state.page >= state.pageCount) return;
      this.goTo(state.page + 1);
    },
  };
}

/** 页码项：数字页码或省略号占位 */
export type PageItem = number | 'ellipsis-prev' | 'ellipsis-next';

/**
 * 生成页码序列（纯函数，双端适配层共用）
 *
 * 规则：总页数 <= 7 时全部展示；否则固定展示首末页，
 * 当前页 <= 4 展示前 5 页，>= pageCount - 3 展示末 5 页，
 * 其余展示当前页 ±1，缺口以省略号占位。
 */
export function createPageItems(page: number, pageCount: number): PageItem[] {
  const count = Math.max(1, pageCount);
  const current = clampPage(page, count);

  if (count <= 7) {
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-next', count];
  }

  if (current >= count - 3) {
    return [1, 'ellipsis-prev', count - 4, count - 3, count - 2, count - 1, count];
  }

  return [1, 'ellipsis-prev', current - 1, current, current + 1, 'ellipsis-next', count];
}
