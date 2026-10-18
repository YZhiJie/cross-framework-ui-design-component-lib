/**
 * Cascader 纯逻辑工厂
 *
 * 状态：value / open / activePath / disabled
 * 交互：toggleOpen / close / select / clear
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中值，由外部通过 updateOptions 同步。
 *
 * 单选模式（默认）：value 为 string[]（从根到选中节点的值路径），空数组表示未选中。
 * 多选模式（multiple=true）：value 为 string[][]（已勾选叶子节点的路径数组）。
 *   - 点击叶子切换勾选状态，面板保持展开
 *   - 点击非叶子节点仅展开子列，不触发勾选（checkStrictly=true 时可勾选任意层级）
 *   - toggleCheck(path) 支持级联：勾选父节点自动勾选所有后代叶子
 *   - checkAll / uncheckAll 提供全选 / 清空
 *
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 * 列渲染由适配层根据 activePath 调用 getColumnsByPath 计算。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 级联选项（与 @xui-design/core 的 CascaderOption 结构一致；shared 不依赖 core，本地定义） */
export type CascaderOption = {
  /** 选项文案 */
  label: string;
  /** 选项值（同父级下唯一） */
  value: string;
  /** 子选项（存在且非空时表示非叶子节点） */
  children?: CascaderOption[];
  /** 禁用本项 */
  disabled?: boolean;
};

/** 单选值类型 */
export type CascaderSingleValue = string[];
/** 多选值类型 */
export type CascaderMultiValue = string[][];
/** Cascader 值（单选 / 多选） */
export type CascaderValue = CascaderSingleValue | CascaderMultiValue;

/** Cascader 逻辑配置（由适配层从 Props 中提取注入） */
export type CascaderLogicOptions = {
  /** 受控选中路径（单选 string[]，多选 string[][]；提供即受控） */
  value?: CascaderValue;
  /** 非受控初始选中路径 */
  defaultValue?: CascaderValue;
  /** 树形选项数据 */
  options?: CascaderOption[];
  disabled?: boolean;
  separator?: string;
  /** 是否选中任意层级即触发 onChange（单选模式，默认需选到叶子节点） */
  changeOnSelect?: boolean;
  /** 是否多选模式 */
  multiple?: boolean;
  /** 多选模式下是否允许选到任意层级（默认仅叶子节点可勾选） */
  checkStrictly?: boolean;
  onChange?: (value: CascaderValue, labels: string[] | string[][]) => void;
  onClear?: () => void;
};

/** Cascader 状态快照 */
export type CascaderState = {
  /** 当前选中路径（单选 string[] | null，多选 string[][]） */
  value: CascaderValue | null;
  /** 面板展开状态 */
  open: boolean;
  /** 当前展开的列路径值（决定渲染哪些列） */
  activePath: string[];
  disabled: boolean;
};

/** Cascader 逻辑实例 */
export interface CascaderLogicInstance extends LogicInstance<CascaderLogicOptions, CascaderState> {
  /** 展开 / 收起面板 */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
  /** 选中第 level 列的 value 选项 */
  select: (level: number, value: string) => void;
  /** 清空选中值 */
  clear: () => void;
  /** 多选模式：切换某条路径的勾选状态（支持级联） */
  toggleCheck: (path: string[]) => void;
  /** 多选模式：全选所有叶子节点 */
  checkAll: () => void;
  /** 多选模式：清空所有勾选 */
  uncheckAll: () => void;
}

/** 判断选项是否叶子节点 */
export function isLeaf(option: CascaderOption): boolean {
  return !option.children || option.children.length === 0;
}

/**
 * 根据 activePath 从 options 树中依次定位每一列的选项列表
 */
export function getColumnsByPath(
  options: CascaderOption[],
  activePath: string[],
): CascaderOption[][] {
  const columns: CascaderOption[][] = [options];
  let current = options;
  for (const pathValue of activePath) {
    const found = current.find((opt) => opt.value === pathValue);
    if (!found || !found.children || found.children.length === 0) break;
    current = found.children;
    columns.push(current);
  }
  return columns;
}

/**
 * 根据值路径查找对应的选项路径（含 label），路径中断返回 null
 */
export function resolvePath(
  options: CascaderOption[],
  path: string[],
): { values: string[]; labels: string[] } | null {
  const values: string[] = [];
  const labels: string[] = [];
  let current = options;
  for (const pathValue of path) {
    const found = current.find((opt) => opt.value === pathValue);
    if (!found) return null;
    values.push(found.value);
    labels.push(found.label);
    current = found.children ?? [];
  }
  return { values, labels };
}

