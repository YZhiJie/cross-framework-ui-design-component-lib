/**
 * Tree 纯逻辑工厂
 *
 * 状态：expandedKeys / checkedKeys / selectedKey / disabled
 * 交互：toggleExpand / toggleCheck / select / checkAll / uncheckAll
 * 受控模式：创建时提供 expandedKeys / checkedKeys / selectedKey 即进入对应受控模式，
 * 内部不再自行更新该字段，由外部通过 updateOptions 同步。
 *
 * 勾选级联（checkStrictly=false 默认）：
 *   - 勾选父级 → 勾选全部非禁用后代（含中间节点与叶子）
 *   - 取消父级 → 移除全部后代勾选
 *   - 父级勾选态由后代叶子推导：全勾 → checked，部分 → indeterminate
 *   - 禁用叶子计入推导分母：存在未勾选的禁用后代时父级最多半选
 *   - 禁用节点不参与 toggleCheck / checkAll 的级联勾选
 *
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 树节点（与 @xui-design/core 的 TreeNode 结构一致；shared 不依赖 core，本地定义） */
export type TreeNode = {
  /** 节点唯一标识（全树唯一） */
  key: string;
  /** 节点文案 */
  label: string;
  /** 子节点 */
  children?: TreeNode[];
  /** 禁用本节点 */
  disabled?: boolean;
  /** 仅禁用勾选框 */
  disableCheckbox?: boolean;
};

/** Tree 逻辑配置（由适配层从 Props 中提取注入） */
export type TreeLogicOptions = {
  /** 树形数据 */
  data?: TreeNode[];
  /** 受控展开 keys（提供即受控） */
  expandedKeys?: string[];
  /** 非受控初始展开 keys */
  defaultExpandedKeys?: string[];
  /** 受控勾选 keys（提供即受控） */
  checkedKeys?: string[];
  /** 非受控初始勾选 keys */
  defaultCheckedKeys?: string[];
  /** 受控选中 key（提供即受控） */
  selectedKey?: string | null;
  /** 非受控初始选中 key */
  defaultSelectedKey?: string | null;
  checkable?: boolean;
  checkStrictly?: boolean;
  defaultExpandAll?: boolean;
  disabled?: boolean;
  onExpand?: (expandedKeys: string[], info: { key: string; expanded: boolean }) => void;
  onCheck?: (checkedKeys: string[], info: { key: string; checked: boolean }) => void;
  onSelect?: (selectedKey: string | null, info: { key: string }) => void;
};

/** Tree 状态快照 */
export type TreeState = {
  expandedKeys: string[];
  checkedKeys: string[];
  selectedKey: string | null;
  disabled: boolean;
};

/** Tree 逻辑实例 */
export interface TreeLogicInstance extends LogicInstance<TreeLogicOptions, TreeState> {
  toggleExpand: (key: string) => void;
  toggleCheck: (key: string) => void;
  select: (key: string) => void;
  /** 展开全部非叶子节点 */
  expandAll: () => void;
  /** 收起全部节点 */
  collapseAll: () => void;
  checkAll: () => void;
  uncheckAll: () => void;
  isExpanded: (key: string) => boolean;
  getCheckState: (key: string) => { checked: boolean; indeterminate: boolean };
}

/** 判断节点是否叶子 */
export function isTreeLeaf(node: TreeNode): boolean {
  return !node.children || node.children.length === 0;
}

/** 扁平化树（DFS 先序），返回 key → { node, parentKey } 映射及根 key 列表 */
export function flattenTree(data: TreeNode[]): {
  keyMap: Map<string, { node: TreeNode; parentKey: string | null }>;
  rootKeys: string[];
} {
  const keyMap = new Map<string, { node: TreeNode; parentKey: string | null }>();
  const rootKeys: string[] = [];
  const walk = (nodes: TreeNode[], parentKey: string | null) => {
    for (const node of nodes) {
      keyMap.set(node.key, { node, parentKey });
      if (parentKey === null) rootKeys.push(node.key);
      if (node.children && node.children.length > 0) {
        walk(node.children, node.key);
      }
    }
  };
  walk(data, null);
  return { keyMap, rootKeys };
}

/** 收集某节点的全部后代 keys（含自身） */
export function collectSubtreeKeys(data: TreeNode[], key: string): string[] {
  const { keyMap } = flattenTree(data);
  const entry = keyMap.get(key);
  if (!entry) return [];
  const result: string[] = [];
  const walk = (node: TreeNode) => {
    result.push(node.key);
    if (node.children) {
      for (const child of node.children) walk(child);
    }
  };
  walk(entry.node);
  return result;
}

