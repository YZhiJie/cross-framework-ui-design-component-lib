/**
 * Skeleton 纯逻辑工厂
 *
 * 状态：loading / avatar / rows（收敛为正整数，非法回退默认 3）
 * 纯展示组件：无交互方法，仅状态收敛与订阅。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Skeleton 逻辑配置（由适配层从 Props 中提取注入） */
export type SkeletonLogicOptions = {
  loading?: boolean;
  avatar?: boolean;
  rows?: number;
};

/** Skeleton 状态快照 */
export type SkeletonState = {
  loading: boolean;
  avatar: boolean;
  /** 收敛为正整数 */
  rows: number;
};

/** Skeleton 逻辑实例 */
export type SkeletonLogicInstance = LogicInstance<SkeletonLogicOptions, SkeletonState>;

/** 与 core spec defaults 保持一致 */
const DEFAULT_ROWS = 3;

/** 收敛 rows：非有限数值或非正数 → 默认值，小数向下取整 */
function normalizeRows(raw: number | undefined): number {
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw <= 0) return DEFAULT_ROWS;
  return Math.floor(raw);
}

export function createSkeletonLogic(options: SkeletonLogicOptions = {}): SkeletonLogicInstance {
  const state: SkeletonState = {
    loading: options.loading ?? true,
    avatar: options.avatar ?? false,
    rows: normalizeRows(options.rows),
  };

  const listeners = new Set<StateListener<SkeletonState>>();

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
      const nextLoading = next.loading !== undefined ? next.loading : state.loading;
      const nextAvatar = next.avatar !== undefined ? next.avatar : state.avatar;
      const nextRows = next.rows !== undefined ? normalizeRows(next.rows) : state.rows;

      const changed =
        nextLoading !== state.loading || nextAvatar !== state.avatar || nextRows !== state.rows;

      state.loading = nextLoading;
      state.avatar = nextAvatar;
      state.rows = nextRows;

      if (changed) notify();
    },
  };
}
