/**
 * Select 纯逻辑工厂
 *
 * 状态：value / open / activeIndex / disabled / searchQuery / filteredOptions / groupedOptions
 * 交互：toggleOpen / close / select / clear / moveHighlight / confirmHighlight / setSearch
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中值，由外部通过 updateOptions 同步。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 *
 * 多选模式（multiple）：value 为 string[]，select 为切换语义且不关闭面板；
 * 可搜索模式（searchable）：searchQuery 对 label 大小写不敏感的子串匹配，
 * 键盘导航与确认作用于过滤后的扁平列表。
 *
 * 分组支持：options 接受 (SelectOption | SelectOptionGroup)[]，
 * 内部扁平化为 flatOptions 用于过滤/导航，同时维护 groupedOptions 供适配层分组渲染。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 下拉选项（叶子节点） */
export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

/** 下拉选项分组 */
export type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
  disabled?: boolean;
};

/** options 数据源：扁平选项或分组混合 */
export type SelectSource = (SelectOption | SelectOptionGroup)[];

/** Select 选中值：单选为 string，多选为 string[] */
export type SelectValue = string | string[];

/** Select 逻辑配置 */
export type SelectLogicOptions = {
  value?: SelectValue;
  defaultValue?: SelectValue;
  options?: SelectSource;
  disabled?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  onChange?: (value: SelectValue) => void;
  onClear?: () => void;
};

/** Select 状态快照 */
export type SelectState = {
  value: string | string[] | null;
  open: boolean;
  activeIndex: number;
  disabled: boolean;
  searchQuery: string;
  filteredOptions: SelectOption[];
  groupedOptions: SelectOptionGroup[];
};

/** Select 逻辑实例 */
export interface SelectLogicInstance extends LogicInstance<SelectLogicOptions, SelectState> {
  toggleOpen: () => void;
  close: () => void;
  select: (value: string) => void;
  clear: () => void;
  moveHighlight: (delta: 1 | -1) => void;
  confirmHighlight: () => void;
  setSearch: (query: string) => void;
}

/** 判断是否为分组项 */
export function isOptionGroup(item: SelectOption | SelectOptionGroup): item is SelectOptionGroup {
  return Array.isArray((item as SelectOptionGroup).options);
}

/** 将分组数据源扁平化为选项数组（保留分组禁用态到子选项） */
export function flattenOptions(source: SelectSource): SelectOption[] {
  const result: SelectOption[] = [];
  for (const item of source) {
    if (isOptionGroup(item)) {
      for (const opt of item.options) {
        result.push({
          ...opt,
          disabled: opt.disabled || item.disabled,
        });
      }
    } else {
      result.push(item);
    }
  }
  return result;
}

/** 将数据源按分组结构返回（扁平项放入一个无标题组或不分组） */
export function groupOptions(source: SelectSource): SelectOptionGroup[] {
  return source.filter(isOptionGroup) as SelectOptionGroup[];
}