/** 收集树中所有叶子节点的完整路径 */
function getAllLeafPaths(options: CascaderOption[], prefix: string[] = []): string[][] {
  const paths: string[][] = [];
  for (const opt of options) {
    if (opt.disabled) continue;
    const currentPath = [...prefix, opt.value];
    if (isLeaf(opt)) {
      paths.push(currentPath);
    } else if (opt.children) {
      paths.push(...getAllLeafPaths(opt.children, currentPath));
    }
  }
  return paths;
}

/** 获取某条路径下的所有后代叶子路径（含自身若是叶子） */
function getDescendantLeafPaths(options: CascaderOption[], path: string[]): string[][] {
  let current: CascaderOption[] | undefined = options;
  for (const v of path) {
    if (!current) return [];
    const found: CascaderOption | undefined = current.find((o) => o.value === v);
    if (!found) return [];
    current = found.children;
  }
  if (current === undefined) {
    // path 指向叶子节点
    return [path];
  }
  return getAllLeafPaths(current, path);
}

/** 路径是否已勾选（精确匹配） */
function isPathChecked(checked: string[][], path: string[]): boolean {
  return checked.some((p) => p.length === path.length && p.every((v, i) => v === path[i]));
}

/** 路径比较 */
function pathEquals(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** 数组浅比较 */
function arrayEquals(a: string[] | null, b: string[] | null): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

/** 多选值比较 */
function multiValueEquals(a: string[][] | null, b: string[][] | null): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  const setB = new Set(b.map((p) => p.join('/')));
  return a.every((p) => setB.has(p.join('/')));
}

/** 判断值是否为多选数组（string[][]） */
function isMultiValue(value: CascaderValue | null | undefined): value is string[][] {
  if (!value || value.length === 0) return false;
  return Array.isArray(value[0]);
}

