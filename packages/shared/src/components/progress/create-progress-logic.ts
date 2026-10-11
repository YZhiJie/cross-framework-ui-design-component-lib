/**
 * Progress 纯逻辑工厂
 *
 * 状态：percent（收敛到 [0, 100]）/ strokeWidth（收敛为正数）/ status（含派生）
 * 纯展示派生：percent 达到 100 且未显式指定 success/error 时派生为 success。
 * 非法输入防御：percent 非有限数值按 0 处理，strokeWidth 非正数回退默认值。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 进度状态 */
export type ProgressStatus = 'normal' | 'success' | 'error';

/** Progress 逻辑配置（由适配层从 Props 中提取注入） */
export type ProgressLogicOptions = {
  percent?: number;
  strokeWidth?: number;
  status?: ProgressStatus;
};

/** Progress 状态快照 */
export type ProgressState = {
  percent: number;
  status: ProgressStatus;
  strokeWidth: number;
};

/** Progress 逻辑实例 */
export type ProgressLogicInstance = LogicInstance<ProgressLogicOptions, ProgressState>;

/** 默认粗细（px），与 core spec defaults 保持一致 */
const DEFAULT_STROKE_WIDTH = 6;

/** 收敛 percent：非有限数值 → 0，越界 → [0, 100] */
function normalizePercent(raw: number | undefined): number {
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return 0;
  return Math.min(100, Math.max(0, raw));
}

/** 收敛 strokeWidth：非有限数值或非正数 → 默认值 */
function normalizeStrokeWidth(raw: number | undefined): number {
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw <= 0) return DEFAULT_STROKE_WIDTH;
  return raw;
}

export function createProgressLogic(options: ProgressLogicOptions = {}): ProgressLogicInstance {
  const state: ProgressState = {
    percent: normalizePercent(options.percent),
    strokeWidth: normalizeStrokeWidth(options.strokeWidth),
    status: 'normal',
  };
  state.status = deriveStatus(state, options.status);

  const listeners = new Set<StateListener<ProgressState>>();

  /** 状态派生：percent >= 100 且未显式指定 success/error → success */
  function deriveStatus(
    current: Pick<ProgressState, 'percent'>,
    explicit: ProgressStatus | undefined,
  ): ProgressStatus {
    if (explicit === 'success' || explicit === 'error') return explicit;
    return current.percent >= 100 ? 'success' : 'normal';
  }

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
      const nextPercent = normalizePercent(
        next.percent !== undefined ? next.percent : state.percent,
      );
      const nextStrokeWidth = normalizeStrokeWidth(
        next.strokeWidth !== undefined ? next.strokeWidth : state.strokeWidth,
      );
      const nextStatus = deriveStatus(
        { percent: nextPercent },
        next.status !== undefined ? next.status : undefined,
      );

      const changed =
        nextPercent !== state.percent ||
        nextStrokeWidth !== state.strokeWidth ||
        nextStatus !== state.status;

      state.percent = nextPercent;
      state.strokeWidth = nextStrokeWidth;
      state.status = nextStatus;

      if (changed) notify();
    },
  };
}
