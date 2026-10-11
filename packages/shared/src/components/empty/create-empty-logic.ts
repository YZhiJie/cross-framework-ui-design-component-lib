/**
 * Empty 纯逻辑工厂
 *
 * 状态：description（归一化描述文案）
 * 纯展示派生：undefined / 空白字符串归一化为 null（不渲染描述区）。
 * 组件不内置默认文案，由外部显式传入，避免内置 i18n 问题。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Empty 逻辑配置（由适配层从 Props 中提取注入） */
export type EmptyLogicOptions = {
  description?: string;
};

/** Empty 状态快照 */
export type EmptyState = {
  description: string | null;
};

/** Empty 逻辑实例 */
export type EmptyLogicInstance = LogicInstance<EmptyLogicOptions, EmptyState>;

/** 归一化：undefined / 空白 → null */
function normalize(raw: string | undefined): string | null {
  const text = raw?.trim() ?? '';
  return text === '' ? null : text;
}

export function createEmptyLogic(options: EmptyLogicOptions = {}): EmptyLogicInstance {
  const state: EmptyState = {
    description: normalize(options.description),
  };

  const listeners = new Set<StateListener<EmptyState>>();

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
      if (next.description === undefined) return;
      const normalized = normalize(next.description);
      if (normalized !== state.description) {
        state.description = normalized;
        notify();
      }
    },
  };
}