/** 收集某节点的全部后代叶子 keys（含自身若是叶子；includeDisabled=true 时禁用叶子也计入） */
function collectLeafKeys(data: TreeNode[], key: string, includeDisabled = false): string[] {
  const { keyMap } = flattenTree(data);
  const entry = keyMap.get(key);
  if (!entry) return [];
  const result: string[] = [];
  const walk = (node: TreeNode) => {
    if (node.disabled && !includeDisabled) return;
    if (isTreeLeaf(node)) {
      result.push(node.key);
      return;
    }
    for (const child of node.children ?? []) walk(child);
  };
  walk(entry.node);
  return result;
}

/**
 * 推导某节点的勾选状态（checkStrictly=false 时父级由后代叶子推导）
 *
 * - 叶子 / checkStrictly：仅看自身是否在 checkedKeys
 * - 父级（父子联动）：后代叶子全勾 → checked；部分勾 → indeterminate
 * - 禁用叶子计入分母：存在未勾选的禁用后代时父级最多半选
 */
export function getNodeCheckState(
  data: TreeNode[],
  checkedKeys: string[],
  key: string,
  checkStrictly = false,
): { checked: boolean; indeterminate: boolean } {
  const { keyMap } = flattenTree(data);
  const entry = keyMap.get(key);
  if (!entry) return { checked: false, indeterminate: false };
  if (checkStrictly || isTreeLeaf(entry.node)) {
    return { checked: checkedKeys.includes(key), indeterminate: false };
  }
  const leafKeys = collectLeafKeys(data, key, true);
  if (leafKeys.length === 0) return { checked: false, indeterminate: false };
  const checkedSet = new Set(checkedKeys);
  const checkedCount = leafKeys.filter((k) => checkedSet.has(k)).length;
  return {
    checked: checkedCount === leafKeys.length,
    indeterminate: checkedCount > 0 && checkedCount < leafKeys.length,
  };
}

