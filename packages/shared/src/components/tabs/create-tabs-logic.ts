/**
 * Tabs 纯逻辑工厂
 *
 * 状态：value（当前激活值）
 * 交互：activate / moveActive
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新激活值，由外部通过 updateOptions 同步。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 标签页项（与 @xui/core 的 TabItem 结构一致；shared 不依赖 core，本地定义） */
export type TabItem = {
  /** 标签文案 */
  label: string;
  /** 标签值（唯一） */
  value: string;
  /** 禁用本项 */
  disabled?: boolean;
};

/** Tabs 逻辑配置（由适配层从 Props 中提取注入） */
export type TabsLogicOptions = {
  /** 受控激活值（提供时进入受控模式） */
  value?: string;
  /** 非受控初始激活值 */
  defaultValue?: string;
  /** 标签页配置（用于激活校验与键盘切换） */
  items?: TabItem[];
  onChange?: (value: string) => void;
};

/** Tabs 状态快照 */
export type TabsState = {
  /** 当前激活值（null 表示无激活项） */
  value: string | null;
};

/** Tabs 逻辑实例 */
export interface TabsLogicInstance extends LogicInstance<TabsLogicOptions, TabsState> {
  /** 激活指定标签：disabled 项忽略；非受控更新 value；受控仅回调 */
  activate: (value: string) => void;
  /** 键盘切换到相邻可用标签（跳过禁用项，循环） */
  moveActive: (delta: 1 | -1) => void;
}

export function createTabsLogic(options: TabsLogicOptions = {}): TabsLogicInstance {
  const controlled = options.value !== undefined;

  const state: TabsState = {
    value: options.value ?? options.defaultValue ?? null,
  };

  let items: TabItem[] = options.items ?? [];
  let onChange = options.onChange;
  const listeners = new Set<StateListener<TabsState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  /**
   * 找到从 from 起 delta 方向的第一个可用项下标（循环跳过禁用项）
   * from 为 -1（无激活项）时：delta=1 从头开始，delta=-1 从尾开始
   */
  const nextEnabledIndex = (from: number, delta: 1 | -1): number => {
    const total = items.length;
    if (total === 0) return -1;
    const begin = from === -1 ? (delta === 1 ? 0 : total - 1) : from + delta;
    for (let step = 0; step < total; step += 1) {
      const index = (((begin + delta * step) % total) + total) % total;
      if (!items[index]?.disabled) return index;
    }
    return -1;
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

      if (next.value !== undefined && next.value !== state.value) {
        state.value = next.value;
        changed = true;
      }
      if (next.items !== undefined) items = next.items;
      if (next.onChange !== undefined) onChange = next.onChange;

      if (changed) notify();
    },

    activate(value) {
      const item = items.find((tab) => tab.value === value);
      if (!item || item.disabled) return;
      if (state.value === value) return;

      if (!controlled) {
        state.value = value;
        notify();
      }
      onChange?.(value);
    },

    moveActive(delta) {
      if (items.length === 0) return;
      const currentIndex = items.findIndex((tab) => tab.value === state.value);
      const nextIndex = nextEnabledIndex(currentIndex, delta);
      if (nextIndex === -1) return;
      this.activate(items[nextIndex].value);
    },
  };
}
