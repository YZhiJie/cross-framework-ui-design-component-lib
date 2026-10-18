import { describe, expect, it, vi } from 'vitest';
import {
  collectSubtreeKeys,
  createTreeLogic,
  flattenTree,
  getNodeCheckState,
  isTreeLeaf,
} from '../create-tree-logic';
import type { TreeNode } from '../create-tree-logic';

const data: TreeNode[] = [
  {
    key: 'a',
    label: 'A',
    children: [
      { key: 'a-1', label: 'A-1' },
      {
        key: 'a-2',
        label: 'A-2',
        children: [
          { key: 'a-2-1', label: 'A-2-1' },
          { key: 'a-2-2', label: 'A-2-2', disabled: true },
        ],
      },
    ],
  },
  { key: 'b', label: 'B' },
];

describe('createTreeLogic - 工具函数', () => {
  it('isTreeLeaf 判断叶子节点', () => {
    expect(isTreeLeaf({ key: 'x', label: 'X' })).toBe(true);
    expect(isTreeLeaf({ key: 'x', label: 'X', children: [] })).toBe(true);
    expect(isTreeLeaf({ key: 'x', label: 'X', children: [{ key: 'y', label: 'Y' }] })).toBe(false);
  });

  it('flattenTree 建立 key 映射并记录根节点', () => {
    const { keyMap, rootKeys } = flattenTree(data);
    expect(rootKeys).toEqual(['a', 'b']);
    expect(keyMap.get('a-2-1')?.parentKey).toBe('a-2');
    expect(keyMap.get('b')?.parentKey).toBeNull();
  });

  it('collectSubtreeKeys 收集子树全部 key（含自身）', () => {
    expect(collectSubtreeKeys(data, 'a-2')).toEqual(['a-2', 'a-2-1', 'a-2-2']);
    expect(collectSubtreeKeys(data, 'b')).toEqual(['b']);
    expect(collectSubtreeKeys(data, 'missing')).toEqual([]);
  });

  it('getNodeCheckState：叶子仅看自身，父级由后代叶子推导', () => {
    expect(getNodeCheckState(data, ['a-1'], 'a-1')).toEqual({
      checked: true,
      indeterminate: false,
    });
    // a 的后代叶子：a-1 / a-2-1 / a-2-2(disabled 计入分母) → 3 中勾 1 → 半选
    expect(getNodeCheckState(data, ['a-1'], 'a')).toEqual({
      checked: false,
      indeterminate: true,
    });
    // 全部非禁用叶子勾选，但禁用叶子未勾 → 父级仍最多半选
    expect(getNodeCheckState(data, ['a-1', 'a-2-1'], 'a')).toEqual({
      checked: false,
      indeterminate: true,
    });
    // 禁用叶子也勾选 → 全选
    expect(getNodeCheckState(data, ['a-1', 'a-2-1', 'a-2-2'], 'a')).toEqual({
      checked: true,
      indeterminate: false,
    });
    // checkStrictly：仅看自身
    expect(getNodeCheckState(data, ['a'], 'a', true)).toEqual({
      checked: true,
      indeterminate: false,
    });
  });
});

