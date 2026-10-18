import { describe, expect, it, vi } from 'vitest';
import {
  createCascaderLogic,
  getColumnsByPath,
  getPathCheckState,
  isLeaf,
  resolvePath,
} from '../create-cascader-logic';
import type { CascaderOption } from '../create-cascader-logic';

const options: CascaderOption[] = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      {
        label: '杭州',
        value: 'hz',
        children: [
          { label: '西湖区', value: 'xh' },
          { label: '余杭区', value: 'yh' },
        ],
      },
      { label: '宁波', value: 'nb' },
    ],
  },
  {
    label: '江苏',
    value: 'js',
    children: [{ label: '南京', value: 'nj' }],
  },
];

describe('createCascaderLogic', () => {
  it('初始状态：未选中时 value 为 null', () => {
    const logic = createCascaderLogic({ options });
    expect(logic.getState()).toEqual({
      value: null,
      open: false,
      activePath: [],
      disabled: false,
    });
  });

  it('defaultValue 初始化 value 与 activePath', () => {
    const logic = createCascaderLogic({ options, defaultValue: ['zj', 'hz'] });
    expect(logic.getState().value).toEqual(['zj', 'hz']);
    expect(logic.getState().activePath).toEqual(['zj', 'hz']);
  });

  it('toggleOpen 展开时 activePath 初始化为选中值', () => {
    const logic = createCascaderLogic({ options, defaultValue: ['zj'] });
    logic.toggleOpen();
    expect(logic.getState().open).toBe(true);
    expect(logic.getState().activePath).toEqual(['zj']);
  });

  it('select 叶子节点触发 onChange 并收起面板', () => {
    const onChange = vi.fn();
    const logic = createCascaderLogic({ options, onChange });
    logic.toggleOpen();
    logic.select(0, 'zj');
    // 非叶子，不收起
    expect(logic.getState().open).toBe(true);
    expect(logic.getState().activePath).toEqual(['zj']);
    logic.select(1, 'hz');
    expect(logic.getState().open).toBe(true);
    expect(logic.getState().activePath).toEqual(['zj', 'hz']);
    logic.select(2, 'xh');
    expect(logic.getState().value).toEqual(['zj', 'hz', 'xh']);
    expect(logic.getState().open).toBe(false);
    expect(onChange).toHaveBeenCalledWith(['zj', 'hz', 'xh'], ['浙江', '杭州', '西湖区']);
  });

  it('changeOnSelect 模式下选中任意层级即触发', () => {
    const onChange = vi.fn();
    const logic = createCascaderLogic({ options, changeOnSelect: true, onChange });
    logic.toggleOpen();
    logic.select(0, 'zj');
    expect(onChange).toHaveBeenCalledWith(['zj'], ['浙江']);
    expect(logic.getState().open).toBe(false);
  });

  it('受控模式 select 不更新内部 value，仅回调', () => {
    const onChange = vi.fn();
    const logic = createCascaderLogic({ options, value: ['zj'], onChange });
    logic.toggleOpen();
    // 选到叶子：江苏 → 南京
    logic.select(0, 'js');
    logic.select(1, 'nj');
    expect(logic.getState().value).toEqual(['zj']);
    expect(onChange).toHaveBeenCalledWith(['js', 'nj'], ['江苏', '南京']);
  });

  it('clear 非受控清空 value 并触发 onClear', () => {
    const onClear = vi.fn();
    const logic = createCascaderLogic({ options, defaultValue: ['zj'], onClear });
    logic.clear();
    expect(logic.getState().value).toBeNull();
    expect(logic.getState().activePath).toEqual([]);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('select 禁用选项被忽略', () => {
    const opts: CascaderOption[] = [
      { label: 'A', value: 'a', disabled: true },
      { label: 'B', value: 'b' },
    ];
    const onChange = vi.fn();
    const logic = createCascaderLogic({ options: opts, onChange });
    logic.toggleOpen();
    logic.select(0, 'a');
    expect(onChange).not.toHaveBeenCalled();
    logic.select(0, 'b');
    expect(onChange).toHaveBeenCalledWith(['b'], ['B']);
  });

  it('多选 toggleCheck 级联：勾选父级级联勾选所有后代叶子，再次切换全部取消', () => {
    const onChange = vi.fn();
    const logic = createCascaderLogic({ options, multiple: true, onChange });
    logic.toggleCheck(['zj']);
    expect(logic.getState().value).toEqual([
      ['zj', 'hz', 'xh'],
      ['zj', 'hz', 'yh'],
      ['zj', 'nb'],
    ]);
    logic.toggleCheck(['zj']);
    expect(logic.getState().value).toEqual([]);
  });

  it('多选 checkAll / uncheckAll 全选与清空', () => {
    const logic = createCascaderLogic({ options, multiple: true });
    logic.checkAll();
    expect((logic.getState().value as string[][]).length).toBe(4);
    logic.uncheckAll();
    expect(logic.getState().value).toEqual([]);
  });

  it('disabled 时 toggleOpen 与 select 被忽略', () => {
    const logic = createCascaderLogic({ options, disabled: true });
    logic.toggleOpen();
    expect(logic.getState().open).toBe(false);
    logic.select(0, 'zj');
    expect(logic.getState().value).toBeNull();
  });
});

describe('cascader helpers', () => {
  it('isLeaf 判断叶子', () => {
    expect(isLeaf({ label: 'a', value: 'a' })).toBe(true);
    expect(isLeaf({ label: 'a', value: 'a', children: [] })).toBe(true);
    expect(isLeaf({ label: 'a', value: 'a', children: [{ label: 'b', value: 'b' }] })).toBe(false);
  });

  it('getColumnsByPath 按路径取列', () => {
    const cols = getColumnsByPath(options, ['zj']);
    expect(cols).toHaveLength(2);
    expect(cols[0].map((o) => o.value)).toEqual(['zj', 'js']);
    expect(cols[1].map((o) => o.value)).toEqual(['hz', 'nb']);

    const cols2 = getColumnsByPath(options, ['zj', 'hz']);
    expect(cols2).toHaveLength(3);
    expect(cols2[2].map((o) => o.value)).toEqual(['xh', 'yh']);

    // 路径中断
    const cols3 = getColumnsByPath(options, ['zj', 'nb']);
    expect(cols3).toHaveLength(2); // nb 是叶子，无第三列
  });

  it('resolvePath 解析值路径与文案', () => {
    expect(resolvePath(options, ['zj', 'hz', 'xh'])).toEqual({
      values: ['zj', 'hz', 'xh'],
      labels: ['浙江', '杭州', '西湖区'],
    });
    expect(resolvePath(options, ['zj', 'invalid'])).toBeNull();
  });

  it('getPathCheckState：后代叶子全部勾选 → checked', () => {
    const checked = [
      ['zj', 'hz', 'xh'],
      ['zj', 'hz', 'yh'],
      ['zj', 'nb'],
    ];
    expect(getPathCheckState(options, checked, ['zj'])).toEqual({
      checked: true,
      indeterminate: false,
    });
    expect(getPathCheckState(options, checked, ['zj', 'hz'])).toEqual({
      checked: true,
      indeterminate: false,
    });
  });

  it('getPathCheckState：部分后代勾选 → indeterminate', () => {
    const checked = [['zj', 'hz', 'xh']];
    expect(getPathCheckState(options, checked, ['zj', 'hz'])).toEqual({
      checked: false,
      indeterminate: true,
    });
    expect(getPathCheckState(options, checked, ['zj'])).toEqual({
      checked: false,
      indeterminate: true,
    });
  });

  it('getPathCheckState：无后代勾选 → 未勾选', () => {
    expect(getPathCheckState(options, [['zj', 'hz', 'xh']], ['js'])).toEqual({
      checked: false,
      indeterminate: false,
    });
    expect(getPathCheckState(options, [], ['zj'])).toEqual({
      checked: false,
      indeterminate: false,
    });
    expect(getPathCheckState(options, null, ['zj'])).toEqual({
      checked: false,
      indeterminate: false,
    });
  });

  it('getPathCheckState：叶子节点按自身路径精确匹配', () => {
    expect(getPathCheckState(options, [['zj', 'nb']], ['zj', 'nb'])).toEqual({
      checked: true,
      indeterminate: false,
    });
  });

  it('getPathCheckState：checkStrictly 仅精确匹配自身路径，无半选', () => {
    const allLeaves = [
      ['zj', 'hz', 'xh'],
      ['zj', 'hz', 'yh'],
      ['zj', 'nb'],
    ];
    // 即使后代叶子全部勾选，父级未精确勾选也不显示勾选
    expect(getPathCheckState(options, allLeaves, ['zj'], true)).toEqual({
      checked: false,
      indeterminate: false,
    });
    expect(getPathCheckState(options, [['zj']], ['zj'], true)).toEqual({
      checked: true,
      indeterminate: false,
    });
  });

  it('getPathCheckState：存在未勾选的禁用子级时父级最多半选', () => {
    const tree: CascaderOption[] = [
      {
        label: '华北',
        value: 'north',
        children: [
          { label: '北京', value: 'beijing' },
          { label: '天津', value: 'tianjin', disabled: true },
        ],
      },
    ];
    // 可用子级全部勾选、禁用子级未勾选 → 半选而非全选
    expect(getPathCheckState(tree, [['north', 'beijing']], ['north'])).toEqual({
      checked: false,
      indeterminate: true,
    });
    // 禁用子级也在勾选集中（如外部受控传入）→ 全选
    expect(
      getPathCheckState(
        tree,
        [
          ['north', 'beijing'],
          ['north', 'tianjin'],
        ],
        ['north'],
      ),
    ).toEqual({ checked: true, indeterminate: false });
    // 禁用子级不参与级联勾选：toggleCheck 只勾选可用叶子，父级保持半选
    const logic = createCascaderLogic({ options: tree, multiple: true });
    logic.toggleCheck(['north']);
    expect(logic.getState().value).toEqual([['north', 'beijing']]);
    expect(getPathCheckState(tree, logic.getState().value as string[][], ['north'])).toEqual({
      checked: false,
      indeterminate: true,
    });
  });
});
