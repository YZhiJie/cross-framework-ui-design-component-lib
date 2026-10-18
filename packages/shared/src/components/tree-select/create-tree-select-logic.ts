/**
 * TreeSelect 纯逻辑工厂
 *
 * 状态：value（单选 string|null / 多选 string[]）/ open / expandedKeys /
 *       selectedKey / checkedKeys / disabled
 * 交互：toggleOpen / close / toggleExpand / selectNode（单选，选中即收起）/
 *       toggleCheck（多选，级联勾选且面板保持展开）/ clear
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新选中值，由外部通过 updateOptions 同步。
 *
 * 复用 tree 逻辑的纯函数（flattenTree / getNodeCheckState / collectSubtreeKeys），
 * 级联勾选口径与 Tree 组件一致：勾选父级联动全部非禁用后代，
 * 父级勾选态由后代叶子推导，禁用与 disableCheckbox 节点不参与级联。
 *
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';
import {
  collectSubtreeKeys,
  flattenTree,
  getNodeCheckState,
  isTreeLeaf,
} from '../tree/create-tree-logic';
import type { TreeNode } from '../tree/create-tree-logic';

/** TreeSelect 选中值（单选 string / 多选 string[]；与 core 契约结构一致） */
export type TreeSelectValue = string | string[];

/** TreeSelect 逻辑配置（由适配层从 Props 中提取注入） */
export type TreeSelectLogicOptions = {
  /** 受控选中值（提供即受控） */
  value?: TreeSelectValue;
  /** 非受控初始选中值 */
  defaultValue?: TreeSelectValue;
  /** 树形数据 */
  treeData?: TreeNode[];
  /** 多选模式 */
  multiple?: boolean;
  /** 多选勾选父子独立 */
  checkStrictly?: boolean;
  /** 非受控默认展开全部节点 */
  defaultExpandAll?: boolean;
  disabled?: boolean;
  onChange?: (value: TreeSelectValue) => void;
  onClear?: () => void;
};

/** TreeSelect 状态快照 */
export type TreeSelectState = {
  /** 单选 string | null；多选 string[] */
  value: string | string[] | null;
  open: boolean;
  expandedKeys: string[];
  /** 单选选中 key（多选恒为 null） */
  selectedKey: string | null;
  /** 多选勾选 keys（单选恒为空数组） */
  checkedKeys: string[];
  disabled: boolean;
};

/** TreeSelect 逻辑实例 */
export interface TreeSelectLogicInstance
  extends LogicInstance<TreeSelectLogicOptions, TreeSelectState> {
  toggleOpen: () => void;
  close: () => void;
  toggleExpand: (key: string) => void;
  /** 单选：选中节点并收起面板 */
  selectNode: (key: string) => void;
  /** 多选：切换勾选（级联）；亦用于标签移除 */
  toggleCheck: (key: string) => void;
  clear: () => void;
  isExpanded: (key: string) => boolean;
  getCheckState: (key: string) => { checked: boolean; indeterminate: boolean };
}

