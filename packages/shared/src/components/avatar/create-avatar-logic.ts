/**
 * Avatar 纯逻辑工厂
 *
 * 状态：failed（当前 src 是否加载失败）
 * 交互：handleError（无图片时忽略；重复触发幂等；src 变更时重置失败态）
 */

import type { LogicInstance, StateListener } from '../../types';

/** Avatar 逻辑配置（由适配层从 Props 中提取注入） */
export type AvatarLogicOptions = {
  src?: string;
  onError?: () => void;
};

/** Avatar 状态快照 */
export type AvatarState = {
  failed: boolean;
};

/** Avatar 逻辑实例 */
export interface AvatarLogicInstance extends LogicInstance<AvatarLogicOptions, AvatarState> {
  /** 图片加载失败处理：标记失败态并触发回调 */
  handleError: () => void;
}

export function createAvatarLogic(options: AvatarLogicOptions = {}): AvatarLogicInstance {
  const state: AvatarState = { failed: false };

  let currentSrc = options.src;
  let onError = options.onError;
  const listeners = new Set<StateListener<AvatarState>>();

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

      // src 变更（含从失败图换新图）时重置失败态，允许新图重试
      if (next.src !== undefined && next.src !== currentSrc) {
        currentSrc = next.src;
        if (state.failed) {
          state.failed = false;
          changed = true;
        }
      }
      if (next.onError !== undefined) {
        onError = next.onError;
      }

      if (changed) notify();
    },

    handleError() {
      if (currentSrc === undefined) return;
      if (state.failed) return;
      state.failed = true;
      notify();
      onError?.();
    },
  };
}