function arrayEquals(a: string[] | null | undefined, b: string[] | null | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

export function createTreeLogic(options: TreeLogicOptions = {}): TreeLogicInstance {
  const expandedControlled = options.expandedKeys !== undefined;
  const checkedControlled = options.checkedKeys !== undefined;
  const selectedControlled = options.selectedKey !== undefined;

  let data: TreeNode[] = options.data ?? [];
  let checkStrictly = options.checkStrictly ?? false;
  let checkable = options.checkable ?? false;

  const computeInitialExpanded = (): string[] => {
    if (options.expandedKeys !== undefined) return [...options.expandedKeys];
    if (options.defaultExpandAll) {
      // 展开全部非叶子节点
      const { keyMap } = flattenTree(data);
      const keys: string[] = [];
      keyMap.forEach(({ node }, key) => {
        if (!isTreeLeaf(node)) keys.push(key);
      });
      return keys;
    }
    return options.defaultExpandedKeys ? [...options.defaultExpandedKeys] : [];
  };

  const state: TreeState = {
    expandedKeys: computeInitialExpanded(),
    checkedKeys:
      options.checkedKeys !== undefined
        ? [...options.checkedKeys]
        : options.defaultCheckedKeys
          ? [...options.defaultCheckedKeys]
          : [],
    selectedKey:
      options.selectedKey !== undefined
        ? options.selectedKey
        : (options.defaultSelectedKey ?? null),
    disabled: options.disabled ?? false,
  };

  let onExpand = options.onExpand;
  let onCheck = options.onCheck;
  let onSelect = options.onSelect;
  const listeners = new Set<StateListener<TreeState>>();

  const notify = () => {
    const snapshot: TreeState = {
      expandedKeys: [...state.expandedKeys],
      checkedKeys: [...state.checkedKeys],
      selectedKey: state.selectedKey,
      disabled: state.disabled,
    };
    listeners.forEach((listener) => listener(snapshot));
  };

  const findNode = (key: string): TreeNode | null => {
    const { keyMap } = flattenTree(data);
    return keyMap.get(key)?.node ?? null;
  };

  const setExpandedKeys = (keys: string[], changedKey: string, expanded: boolean) => {
    if (!expandedControlled) {
      state.expandedKeys = keys;
    }
    notify();
    onExpand?.(keys, { key: changedKey, expanded });
  };

  const setCheckedKeys = (keys: string[], changedKey: string, checked: boolean) => {
    if (!checkedControlled) {
      state.checkedKeys = keys;
    }
    notify();
    onCheck?.(keys, { key: changedKey, checked });
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({
      expandedKeys: [...state.expandedKeys],
      checkedKeys: [...state.checkedKeys],
      selectedKey: state.selectedKey,
      disabled: state.disabled,
    }),

    updateOptions(next) {
      let changed = false;

      if (next.data !== undefined && next.data !== data) {
        data = next.data;
        changed = true;
      }
      if (next.checkable !== undefined && next.checkable !== checkable) {
        checkable = next.checkable;
        changed = true;
      }
      if (next.checkStrictly !== undefined && next.checkStrictly !== checkStrictly) {
        checkStrictly = next.checkStrictly;
        changed = true;
      }
      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        changed = true;
      }
      if (next.expandedKeys !== undefined && !arrayEquals(next.expandedKeys, state.expandedKeys)) {
        state.expandedKeys = [...next.expandedKeys];
        changed = true;
      }
      if (next.checkedKeys !== undefined && !arrayEquals(next.checkedKeys, state.checkedKeys)) {
        state.checkedKeys = [...next.checkedKeys];
        changed = true;
      }
      if (next.selectedKey !== undefined && next.selectedKey !== state.selectedKey) {
        state.selectedKey = next.selectedKey;
        changed = true;
      }

      if (next.onExpand !== undefined) onExpand = next.onExpand;
      if (next.onCheck !== undefined) onCheck = next.onCheck;
      if (next.onSelect !== undefined) onSelect = next.onSelect;

      if (changed) notify();
    },

    toggleExpand(key) {
      if (state.disabled) return;
      const node = findNode(key);
      if (!node || node.disabled || isTreeLeaf(node)) return;
      const expanded = !state.expandedKeys.includes(key);
      const next = expanded
        ? [...state.expandedKeys, key]
        : state.expandedKeys.filter((k) => k !== key);
      setExpandedKeys(next, key, expanded);
    },

    toggleCheck(key) {
      if (state.disabled) return;
      const node = findNode(key);
      if (!node || node.disabled || node.disableCheckbox) return;

      const currentlyChecked = checkStrictly
        ? state.checkedKeys.includes(key)
        : getNodeCheckState(data, state.checkedKeys, key, false).checked;

      if (checkStrictly) {
        const next = currentlyChecked
          ? state.checkedKeys.filter((k) => k !== key)
          : [...state.checkedKeys, key];
        setCheckedKeys(next, key, !currentlyChecked);
        return;
      }

      // 父子联动：勾选时收集子树全部非禁用、非 disableCheckbox 节点（含中间节点便于半选推导）
      const subtree = collectSubtreeKeys(data, key);
      const { keyMap } = flattenTree(data);
      if (currentlyChecked) {
        const removeSet = new Set(subtree);
        setCheckedKeys(
          state.checkedKeys.filter((k) => !removeSet.has(k)),
          key,
          false,
        );
      } else {
        const addKeys = subtree.filter((k) => {
          const entry = keyMap.get(k);
          return entry && !entry.node.disabled && !entry.node.disableCheckbox;
        });
        const merged = new Set([...state.checkedKeys, ...addKeys]);
        setCheckedKeys([...merged], key, true);
      }
    },

    select(key) {
      if (state.disabled) return;
      const node = findNode(key);
      if (!node || node.disabled) return;
      if (!selectedControlled) {
        state.selectedKey = key;
      }
      notify();
      onSelect?.(key, { key });
    },

    expandAll() {
      if (state.disabled) return;
      const { keyMap } = flattenTree(data);
      const keys: string[] = [];
      keyMap.forEach(({ node }, k) => {
        if (!isTreeLeaf(node)) keys.push(k);
      });
      if (!expandedControlled) {
        state.expandedKeys = keys;
      }
      notify();
      onExpand?.(keys, { key: '', expanded: true });
    },

    collapseAll() {
      if (state.disabled) return;
      if (!expandedControlled) {
        state.expandedKeys = [];
      }
      notify();
      onExpand?.([], { key: '', expanded: false });
    },

    checkAll() {
      if (state.disabled) return;
      if (checkStrictly) {
        // 勾选全部非禁用节点
        const { keyMap } = flattenTree(data);
        const keys: string[] = [];
        keyMap.forEach(({ node }, k) => {
          if (!node.disabled && !node.disableCheckbox) keys.push(k);
        });
        setCheckedKeys(keys, '', true);
        return;
      }
      // 父子联动：仅需要勾选全部非禁用叶子 + 中间节点
      const { keyMap } = flattenTree(data);
      const keys: string[] = [];
      keyMap.forEach(({ node }, k) => {
        if (!node.disabled && !node.disableCheckbox) keys.push(k);
      });
      setCheckedKeys(keys, '', true);
    },

    uncheckAll() {
      if (state.disabled) return;
      setCheckedKeys([], '', false);
    },

    isExpanded: (key) => state.expandedKeys.includes(key),

    getCheckState: (key) => getNodeCheckState(data, state.checkedKeys, key, checkStrictly),
  };
}