/** 数组浅比较 */
function arrayEquals(a: string[], b: string[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

export function createTreeSelectLogic(
  options: TreeSelectLogicOptions = {},
): TreeSelectLogicInstance {
  const multiple = options.multiple ?? false;
  const controlled = options.value !== undefined;

  let treeData = options.treeData ?? [];
  let checkStrictly = options.checkStrictly ?? false;
  let onChange = options.onChange;
  let onClear = options.onClear;

  /** 非受控初始值解析（multiple 下 string 视为无效回退空数组） */
  const parseInitial = (): { selectedKey: string | null; checkedKeys: string[] } => {
    const initial = options.value !== undefined ? options.value : options.defaultValue;
    if (multiple) {
      return { selectedKey: null, checkedKeys: Array.isArray(initial) ? [...initial] : [] };
    }
    return { selectedKey: typeof initial === 'string' ? initial : null, checkedKeys: [] };
  };

  const initial = parseInitial();

  const computeInitialExpanded = (): string[] => {
    if (!options.defaultExpandAll) return [];
    const { keyMap } = flattenTree(treeData);
    const keys: string[] = [];
    keyMap.forEach(({ node }, key) => {
      if (!isTreeLeaf(node)) keys.push(key);
    });
    return keys;
  };

  const state: TreeSelectState = {
    value: multiple ? [...initial.checkedKeys] : initial.selectedKey,
    open: false,
    expandedKeys: computeInitialExpanded(),
    selectedKey: initial.selectedKey,
    checkedKeys: initial.checkedKeys,
    disabled: options.disabled ?? false,
  };

  const listeners = new Set<StateListener<TreeSelectState>>();

  const notify = () => {
    const snapshot: TreeSelectState = {
      value: multiple ? [...state.checkedKeys] : state.selectedKey,
      open: state.open,
      expandedKeys: [...state.expandedKeys],
      selectedKey: state.selectedKey,
      checkedKeys: [...state.checkedKeys],
      disabled: state.disabled,
    };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 非受控：写内部值快照（value 由 notify 统一按模式镜像） */
  const applyInternal = (next: { selectedKey?: string | null; checkedKeys?: string[] }) => {
    if (controlled) return;
    if (next.selectedKey !== undefined) state.selectedKey = next.selectedKey;
    if (next.checkedKeys !== undefined) state.checkedKeys = [...next.checkedKeys];
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({
      value: multiple ? [...state.checkedKeys] : state.selectedKey,
      open: state.open,
      expandedKeys: [...state.expandedKeys],
      selectedKey: state.selectedKey,
      checkedKeys: [...state.checkedKeys],
      disabled: state.disabled,
    }),

    updateOptions(next) {
      let changed = false;

      if (next.treeData !== undefined && next.treeData !== treeData) {
        treeData = next.treeData;
        changed = true;
      }
      if (next.checkStrictly !== undefined && next.checkStrictly !== checkStrictly) {
        checkStrictly = next.checkStrictly;
        changed = true;
      }
      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        if (state.disabled && state.open) state.open = false;
        changed = true;
      }

      // 受控值同步（multiple 下非数组 / 单选下非 string 的入参按类型守卫忽略）
      if (next.value !== undefined) {
        if (multiple) {
          const nextKeys = Array.isArray(next.value) ? next.value : null;
          if (nextKeys && !arrayEquals(nextKeys, state.checkedKeys)) {
            state.checkedKeys = [...nextKeys];
            changed = true;
          }
        } else if (typeof next.value === 'string' && next.value !== state.selectedKey) {
          state.selectedKey = next.value;
          changed = true;
        }
      }

      if (next.onChange !== undefined) onChange = next.onChange;
      if (next.onClear !== undefined) onClear = next.onClear;

      if (changed) notify();
    },

    toggleOpen() {
      if (state.disabled) return;
      state.open = !state.open;
      notify();
    },

    close() {
      if (!state.open) return;
      state.open = false;
      notify();
    },

    toggleExpand(key) {
      if (state.disabled) return;
      const entry = flattenTree(treeData).keyMap.get(key);
      if (!entry || entry.node.disabled || isTreeLeaf(entry.node)) return;
      state.expandedKeys = state.expandedKeys.includes(key)
        ? state.expandedKeys.filter((k) => k !== key)
        : [...state.expandedKeys, key];
      notify();
    },

    selectNode(key) {
      if (state.disabled || multiple) return;
      const entry = flattenTree(treeData).keyMap.get(key);
      if (!entry || entry.node.disabled) return;
      applyInternal({ selectedKey: key });
      state.open = false;
      notify();
      onChange?.(key);
    },

    toggleCheck(key) {
      if (!multiple || state.disabled) return;
      const { keyMap } = flattenTree(treeData);
      const entry = keyMap.get(key);
      if (!entry || entry.node.disabled || entry.node.disableCheckbox) return;

      let next: string[];
      if (checkStrictly) {
        next = state.checkedKeys.includes(key)
          ? state.checkedKeys.filter((k) => k !== key)
          : [...state.checkedKeys, key];
      } else {
        // 父子联动：勾选收集子树全部非禁用、非 disableCheckbox 节点（含中间节点便于半选推导）
        const subtree = collectSubtreeKeys(treeData, key);
        const currentlyChecked = getNodeCheckState(treeData, state.checkedKeys, key, false).checked;
        if (currentlyChecked) {
          const removeSet = new Set(subtree);
          next = state.checkedKeys.filter((k) => !removeSet.has(k));
        } else {
          const addKeys = subtree.filter((k) => {
            const item = keyMap.get(k);
            return item && !item.node.disabled && !item.node.disableCheckbox;
          });
          next = [...new Set([...state.checkedKeys, ...addKeys])];
        }
      }
      applyInternal({ checkedKeys: next });
      notify();
      onChange?.([...next]);
    },

    clear() {
      if (state.disabled) return;
      if (multiple) {
        if (state.checkedKeys.length === 0) return;
        applyInternal({ checkedKeys: [] });
        notify();
        // 受控模式下通过 onChange([]) 通知外部清空，非受控同样广播值变化
        onChange?.([]);
        onClear?.();
        return;
      }
      if (state.selectedKey === null) return;
      applyInternal({ selectedKey: null });
      notify();
      // 受控模式下通过 onChange('') 通知外部清空
      onChange?.('');
      onClear?.();
    },

    isExpanded: (key) => state.expandedKeys.includes(key),

    getCheckState: (key) => getNodeCheckState(treeData, state.checkedKeys, key, checkStrictly),
  };
}