describe('createTreeLogic - 展开/收起', () => {
  it('默认全部收起，toggleExpand 切换展开状态', () => {
    const onExpand = vi.fn();
    const logic = createTreeLogic({ data, onExpand });
    expect(logic.getState().expandedKeys).toEqual([]);

    logic.toggleExpand('a');
    expect(logic.getState().expandedKeys).toEqual(['a']);
    expect(onExpand).toHaveBeenCalledWith(['a'], { key: 'a', expanded: true });

    logic.toggleExpand('a');
    expect(logic.getState().expandedKeys).toEqual([]);
    expect(onExpand).toHaveBeenCalledWith([], { key: 'a', expanded: false });
  });

  it('叶子节点 toggleExpand 无效', () => {
    const onExpand = vi.fn();
    const logic = createTreeLogic({ data, onExpand });
    logic.toggleExpand('b');
    expect(logic.getState().expandedKeys).toEqual([]);
    expect(onExpand).not.toHaveBeenCalled();
  });

  it('defaultExpandAll 展开全部非叶子节点', () => {
    const logic = createTreeLogic({ data, defaultExpandAll: true });
    expect(logic.getState().expandedKeys).toEqual(['a', 'a-2']);
  });

  it('defaultExpandedKeys 初始展开指定节点', () => {
    const logic = createTreeLogic({ data, defaultExpandedKeys: ['a'] });
    expect(logic.getState().expandedKeys).toEqual(['a']);
  });

  it('受控 expandedKeys：toggleExpand 仅回调不更新内部状态', () => {
    const onExpand = vi.fn();
    const logic = createTreeLogic({ data, expandedKeys: [], onExpand });
    logic.toggleExpand('a');
    expect(logic.getState().expandedKeys).toEqual([]);
    expect(onExpand).toHaveBeenCalledWith(['a'], { key: 'a', expanded: true });

    logic.updateOptions({ expandedKeys: ['a'] });
    expect(logic.getState().expandedKeys).toEqual(['a']);
  });

  it('disabled 时 toggleExpand 忽略', () => {
    const onExpand = vi.fn();
    const logic = createTreeLogic({ data, disabled: true, onExpand });
    logic.toggleExpand('a');
    expect(logic.getState().expandedKeys).toEqual([]);
    expect(onExpand).not.toHaveBeenCalled();
  });

  it('expandAll 展开全部非叶子节点并触发 onExpand', () => {
    const onExpand = vi.fn();
    const logic = createTreeLogic({ data, onExpand });
    logic.expandAll();
    expect(logic.getState().expandedKeys).toEqual(['a', 'a-2']);
    expect(onExpand).toHaveBeenCalledWith(['a', 'a-2'], { key: '', expanded: true });
  });

  it('collapseAll 收起全部节点并触发 onExpand', () => {
    const onExpand = vi.fn();
    const logic = createTreeLogic({ data, defaultExpandAll: true, onExpand });
    expect(logic.getState().expandedKeys).toEqual(['a', 'a-2']);
    logic.collapseAll();
    expect(logic.getState().expandedKeys).toEqual([]);
    expect(onExpand).toHaveBeenCalledWith([], { key: '', expanded: false });
  });

  it('受控 expandedKeys：expandAll/collapseAll 仅回调不更新内部状态', () => {
    const onExpand = vi.fn();
    const logic = createTreeLogic({ data, expandedKeys: [], onExpand });
    logic.expandAll();
    expect(logic.getState().expandedKeys).toEqual([]);
    expect(onExpand).toHaveBeenCalledWith(['a', 'a-2'], { key: '', expanded: true });

    logic.updateOptions({ expandedKeys: ['a', 'a-2'] });
    logic.collapseAll();
    expect(logic.getState().expandedKeys).toEqual(['a', 'a-2']);
    expect(onExpand).toHaveBeenCalledWith([], { key: '', expanded: false });
  });

  it('disabled 时 expandAll/collapseAll 忽略', () => {
    const onExpand = vi.fn();
    const logic = createTreeLogic({ data, disabled: true, onExpand });
    logic.expandAll();
    logic.collapseAll();
    expect(logic.getState().expandedKeys).toEqual([]);
    expect(onExpand).not.toHaveBeenCalled();
  });
});

