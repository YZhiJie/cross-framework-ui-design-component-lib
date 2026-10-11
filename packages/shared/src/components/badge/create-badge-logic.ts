/**
 * Badge 纯逻辑工厂
 *
 * 状态：visible / text（纯展示派生，无交互）
 * 规则：
 * - dot 模式恒显示（text 为 null），忽略 count / max / showZero
 * - count 未提供、非有限数值 → 不显示
 * - count 为 0 且未开启 showZero → 不显示
 * - count 超过 max → 显示 `${max}+`
 */

import type { LogicInstance, StateListener } from '../../types';

/** Badge 逻辑配置（由适配层从 Props 中提取注入） */
export type BadgeLogicOptions = {
  count?: number;
  max?: number;
  dot?: boolean;
  showZero?: boolean;
};

/** Badge 状态快照 */
export type BadgeState = {
  visible: boolean;
  text: string | null;
};

/** Badge 逻辑实例 */
export type BadgeLogicInstance = LogicInstance<BadgeLogicOptions, BadgeState>;

/** 默认上限，与 core spec defaults 保持一致 */
const DEFAULT_MAX = 99;

export function createBadgeLogic(options: BadgeLogicOptions = {}): BadgeLogicInstance {
  const state: BadgeState = { visible: false, text: null };
  const listeners = new Set<StateListener<BadgeState>>();

  /** 派生徽标可见性与文本 */
  function derive(next: BadgeLogicOptions): void {
    const dot = next.dot ?? false;
    const showZero = next.showZero ?? false;
    const max =
      typeof next.max === 'number' && Number.isFinite(next.max) && next.max > 0
        ? next.max
        : DEFAULT_MAX;
    const count = next.count;

    if (dot) {
      state.visible = true;
      state.text = null;
      return;
    }
    if (typeof count !== 'number' || !Number.isFinite(count)) {
      state.visible = false;
      state.text = null;
      return;
    }
    if (count === 0 && !showZero) {
      state.visible = false;
      state.text = null;
      return;
    }
    state.visible = true;
    state.text = count > max ? `${max}+` : String(count);
  }

  derive(options);

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
      const merged: BadgeLogicOptions = {
        count: next.count !== undefined ? next.count : options.count,
        max: next.max !== undefined ? next.max : options.max,
        dot: next.dot !== undefined ? next.dot : options.dot,
        showZero: next.showZero !== undefined ? next.showZero : options.showZero,
      };
      const prevVisible = state.visible;
      const prevText = state.text;
      derive(merged);
      if (state.visible !== prevVisible || state.text !== prevText) notify();
    },
  };
}
