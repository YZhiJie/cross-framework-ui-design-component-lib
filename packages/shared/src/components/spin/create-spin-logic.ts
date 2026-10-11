/**
 * Spin 纯逻辑工厂
 *
 * 状态：size（收敛到三档）/ spinning / tip（空串归一为 null）
 * 纯展示组件：无交互方法，仅状态收敛与订阅。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 尺寸 */
export type SpinSize = 'sm' | 'md' | 'lg';

/** Spin 逻辑配置（由适配层从 Props 中提取注入） */
export type SpinLogicOptions = {
  size?: SpinSize;
  spinning?: boolean;
  tip?: string;
};

/** Spin 状态快照 */
export type SpinState = {
  size: SpinSize;
  spinning: boolean;
  /** 空串归一为 null */
  tip: string | null;
};

/** Spin 逻辑实例 */
export type SpinLogicInstance = LogicInstance<SpinLogicOptions, SpinState>;

/** 与 core spec defaults 保持一致 */
const SIZES: SpinSize[] = ['sm', 'md', 'lg'];

/** 收敛 size：非法值 → 'md' */
function normalizeSize(raw: SpinSize | undefined): SpinSize {
  return raw !== undefined && SIZES.includes(raw) ? raw : 'md';
}

/** 收敛 tip：空串 / undefined → null */
function normalizeTip(raw: string | undefined): string | null {
  return raw ? raw : null;
}

export function createSpinLogic(options: SpinLogicOptions = {}): SpinLogicInstance {
  const state: SpinState = {
    size: normalizeSize(options.size),
    spinning: options.spinning ?? true,
    tip: normalizeTip(options.tip),
  };

  const listeners = new Set<StateListener<SpinState>>();

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
      const nextSize =
        next.size !== undefined ? normalizeSize(next.size) : state.size;
      const nextSpinning =
        next.spinning !== undefined ? next.spinning : state.spinning;
      const nextTip = next.tip !== undefined ? normalizeTip(next.tip) : state.tip;

      const changed =
        nextSize !== state.size ||
        nextSpinning !== state.spinning ||
        nextTip !== state.tip;

      state.size = nextSize;
      state.spinning = nextSpinning;
      state.tip = nextTip;

      if (changed) notify();
    },
  };
}
