/**
 * Steps 纯逻辑工厂
 *
 * 状态：value（当前步骤索引）/ direction（收敛 horizontal|vertical）/ status
 * 交互：select（越界与禁用项 no-op）/ next / prev / getStatus（索引推导：
 *       小于当前 finish、等于当前 status ?? process、大于 wait）
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新索引，由外部通过 updateOptions 同步。
 *
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 步骤状态（与 core 契约结构一致） */
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

/** 步骤项（与 core 契约结构一致） */
export type StepItem = {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
};

/** 步骤条方向 */
export type StepsDirection = 'horizontal' | 'vertical';

/** Steps 逻辑配置（由适配层从 Props 中提取注入） */
export type StepsLogicOptions = {
  items?: StepItem[];
  /** 受控当前索引（提供即受控） */
  value?: number;
  /** 非受控初始索引 */
  defaultValue?: number;
  /** 当前步骤状态覆盖 */
  status?: StepStatus;
  direction?: StepsDirection;
  onChange?: (index: number) => void;
};

/** Steps 状态快照 */
export type StepsState = {
  value: number;
  direction: StepsDirection;
  /** undefined 表示按索引推导 process */
  status: StepStatus | undefined;
};

/** Steps 逻辑实例 */
export interface StepsLogicInstance extends LogicInstance<StepsLogicOptions, StepsState> {
  select: (index: number) => void;
  next: () => void;
  prev: () => void;
  getStatus: (index: number) => StepStatus;
}

const DIRECTIONS: StepsDirection[] = ['horizontal', 'vertical'];
const STATUSES: StepStatus[] = ['wait', 'process', 'finish', 'error'];

function normalizeDirection(raw: StepsDirection | undefined): StepsDirection {
  return raw !== undefined && DIRECTIONS.includes(raw) ? raw : 'horizontal';
}

function normalizeStatus(raw: StepStatus | undefined): StepStatus | undefined {
  return raw !== undefined && STATUSES.includes(raw) ? raw : undefined;
}

export function createStepsLogic(options: StepsLogicOptions = {}): StepsLogicInstance {
  const controlled = options.value !== undefined;

  let items = options.items ?? [];
  let onChange = options.onChange;

  const state: StepsState = {
    value:
      options.value !== undefined ? options.value : Math.max(0, options.defaultValue ?? 0),
    direction: normalizeDirection(options.direction),
    status: normalizeStatus(options.status),
  };

  const listeners = new Set<StateListener<StepsState>>();

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

      if (next.items !== undefined && next.items !== items) {
        items = next.items;
        changed = true;
      }
      if (next.direction !== undefined) {
        const nextDirection = normalizeDirection(next.direction);
        if (nextDirection !== state.direction) {
          state.direction = nextDirection;
          changed = true;
        }
      }
      if (next.status !== undefined) {
        const nextStatus = normalizeStatus(next.status);
        if (nextStatus !== state.status) {
          state.status = nextStatus;
          changed = true;
        }
      }
      if (next.value !== undefined && next.value !== state.value) {
        state.value = next.value;
        changed = true;
      }
      if (next.onChange !== undefined) onChange = next.onChange;

      if (changed) notify();
    },

    select(index) {
      const item = items[index];
      if (!item || item.disabled || index === state.value) return;
      if (!controlled) {
        state.value = index;
      }
      notify();
      onChange?.(index);
    },

    next() {
      this.select(state.value + 1);
    },

    prev() {
      this.select(state.value - 1);
    },

    getStatus(index) {
      if (index < state.value) return 'finish';
      if (index > state.value) return 'wait';
      return state.status ?? 'process';
    },
  };
}
