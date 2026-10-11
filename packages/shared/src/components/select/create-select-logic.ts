/**
 * Select 纯逻辑工厂
 *
 * 状态：value / open / activeIndex / disabled / searchQuery / filteredOptions
 * 交互：toggleOpen / close / select / clear / moveHighlight / confirmHighlight / setSearch
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中值，由外部通过 updateOptions 同步。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 *
 * 多选模式（multiple）：value 为 string[]，select 为切换语义且不关闭面板；
 * 可搜索模式（searchable）：searchQuery 对 label 大小写不敏感的子串匹配，
 * 键盘导航与确认作用于过滤后的列表。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 下拉选项（与 @xui/core 的 SelectOption 结构一致；shared 不依赖 core，本地定义） */
export type SelectOption = {
  /** 选项文案 */
  label: string;
  /** 选项值（组内唯一） */
  value: string;
  /** 禁用本项 */
  disabled?: boolean;
};

/** Select 选中值：单选为 string，多选为 string[] */
export type SelectValue = string | string[];

/** Select 逻辑配置（由适配层从 Props 中提取注入） */
export type SelectLogicOptions = {
  /** 受控选中值（提供时进入受控模式）；多选时为 string[] */
  value?: SelectValue;
  /** 非受控初始选中值 */
  defaultValue?: SelectValue;
  /** 选项数组（用于键盘高亮跳过禁用项） */
  options?: SelectOption[];
  disabled?: boolean;
  clearable?: boolean;
  /** 多选模式：value 为数组，select 切换选中且不关闭面板 */
  multiple?: boolean;
  /** 可搜索模式：面板打开时按 label 过滤选项 */
  searchable?: boolean;
  onChange?: (value: SelectValue) => void;
  onClear?: () => void;
};

/** Select 状态快照 */
export type SelectState = {
  /** 当前选中值：单选 string | null；多选 string[]（空数组表示未选中） */
  value: string | string[] | null;
  /** 下拉面板展开状态 */
  open: boolean;
  /** 键盘高亮项下标（-1 表示无高亮；作用于 filteredOptions） */
  activeIndex: number;
  disabled: boolean;
  /** 当前搜索词（searchable 模式） */
  searchQuery: string;
  /** 过滤后的选项列表（非 searchable 恒等于 options） */
  filteredOptions: SelectOption[];
};

/** Select 逻辑实例 */
export interface SelectLogicInstance extends LogicInstance<SelectLogicOptions, SelectState> {
  /** 展开 / 收起下拉面板（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起面板并重置搜索状态 */
  close: () => void;
  /** 选中指定值：禁用项忽略；单选为选中语义，多选为切换语义；受控仅回调 */
  select: (value: string) => void;
  /** 清空选中值（非受控重置，始终触发 onClear） */
  clear: () => void;
  /** 键盘移动高亮项（+1 / -1，跳过禁用项；作用于过滤后的列表） */
  moveHighlight: (delta: 1 | -1) => void;
  /** 确认当前高亮项（无高亮时忽略） */
  confirmHighlight: () => void;
  /** 更新搜索词并重算过滤列表（仅 searchable 模式生效） */
  setSearch: (query: string) => void;
}

/** 按模式规整选中值：多选规整为 string[]，单选规整为 string | null */
function normalizeValue(raw: SelectValue | null | undefined, multiple: boolean) {
  if (multiple) {
    if (Array.isArray(raw)) return [...raw];
    return raw === null || raw === undefined ? [] : [raw];
  }
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

/** 受控值等价比较：数组浅比较，标量全等 */
function valueEquals(a: SelectValue | null, b: SelectValue | null): boolean {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => item === b[index]);
  }
  return a === b;
}