export function createCascaderLogic(options: CascaderLogicOptions = {}): CascaderLogicInstance {
  const controlled = options.value !== undefined;
  const multiple = options.multiple ?? false;

  // 初始值：非受控用 defaultValue
  const initialValue =
    options.value !== undefined
      ? options.value
      : options.defaultValue
        ? options.defaultValue
        : null;

  const state: CascaderState = {
    value: initialValue ? (Array.isArray(initialValue) ? initialValue : null) : null,
    open: false,
    activePath: multiple
      ? []
      : initialValue && !isMultiValue(initialValue)
        ? [...initialValue]
        : [],
    disabled: options.disabled ?? false,
  };

  let onChange = options.onChange;
  let onClear = options.onClear;
  let optionTree: CascaderOption[] = options.options ?? [];
  let changeOnSelect = options.changeOnSelect ?? false;
  let checkStrictly = options.checkStrictly ?? false;
  const listeners = new Set<StateListener<CascaderState>>();

  const notify = () => {
    const snapshot: CascaderState = {
      ...state,
      value: state.value
        ? Array.isArray(state.value[0])
          ? (state.value as string[][]).map((p) => [...p])
          : [...(state.value as string[])]
        : null,
      activePath: [...state.activePath],
    };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 获取当前勾选的路径集合（多选模式下的内部表示） */
  const getCheckedPaths = (): string[][] => {
    if (multiple && state.value && isMultiValue(state.value)) {
      return state.value as string[][];
    }
    return [];
  };

  /** 设置勾选路径集合并触发回调 */
  const setCheckedPaths = (paths: string[][]) => {
    const deduped = dedupPaths(paths);
    if (!controlled) {
      state.value = deduped;
    }
    notify();
    const labels = deduped
      .map((p) => resolvePath(optionTree, p)?.labels)
      .filter(Boolean) as string[][];
    onChange?.(deduped, labels);
  };

  /** 路径去重 */
  const dedupPaths = (paths: string[][]): string[][] => {
    const seen = new Set<string>();
    const result: string[][] = [];
    for (const p of paths) {
      const key = p.join('/');
      if (!seen.has(key)) {
        seen.add(key);
        result.push(p);
      }
    }
    return result;
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
      value: state.value
        ? Array.isArray(state.value[0])
          ? (state.value as string[][]).map((p) => [...p])
          : [...(state.value as string[])]
        : null,
      activePath: [...state.activePath],
    }),

    updateOptions(next) {
      let changed = false;

      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        if (state.disabled && state.open) {
          state.open = false;
        }
        changed = true;
      }

      // 受控值同步
      if (next.value !== undefined) {
        if (multiple) {
          const nextMulti = (next.value as string[][]) ?? [];
          if (!multiValueEquals(nextMulti, state.value as string[][] | null)) {
            state.value = nextMulti.length > 0 ? nextMulti.map((p) => [...p]) : [];
            changed = true;
          }
        } else {
          const nextSingle = next.value as string[] | undefined;
          if (!arrayEquals(nextSingle ?? null, state.value as string[] | null)) {
            state.value = nextSingle && nextSingle.length > 0 ? [...nextSingle] : null;
            state.activePath = state.value ? [...state.value] : [];
            changed = true;
          }
        }
      }

      if (next.options !== undefined) optionTree = next.options;
      if (next.changeOnSelect !== undefined) changeOnSelect = next.changeOnSelect;
      if (next.checkStrictly !== undefined) checkStrictly = next.checkStrictly;
      if (next.onChange !== undefined) onChange = next.onChange;
      if (next.onClear !== undefined) onClear = next.onClear;

      if (changed) notify();
    },

    toggleOpen() {
      if (state.disabled) return;
      if (!state.open) {
        // 展开时 activePath 初始化（单选用选中值，多选清空）
        state.activePath = multiple
          ? []
          : state.value && !isMultiValue(state.value)
            ? [...state.value]
            : [];
      }
      state.open = !state.open;
      notify();
    },

    close() {
      if (!state.open) return;
      state.open = false;
      notify();
    },

    select(level, value) {
      if (state.disabled) return;

      // 定位当前列的选项
      const columns = getColumnsByPath(optionTree, state.activePath.slice(0, level));
      const option = columns[level]?.find((opt) => opt.value === value);
      if (!option || option.disabled) return;

      // 更新 activePath：截断到 level，追加当前值
      const nextActive = [...state.activePath.slice(0, level), value];
      state.activePath = nextActive;

      // ===== 多选模式 =====
      if (multiple) {
        // checkStrictly 或叶子节点：切换勾选
        if (checkStrictly || isLeaf(option)) {
          const checked = getCheckedPaths();
          if (isPathChecked(checked, nextActive)) {
            setCheckedPaths(checked.filter((p) => !pathEquals(p, nextActive)));
          } else {
            setCheckedPaths([...checked, nextActive]);
          }
        }
        // 非叶子且非 checkStrictly：仅展开子列，不触发勾选
        notify();
        return;
      }

      // ===== 单选模式（原有逻辑） =====
      const leaf = isLeaf(option);

      if (changeOnSelect || leaf) {
        const resolved = resolvePath(optionTree, nextActive);
        const values = resolved?.values ?? nextActive;
        const labels = resolved?.labels ?? [];
        if (!controlled) {
          state.value = [...values];
        }
        state.open = false;
        notify();
        onChange?.(values, labels);
        return;
      }

      // 非叶子且非 changeOnSelect：仅更新 activePath，保持面板展开
      notify();
    },

    clear() {
      if (state.disabled) return;
      const isEmpty = multiple
        ? !state.value || (state.value as string[][]).length === 0
        : state.value === null;
      if (isEmpty) return;

      if (!controlled) {
        state.value = multiple ? [] : null;
        state.activePath = [];
      }
      notify();
      // 受控模式下通过 onChange 通知外部清空
      if (multiple) {
        onChange?.([], []);
      } else {
        onChange?.([], []);
      }
      onClear?.();
    },

    toggleCheck(path) {
      if (!multiple || state.disabled) return;

      const checked = getCheckedPaths();
      const leafPaths = checkStrictly ? [path] : getDescendantLeafPaths(optionTree, path);

      // 判断是否所有后代叶子都已勾选 → 若是则取消，否则全选
      const allChecked = leafPaths.every((p) => isPathChecked(checked, p));

      let next: string[][];
      if (allChecked) {
        const removeKeys = new Set(leafPaths.map((p) => p.join('/')));
        next = checked.filter((p) => !removeKeys.has(p.join('/')));
      } else {
        next = dedupPaths([...checked, ...leafPaths]);
      }
      setCheckedPaths(next);
    },

    checkAll() {
      if (!multiple || state.disabled) return;
      const allLeafPaths = getAllLeafPaths(optionTree);
      setCheckedPaths(allLeafPaths);
    },

    uncheckAll() {
      if (!multiple || state.disabled) return;
      setCheckedPaths([]);
    },
  };
}