/** 按模式规整选中值 */
function normalizeValue(raw: SelectValue | null | undefined, multiple: boolean) {
  if (multiple) {
    if (Array.isArray(raw)) return [...raw];
    return raw === null || raw === undefined ? [] : [raw];
  }
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

/** 受控值等价比较 */
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
  let source: SelectSource = options.options ?? [];

  const state: SelectState = {
    value: normalizeValue(options.value ?? options.defaultValue, multiple),
    open: false,
    activeIndex: -1,
    disabled: options.disabled ?? false,
    searchQuery: '',
    filteredOptions: flattenOptions(source),
    groupedOptions: groupOptions(source),
  };

  let onChange = options.onChange;
  let onClear = options.onClear;
  let clearable = options.clearable ?? false;
  const listeners = new Set<StateListener<SelectState>>();

  const notify = () => {
    const snapshot = {
      ...state,
      value: Array.isArray(state.value) ? [...state.value] : state.value,
      filteredOptions: [...state.filteredOptions],
      groupedOptions: state.groupedOptions.map((g) => ({ ...g, options: [...g.options] })),
    };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 按 searchQuery 过滤分组数据源，返回过滤后的扁平列表和分组结构 */
  const computeFiltered = (): { flat: SelectOption[]; groups: SelectOptionGroup[] } => {
    const query = searchable ? state.searchQuery.trim().toLowerCase() : '';
    const match = (label: string) => query === '' || label.toLowerCase().includes(query);

    const flat: SelectOption[] = [];
    const groups: SelectOptionGroup[] = [];

    for (const item of source) {
      if (isOptionGroup(item)) {
        const filteredChildren = item.options.filter((opt) => match(opt.label));
        if (filteredChildren.length === 0) continue;
        const groupDisabled = item.disabled ?? false;
        const children = filteredChildren.map((opt) => ({
          ...opt,
          disabled: opt.disabled || groupDisabled,
        }));
        groups.push({ label: item.label, options: children, disabled: groupDisabled });
        flat.push(...children);
      } else if (match(item.label)) {
        flat.push(item);
      }
    }

    return { flat, groups };
  };

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

  const selectedArray = (): string[] => (Array.isArray(state.value) ? state.value : []);

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
      groupedOptions: state.groupedOptions.map((g) => ({ ...g, options: [...g.options] })),
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
      if (next.options !== undefined) source = next.options;
      if (next.clearable !== undefined) clearable = next.clearable;
      if (next.multiple !== undefined) multiple = next.multiple;
      if (next.searchable !== undefined) searchable = next.searchable;
      if (next.onChange !== undefined) onChange = next.onChange;
      if (next.onClear !== undefined) onClear = next.onClear;

      const { flat, groups } = computeFiltered();
      if (flat.length !== state.filteredOptions.length || groups !== state.groupedOptions) {
        state.filteredOptions = flat;
        state.groupedOptions = groups;
        changed = true;
      }

      if (changed) notify();
    },

    toggleOpen() {
      if (state.disabled) return;
      if (state.open) {
        state.open = false;
        state.activeIndex = -1;
        if (state.searchQuery !== '') {
          state.searchQuery = '';
          const { flat, groups } = computeFiltered();
          state.filteredOptions = flat;
          state.groupedOptions = groups;
        }
      } else {
        state.open = true;
        const { flat, groups } = computeFiltered();
        state.filteredOptions = flat;
        state.groupedOptions = groups;
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
        const { flat, groups } = computeFiltered();
        state.filteredOptions = flat;
        state.groupedOptions = groups;
      }
      notify();
    },

    select(value) {
      if (state.disabled) return;
      const flat = flattenOptions(source);
      const option = flat.find((item) => item.value === value);
      if (!option || option.disabled) return;

      if (multiple) {
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
        const { flat: f, groups } = computeFiltered();
        state.filteredOptions = f;
        state.groupedOptions = groups;
      }

      if (state.value !== value) {
        if (!controlled) {
          state.value = value;
          notify();
        }
        onChange?.(value);
      } else {
        notify();
      }
    },

    clear() {
      if (state.disabled) return;
      if (multiple) {
        if (selectedArray().length === 0) return;
        if (!controlled) {
          state.value = [];
        }
        notify();
        // 受控模式下通过 onChange([]) 通知外部清空，非受控同样广播值变化
        onChange?.([]);
        onClear?.();
        return;
      }
      if (!clearable || state.value === null) return;
      if (!controlled) {
        state.value = null;
      }
      notify();
      // 受控模式下通过 onChange('') 通知外部清空
      onChange?.('');
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
      const { flat, groups } = computeFiltered();
      state.filteredOptions = flat;
      state.groupedOptions = groups;
      state.activeIndex = state.filteredOptions.length > 0 ? nextEnabledIndex(-1, 1) : -1;
      notify();
    },
  };
}