export function createSelectLogic(options: SelectLogicOptions = {}): SelectLogicInstance {
  const controlled = options.value !== undefined;

  let multiple = options.multiple ?? false;
  let searchable = options.searchable ?? false;

  const state: SelectState = {
    value: normalizeValue(options.value ?? options.defaultValue, multiple),
    open: false,
    activeIndex: -1,
    disabled: options.disabled ?? false,
    searchQuery: '',
    filteredOptions: options.options ?? [],
  };

  let onChange = options.onChange;
  let onClear = options.onClear;
  let optionList: SelectOption[] = options.options ?? [];
  let clearable = options.clearable ?? false;
  const listeners = new Set<StateListener<SelectState>>();

  const notify = () => {
    const snapshot = {
      ...state,
      value: Array.isArray(state.value) ? [...state.value] : state.value,
      filteredOptions: [...state.filteredOptions],
    };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 按 searchQuery 过滤选项（大小写不敏感的子串匹配；非 searchable 恒等于全量） */
  const computeFiltered = (): SelectOption[] => {
    if (!searchable) return optionList;
    const query = state.searchQuery.trim().toLowerCase();
    if (query === '') return optionList;
    return optionList.filter((option) => option.label.toLowerCase().includes(query));
  };

  /**
   * 找到从 from 起 delta 方向的第一个可用项下标（循环跳过禁用项）
   * from 为 -1（无高亮/未选中）时：delta=1 从头开始，delta=-1 从尾开始
   * 作用于过滤后的可见列表
   */
  const nextEnabledIndex = (from: number, delta: 1 | -1): number => {
    const total = state.filteredOptions.length;
    if (total === 0) return -1;
    const begin = from === -1 ? (delta === 1 ? 0 : total - 1) : from + delta;
    for (let step = 0; step < total; step += 1) {
      const index = (((begin + delta * step) % total) + total) % total;
      if (!state.filteredOptions[index]?.disabled) return index;
    }
    return -1;
  };

  /** 多选时读取当前选中数组 */
  const selectedArray = (): string[] => (Array.isArray(state.value) ? state.value : []);

  /** 指定值是否已选中（多选 includes，单选全等） */
  const isSelected = (value: string): boolean => {
    if (multiple) return selectedArray().includes(value);
    return state.value === value;
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({
      ...state,
      value: Array.isArray(state.value) ? [...state.value] : state.value,
      filteredOptions: [...state.filteredOptions],
    }),

    updateOptions(next) {
      let changed = false;

      if (next.value !== undefined && !valueEquals(next.value, state.value)) {
        state.value = normalizeValue(next.value, multiple);
        changed = true;
      }
      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        if (state.disabled) {
          state.open = false;
          state.activeIndex = -1;
        }
        changed = true;
      }
      if (next.options !== undefined) optionList = next.options;
      if (next.clearable !== undefined) clearable = next.clearable;
      if (next.multiple !== undefined) multiple = next.multiple;
      if (next.searchable !== undefined) searchable = next.searchable;
      if (next.onChange !== undefined) onChange = next.onChange;
      if (next.onClear !== undefined) onClear = next.onClear;

      // options / 模式变化重算过滤列表（引用变化需通知适配层重渲染）
      const nextFiltered = computeFiltered();
      if (nextFiltered !== state.filteredOptions) {
        state.filteredOptions = nextFiltered;
        changed = true;
      }

      if (changed) notify();
    },

    toggleOpen() {
      if (state.disabled) return;
      if (state.open) {
        state.open = false;
        state.activeIndex = -1;
        // 收起重置搜索状态
        if (state.searchQuery !== '') {
          state.searchQuery = '';
          state.filteredOptions = computeFiltered();
        }
      } else {
        state.open = true;
        state.filteredOptions = computeFiltered();
        // 展开时高亮当前选中项（在可见列表中定位），未选中则定位第一个可用项
        const selectedIndex = state.filteredOptions.findIndex((option) => isSelected(option.value));
        state.activeIndex =
          selectedIndex !== -1 && !state.filteredOptions[selectedIndex]?.disabled
            ? selectedIndex
            : nextEnabledIndex(-1, 1);
      }
      notify();
    },

    close() {
      if (!state.open && state.activeIndex === -1 && state.searchQuery === '') return;
      state.open = false;
      state.activeIndex = -1;
      if (state.searchQuery !== '') {
        state.searchQuery = '';
        state.filteredOptions = computeFiltered();
      }
      notify();
    },

    select(value) {
      if (state.disabled) return;
      const option = optionList.find((item) => item.value === value);
      if (!option || option.disabled) return;

      if (multiple) {
        // 多选：切换语义，面板保持展开
        const current = selectedArray();
        const next = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        if (!controlled) {
          state.value = next;
          notify();
        }
        onChange?.(next);
        return;
      }

      state.open = false;
      state.activeIndex = -1;
      if (state.searchQuery !== '') {
        state.searchQuery = '';
        state.filteredOptions = computeFiltered();
      }

      if (state.value !== value) {
        if (!controlled) {
          state.value = value;
          notify();
        }
        onChange?.(value);
      } else {
        // 重复选中相同值：仅收起面板
        notify();
      }
    },

    clear() {
      if (state.disabled) return;
      if (multiple) {
        if (selectedArray().length === 0) return;
        if (!controlled) {
          state.value = [];
          notify();
        }
        onClear?.();
        return;
      }
      if (!clearable || state.value === null) return;
      if (!controlled) {
        state.value = null;
        notify();
      }
      onClear?.();
    },

    moveHighlight(delta) {
      if (state.disabled || !state.open || state.filteredOptions.length === 0) return;
      const next = nextEnabledIndex(state.activeIndex, delta);
      if (next !== -1 && next !== state.activeIndex) {
        state.activeIndex = next;
        notify();
      }
    },

    confirmHighlight() {
      if (state.activeIndex === -1) return;
      const option = state.filteredOptions[state.activeIndex];
      if (option) this.select(option.value);
    },

    setSearch(query) {
      if (!searchable || state.searchQuery === query) return;
      state.searchQuery = query;
      state.filteredOptions = computeFiltered();
      // 重置高亮到过滤后列表的第一个可用项，无可用项为 -1
      state.activeIndex = state.filteredOptions.length > 0 ? nextEnabledIndex(-1, 1) : -1;
      notify();
    },
  };
}
