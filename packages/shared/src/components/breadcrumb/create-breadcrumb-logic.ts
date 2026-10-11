/**
 * Breadcrumb 纯逻辑工厂
 *
 * 状态：items（本地收敛快照）/ separator（空串回退 '/'）
 * 交互：selectItem —— 末项（is-active）与 disabled 项静默忽略，
 * 其余项触发 onItemClick 回调；href 导航由适配层渲染 <a> 原生完成。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 面包屑项 */
export type BreadcrumbItem = {
  label: string;
  href?: string;
  disabled?: boolean;
};

/** Breadcrumb 逻辑配置（由适配层从 Props 中提取注入） */
export type BreadcrumbLogicOptions = {
  items?: BreadcrumbItem[];
  separator?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
};

/** Breadcrumb 状态快照 */
export type BreadcrumbState = {
  items: BreadcrumbItem[];
  separator: string;
};

/** Breadcrumb 逻辑实例 */
export type BreadcrumbLogicInstance = LogicInstance<BreadcrumbLogicOptions, BreadcrumbState> & {
  /** 点击某项：末项 / disabled 项静默忽略，其余触发回调 */
  selectItem: (index: number) => void;
};

/** 与 core spec defaults 保持一致 */
const DEFAULT_SEPARATOR = '/';

/** 收敛 separator：空串 / undefined → '/' */
function normalizeSeparator(raw: string | undefined): string {
  return raw ? raw : DEFAULT_SEPARATOR;
}

export function createBreadcrumbLogic(
  options: BreadcrumbLogicOptions = {},
): BreadcrumbLogicInstance {
  const state: BreadcrumbState = {
    items: options.items ?? [],
    separator: normalizeSeparator(options.separator),
  };

  const listeners = new Set<StateListener<BreadcrumbState>>();

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
      const nextItems = next.items !== undefined ? next.items : state.items;
      const nextSeparator =
        next.separator !== undefined ? normalizeSeparator(next.separator) : state.separator;

      const changed = nextItems !== state.items || nextSeparator !== state.separator;

      state.items = nextItems;
      state.separator = nextSeparator;

      if (changed) notify();
    },

    selectItem(index) {
      const item = state.items[index];
      if (!item) return;
      // 末项为当前页，disabled 项不可点击
      if (index === state.items.length - 1 || item.disabled) return;
      options.onItemClick?.(item, index);
    },
  };
}
