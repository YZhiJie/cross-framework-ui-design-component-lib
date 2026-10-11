/**
 * InputNumber 纯逻辑工厂
 *
 * 状态：value（number | null 契约）/ min / max / step / precision / disabled 全量收敛。
 * 交互：stepValue（整数域运算防浮点误差）、commitText（空串 / 非法输入回退 null）。
 * 受控语义：options.value !== undefined 即受控（null 也是有效受控值）——
 * 受控模式仅回调 onChange，不更新内部状态。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** InputNumber 逻辑配置（由适配层从 Props 中提取注入） */
export type InputNumberLogicOptions = {
  value?: number | null;
  defaultValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  onChange?: (value: number | null) => void;
};

/** InputNumber 状态快照 */
export type InputNumberState = {
  value: number | null;
  disabled: boolean;
  min: number;
  max: number;
  step: number;
  /** null 表示不应用精度 */
  precision: number | null;
};

/** InputNumber 逻辑实例 */
export type InputNumberLogicInstance = LogicInstance<InputNumberLogicOptions, InputNumberState> & {
  /** 步进：direction 为 1（上）/ -1（下）；disabled / 值不变时 no-op */
  stepValue: (direction: 1 | -1) => void;
  /** 提交输入文本：空串或非法输入收敛为 null，合法值 clamp + precision */
  commitText: (text: string) => void;
};

/** 与 core spec defaults 保持一致 */
const DEFAULT_STEP = 1;

/** 收敛 min：非有限数值 → -Infinity */
function normalizeMin(raw: number | undefined): number {
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : -Infinity;
}

/** 收敛 max：非有限数值 → +Infinity */
function normalizeMax(raw: number | undefined): number {
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : Infinity;
}

/** 收敛 step：非有限数值或非正数 → 默认值 */
function normalizeStep(raw: number | undefined): number {
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw <= 0) return DEFAULT_STEP;
  return raw;
}

/** 收敛 precision：0-20 整数合法，其余 → null（不应用精度） */
function normalizePrecision(raw: number | undefined): number | null {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0 || raw > 20) return null;
  return raw;
}

/** 小数部分的位数（整数域运算的放大基数） */
function decimalsOf(n: number): number {
  const text = String(n);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

export function createInputNumberLogic(
  options: InputNumberLogicOptions = {},
): InputNumberLogicInstance {
  const state: InputNumberState = {
    value: null,
    disabled: options.disabled ?? false,
    min: normalizeMin(options.min),
    max: normalizeMax(options.max),
    step: normalizeStep(options.step),
    precision: normalizePrecision(options.precision),
  };
  // min > max 视为非法边界，双双向内交换保证 clamp 区间有效
  if (state.min > state.max) {
    [state.min, state.max] = [state.max, state.min];
  }

  const listeners = new Set<StateListener<InputNumberState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 收敛值：null / 非有限数值 → null，否则 precision + clamp */
  function normalizeValue(raw: number | null | undefined): number | null {
    if (raw === null || raw === undefined || typeof raw !== 'number' || !Number.isFinite(raw)) {
      return null;
    }
    const precise = state.precision !== null ? Number(raw.toFixed(state.precision)) : raw;
    return Math.min(state.max, Math.max(state.min, precise));
  }

  /** 受控判定：value prop 已提供（null 也是有效受控值） */
  function isControlled(): boolean {
    return options.value !== undefined;
  }

  /** 应用新值：值不变完全 no-op；非受控更新状态，受控 / 非受控均回调 onChange */
  function applyNextValue(next: number | null) {
    if (state.value === next) return;
    if (!isControlled()) {
      state.value = next;
      notify();
    }
    options.onChange?.(next);
  }

  // 初始值：受控取收敛后的 value，非受控取收敛后的 defaultValue
  state.value = normalizeValue(isControlled() ? options.value : options.defaultValue);

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      if (next.min !== undefined) state.min = normalizeMin(next.min);
      if (next.max !== undefined) state.max = normalizeMax(next.max);
      if (state.min > state.max) {
        [state.min, state.max] = [state.max, state.min];
      }
      if (next.step !== undefined) state.step = normalizeStep(next.step);
      if (next.precision !== undefined) state.precision = normalizePrecision(next.precision);
      if (next.disabled !== undefined) state.disabled = next.disabled;

      // 受控值同步（undefined 表示未提供，保持现状；null 是有效空值）
      if (next.value !== undefined) {
        state.value = normalizeValue(next.value);
      } else if (next.min !== undefined || next.max !== undefined || next.precision !== undefined) {
        // 边界 / 精度变化时对当前值重新收敛
        state.value = normalizeValue(state.value);
      }
      notify();
    },

    stepValue(direction) {
      if (state.disabled) return;
      // 空值时以 clamp(defaultValue ?? 0) 为基准起步
      const base = normalizeValue(state.value ?? options.defaultValue ?? 0);
      const current = base ?? 0;
      // 整数域运算防浮点误差：0.1 + 0.2 → 0.3
      const factor = 10 ** Math.max(decimalsOf(state.step), state.precision ?? 0);
      const stepped =
        (Math.round(current * factor) + direction * Math.round(state.step * factor)) / factor;
      applyNextValue(normalizeValue(stepped));
    },

    commitText(text) {
      if (state.disabled) return;
      const trimmed = text.trim();
      let next: number | null;
      if (trimmed === '') {
        next = null;
      } else {
        const parsed = Number(trimmed);
        // 非法输入（NaN / Infinity）回退 null，与 DatePicker 非法契约风格一致
        next = Number.isFinite(parsed) ? parsed : null;
      }
      applyNextValue(normalizeValue(next));
    },
  };
}
