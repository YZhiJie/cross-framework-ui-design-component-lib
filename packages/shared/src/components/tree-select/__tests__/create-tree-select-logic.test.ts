// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { createTreeSelectLogic } from '../create-tree-select-logic';
import type { TreeNode } from '../../tree/create-tree-logic';

const tree: TreeNode[] = [
  {
    key: '1',
    label: '节点 1',
    children: [
      { key: '1-1', label: '节点 1-1' },
      {
        key: '1-2',
        label: '节点 1-2',
        children: [
          { key: '1-2-1', label: '节点 1-2-1' },
          { key: '1-2-2', label: '节点 1-2-2', disabled: true },
        ],
      },
    ],
  },
  { key: '2', label: '节点 2', disabled: true },
  { key: '3', label: '节点 3' },
];

describe('createTreeSelectLogic（单选）', () => {
  it('初始状态正确（value 镜像 selectedKey）', () => {
    const logic = createTreeSelectLogic({ treeData: tree, defaultValue: '3' });
    expect(logic.getState()).toMatchObject({
      value: '3',
      open: false,
      selectedKey: '3',
      checkedKeys: [],
      disabled: false,
    });
  });

  it('defaultExpandAll 展开全部非叶子节点', () => {
    const logic = createTreeSelectLogic({ treeData: tree, defaultExpandAll: true });
    expect(logic.getState().expandedKeys).toEqual(['1', '1-2']);
  });

  it('selectNode 选中节点并收起面板，触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createTreeSelectLogic({ treeData: tree, onChange });

    logic.toggleOpen();
    expect(logic.getState().open).toBe(true);

    logic.selectNode('1-1');
    expect(logic.getState()).toMatchObject({ value: '1-1', selectedKey: '1-1', open: false });
    expect(onChange).toHaveBeenCalledWith('1-1');
  });

  it('selectNode 禁用节点 no-op', () => {
    const onChange = vi.fn();
    const logic = createTreeSelectLogic({ treeData: tree, onChange });
    logic.selectNode('2');
    expect(onChange).not.toHaveBeenCalled();
    expect(logic.getState().selectedKey).toBeNull();
  });

  it('受控模式：selectNode 不写内部值，仅回调', () => {
    const onChange = vi.fn();
    const logic = createTreeSelectLogic({ treeData: tree, value: '3', onChange });
    logic.selectNode('1-1');
    expect(logic.getState().selectedKey).toBe('3');
    expect(onChange).toHaveBeenCalledWith('1-1');
  });

  it('受控值经 updateOptions 同步', () => {
    const logic = createTreeSelectLogic({ treeData: tree, value: '3' });
    logic.updateOptions({ value: '1-1' });
    expect(logic.getState().value).toBe('1-1');
  });

  it("clear 清空选中并触发 onChange('') 与 onClear", () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    const logic = createTreeSelectLogic({ treeData: tree, defaultValue: '3', onChange, onClear });

    logic.clear();
    expect(logic.getState().selectedKey).toBeNull();
    expect(onChange).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledOnce();

    // 未选中时 clear no-op
    onChange.mockClear();
    logic.clear();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('运行时禁用收起已开面板', () => {
    const logic = createTreeSelectLogic({ treeData: tree });
    logic.toggleOpen();
    expect(logic.getState().open).toBe(true);
    logic.updateOptions({ disabled: true });
    expect(logic.getState().open).toBe(false);
  });

  it('toggleExpand 切换展开（叶子与 disabled 忽略）', () => {
    const logic = createTreeSelectLogic({ treeData: tree });
    logic.toggleExpand('1');
    expect(logic.isExpanded('1')).toBe(true);
    logic.toggleExpand('1');
    expect(logic.isExpanded('1')).toBe(false);
    logic.toggleExpand('3');
    expect(logic.isExpanded('3')).toBe(false);
  });
});