describe('createTreeLogic - 勾选（父子联动）', () => {
  it('勾选父级级联勾选全部非禁用后代', () => {
    const onCheck = vi.fn();
    const logic = createTreeLogic({ data, checkable: true, onCheck });
    logic.toggleCheck('a');
    // 禁用节点 a-2-2 不参与级联
    expect(logic.getState().checkedKeys).toEqual(['a', 'a-1', 'a-2', 'a-2-1']);
    expect(onCheck).toHaveBeenCalledWith(['a', 'a-1', 'a-2', 'a-2-1'], {
      key: 'a',
      checked: true,
    });
  });

  it('取消已全选父级级联移除全部后代勾选', () => {
    const logic = createTreeLogic({
      data,
      checkable: true,
      defaultCheckedKeys: ['a', 'a-1', 'a-2', 'a-2-1', 'a-2-2'],
    });
    logic.toggleCheck('a');
    expect(logic.getState().checkedKeys).toEqual([]);
  });

  it('半选父级点击勾选全部非禁用后代（antd 惯例）', () => {
    const logic = createTreeLogic({ data, checkable: true, defaultCheckedKeys: ['a-1'] });
    logic.toggleCheck('a');
    expect(logic.getState().checkedKeys).toEqual(['a-1', 'a', 'a-2', 'a-2-1']);
  });

  it('勾选叶子后父级半选，全部非禁用叶子勾选+禁用叶子勾选后父级全选', () => {
    const logic = createTreeLogic({ data, checkable: true });
    logic.toggleCheck('a-1');
    expect(logic.getCheckState('a')).toEqual({ checked: false, indeterminate: true });

    logic.toggleCheck('a-2-1');
    // 禁用叶子 a-2-2 未勾，父级仍半选
    expect(logic.getCheckState('a')).toEqual({ checked: false, indeterminate: true });

    // 手动勾选禁用叶子需通过 updateOptions 外部注入（禁用节点 toggleCheck 忽略）
    logic.updateOptions({ checkedKeys: ['a-1', 'a-2-1', 'a-2-2'] });
    expect(logic.getCheckState('a')).toEqual({ checked: true, indeterminate: false });
  });

  it('禁用节点与 disableCheckbox 节点 toggleCheck 忽略', () => {
    const onCheck = vi.fn();
    const disabledData: TreeNode[] = [
      { key: 'x', label: 'X', disabled: true },
      { key: 'y', label: 'Y', disableCheckbox: true },
    ];
    const logic = createTreeLogic({ data: disabledData, checkable: true, onCheck });
    logic.toggleCheck('x');
    logic.toggleCheck('y');
    expect(logic.getState().checkedKeys).toEqual([]);
    expect(onCheck).not.toHaveBeenCalled();
  });

  it('checkAll 勾选全部非禁用节点，uncheckAll 清空', () => {
    const logic = createTreeLogic({ data, checkable: true });
    logic.checkAll();
    expect(logic.getState().checkedKeys).toEqual(['a', 'a-1', 'a-2', 'a-2-1', 'b']);
    logic.uncheckAll();
    expect(logic.getState().checkedKeys).toEqual([]);
  });

  it('受控 checkedKeys：toggleCheck 仅回调不更新内部状态', () => {
    const onCheck = vi.fn();
    const logic = createTreeLogic({ data, checkable: true, checkedKeys: [], onCheck });
    logic.toggleCheck('b');
    expect(logic.getState().checkedKeys).toEqual([]);
    expect(onCheck).toHaveBeenCalledWith(['b'], { key: 'b', checked: true });

    logic.updateOptions({ checkedKeys: ['b'] });
    expect(logic.getState().checkedKeys).toEqual(['b']);
  });
});

describe('createTreeLogic - 勾选（checkStrictly）', () => {
  it('checkStrictly 仅切换自身不级联', () => {
    const onCheck = vi.fn();
    const logic = createTreeLogic({ data, checkable: true, checkStrictly: true, onCheck });
    logic.toggleCheck('a');
    expect(logic.getState().checkedKeys).toEqual(['a']);
    expect(onCheck).toHaveBeenCalledWith(['a'], { key: 'a', checked: true });
    // 父级状态仅看自身，不做后代推导
    expect(logic.getCheckState('a')).toEqual({ checked: true, indeterminate: false });
  });

  it('checkStrictly 模式 checkAll 勾选全部非禁用节点（含非叶子）', () => {
    const logic = createTreeLogic({ data, checkable: true, checkStrictly: true });
    logic.checkAll();
    // 禁用节点 a-2-2 被排除，其余全部勾选
    expect(logic.getState().checkedKeys).toEqual(['a', 'a-1', 'a-2', 'a-2-1', 'b']);
    logic.uncheckAll();
    expect(logic.getState().checkedKeys).toEqual([]);
  });
});

describe('createTreeLogic - 选中', () => {
  it('select 更新选中并触发回调', () => {
    const onSelect = vi.fn();
    const logic = createTreeLogic({ data, onSelect });
    logic.select('a-1');
    expect(logic.getState().selectedKey).toBe('a-1');
    expect(onSelect).toHaveBeenCalledWith('a-1', { key: 'a-1' });
  });

  it('禁用节点 select 忽略', () => {
    const onSelect = vi.fn();
    const logic = createTreeLogic({ data, onSelect });
    logic.select('a-2-2');
    expect(logic.getState().selectedKey).toBeNull();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('受控 selectedKey：select 仅回调不更新内部状态', () => {
    const onSelect = vi.fn();
    const logic = createTreeLogic({ data, selectedKey: null, onSelect });
    logic.select('b');
    expect(logic.getState().selectedKey).toBeNull();
    expect(onSelect).toHaveBeenCalledWith('b', { key: 'b' });

    logic.updateOptions({ selectedKey: 'b' });
    expect(logic.getState().selectedKey).toBe('b');
  });

  it('getState 返回不可变快照', () => {
    const logic = createTreeLogic({ data, defaultExpandedKeys: ['a'] });
    const snap1 = logic.getState();
    snap1.expandedKeys.push('x');
    expect(logic.getState().expandedKeys).toEqual(['a']);
  });
});