describe('createTreeSelectLogic（多选）', () => {
  it('初始状态正确（value 镜像 checkedKeys）', () => {
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true, defaultValue: ['3'] });
    expect(logic.getState()).toMatchObject({
      value: ['3'],
      selectedKey: null,
      checkedKeys: ['3'],
    });
  });

  it('toggleCheck 勾选叶子并保持面板展开', () => {
    const onChange = vi.fn();
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true, onChange });

    logic.toggleOpen();
    logic.toggleCheck('1-1');
    expect(logic.getState()).toMatchObject({ value: ['1-1'], open: true });
    expect(onChange).toHaveBeenCalledWith(['1-1']);
  });

  it('toggleCheck 勾选父级级联全部非禁用后代（禁用后代被跳过）', () => {
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true });
    logic.toggleCheck('1');
    expect(logic.getState().checkedKeys).toEqual(['1', '1-1', '1-2', '1-2-1']);
  });

  it('toggleCheck 取消父级移除全部后代勾选（无禁用后代时）', () => {
    const cleanTree: TreeNode[] = [
      {
        key: 'p',
        label: '父节点',
        children: [
          { key: 'a', label: '子 A' },
          { key: 'b', label: '子 B' },
        ],
      },
    ];
    const logic = createTreeSelectLogic({ treeData: cleanTree, multiple: true });
    logic.toggleCheck('p');
    expect(logic.getState().checkedKeys).toEqual(['p', 'a', 'b']);
    logic.toggleCheck('p');
    expect(logic.getState().checkedKeys).toEqual([]);
  });

  it('含禁用后代的半选父级：再次点击仅补齐勾选，取消走叶子（对齐 Tree 口径）', () => {
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true });
    logic.toggleCheck('1');
    expect(logic.getState().checkedKeys).toEqual(['1', '1-1', '1-2', '1-2-1']);
    // 禁用后代 1-2-2 计入推导分母但不参与级联，父级 1 呈半选而非全选
    logic.toggleCheck('1');
    expect(logic.getState().checkedKeys).toEqual(['1', '1-1', '1-2', '1-2-1']);
    // 通过叶子勾选取消（父级 key 保留，推导态降为半选，与 Tree 一致）
    logic.toggleCheck('1-1');
    expect(logic.getState().checkedKeys).toEqual(['1', '1-2', '1-2-1']);
  });

  it('父级勾选态由后代叶子推导（含禁用叶子分母）', () => {
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true });
    logic.toggleCheck('1-2-1');
    // 1-2 的后代叶子为 1-2-1 与禁用的 1-2-2，仅勾一个 → 半选
    expect(logic.getCheckState('1-2')).toEqual({ checked: false, indeterminate: true });
    expect(logic.getCheckState('1')).toEqual({ checked: false, indeterminate: true });
  });

  it('checkStrictly 勾选父子独立', () => {
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true, checkStrictly: true });
    logic.toggleCheck('1');
    expect(logic.getState().checkedKeys).toEqual(['1']);
    expect(logic.getCheckState('1-1')).toEqual({ checked: false, indeterminate: false });
  });

  it('disableCheckbox / disabled / 整体禁用节点勾选 no-op', () => {
    const onChange = vi.fn();
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true, onChange });
    logic.toggleCheck('2');
    expect(onChange).not.toHaveBeenCalled();
    logic.updateOptions({ disabled: true });
    logic.toggleCheck('1');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('removeTag 语义：勾选已选叶子即取消', () => {
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true, defaultValue: ['1-1'] });
    logic.toggleCheck('1-1');
    expect(logic.getState().checkedKeys).toEqual([]);
  });

  it('受控模式：toggleCheck 不写内部值，仅回调', () => {
    const onChange = vi.fn();
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true, value: [], onChange });
    logic.toggleCheck('1-1');
    expect(logic.getState().checkedKeys).toEqual([]);
    expect(onChange).toHaveBeenCalledWith(['1-1']);
  });

  it('clear 清空全部并触发 onChange([]) 与 onClear', () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    const logic = createTreeSelectLogic({
      treeData: tree,
      multiple: true,
      defaultValue: ['3'],
      onChange,
      onClear,
    });

    logic.clear();
    expect(logic.getState().checkedKeys).toEqual([]);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('运行时禁用收起已开面板', () => {
    const logic = createTreeSelectLogic({ treeData: tree, multiple: true });
    logic.toggleOpen();
    logic.updateOptions({ disabled: true });
    expect(logic.getState().open).toBe(false);
  });
});
