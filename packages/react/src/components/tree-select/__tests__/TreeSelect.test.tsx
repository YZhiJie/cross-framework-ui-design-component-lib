import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { TreeSelect } from '../TreeSelect';
import type { TreeNode } from '@xui-design/core';

const treeData: TreeNode[] = [
  {
    key: '1',
    label: '节点 1',
    children: [
      { key: '1-1', label: '节点 1-1' },
      {
        key: '1-2',
        label: '节点 1-2',
        children: [{ key: '1-2-1', label: '节点 1-2-1' }],
      },
    ],
  },
  { key: '2', label: '节点 2', disabled: true },
  { key: '3', label: '节点 3' },
];

describe('TreeSelect (react)', () => {
  it('渲染占位文案，点击展开面板并渲染树节点', () => {
    const { container } = render(<TreeSelect treeData={treeData} />);
    expect(container.querySelector('.xui-tree-select__placeholder')?.textContent).toBe('请选择');
    fireEvent.click(container.querySelector('.xui-tree-select__trigger')!);
    expect(container.querySelector('.xui-tree-select__panel')).not.toBeNull();
    expect(container.querySelectorAll('.xui-tree-select__node')).toHaveLength(3);
  });

  it('defaultValue 显示选中节点文案', () => {
    const { container } = render(<TreeSelect treeData={treeData} defaultValue="3" />);
    expect(container.querySelector('.xui-tree-select__value')?.textContent).toBe('节点 3');
  });

  it('单选：展开后点击叶子选中并收起面板，触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<TreeSelect treeData={treeData} onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-tree-select__trigger')!);
    // 展开节点 1
    fireEvent.click(container.querySelector('.xui-tree-select__switcher')!);
    const titles = Array.from(container.querySelectorAll('.xui-tree-select__title'));
    fireEvent.click(titles[1]!); // 节点 1-1
    expect(onChange).toHaveBeenCalledWith('1-1');
    expect(container.querySelector('.xui-tree-select__panel')).toBeNull();
    expect(container.querySelector('.xui-tree-select__value')?.textContent).toBe('节点 1-1');
  });

  it('defaultExpandAll 展开全部节点', () => {
    const { container } = render(<TreeSelect treeData={treeData} defaultExpandAll />);
    fireEvent.click(container.querySelector('.xui-tree-select__trigger')!);
    expect(container.querySelectorAll('.xui-tree-select__node')).toHaveLength(6);
  });

  it('disabled 节点不可选中；disabled 时点击不展开', () => {
    const onChange = vi.fn();
    const { container } = render(
      <TreeSelect treeData={treeData} defaultExpandAll onChange={onChange} />,
    );
    fireEvent.click(container.querySelector('.xui-tree-select__trigger')!);
    // 展开顺序：节点1, 1-1, 1-2, 1-2-1, 节点2(disabled), 节点3
    const titles = Array.from(container.querySelectorAll('.xui-tree-select__title'));
    fireEvent.click(titles[4]!); // 节点 2（disabled）
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector('.xui-tree-select__panel')).not.toBeNull();

    const disabled = render(<TreeSelect treeData={treeData} disabled />);
    fireEvent.click(disabled.container.querySelector('.xui-tree-select__trigger')!);
    expect(disabled.container.querySelector('.xui-tree-select__panel')).toBeNull();
  });

  it('多选：勾选父级级联后代并渲染标签', () => {
    const onChange = vi.fn();
    const { container } = render(<TreeSelect treeData={treeData} multiple onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-tree-select__trigger')!);
    fireEvent.click(container.querySelector('.xui-tree-select__switcher')!);
    fireEvent.click(container.querySelector('.xui-tree-select__checkbox')!);
    expect(onChange).toHaveBeenCalledWith(['1', '1-1', '1-2', '1-2-1']);
    const tags = container.querySelectorAll('.xui-tree-select__tag');
    expect(tags).toHaveLength(4);
    expect(tags[0]?.textContent).toContain('节点 1');
  });

  it('多选：面板保持展开，移除标签回调 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(
      <TreeSelect treeData={treeData} multiple defaultValue={['3']} onChange={onChange} />,
    );
    fireEvent.click(container.querySelector('.xui-tree-select__trigger')!);
    expect(container.querySelector('.xui-tree-select__panel')).not.toBeNull();
    fireEvent.click(container.querySelector('.xui-tree-select__tag-close')!);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(container.querySelectorAll('.xui-tree-select__tag')).toHaveLength(0);
  });

  it("clearable 清空触发 onClear 与 onChange('')", () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        defaultValue="3"
        clearable
        onChange={onChange}
        onClear={onClear}
      />,
    );
    fireEvent.click(container.querySelector('.xui-tree-select__clear')!);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('');
    expect(container.querySelector('.xui-tree-select__value')).toBeNull();
  });

  it('受控 value 变更同步展示', () => {
    const { container, rerender } = render(<TreeSelect treeData={treeData} value="3" />);
    expect(container.querySelector('.xui-tree-select__value')?.textContent).toBe('节点 3');
    rerender(<TreeSelect treeData={treeData} value="1-1" />);
    expect(container.querySelector('.xui-tree-select__value')?.textContent).toBe('节点 1-1');
  });

  it('暴露 focus / toggleOpen / close 命令式 API', () => {
    let refObj: { toggleOpen: () => void; close: () => void } | null = null;
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        ref={(instance) => {
          refObj = instance as { toggleOpen: () => void; close: () => void };
        }}
      />,
    );
    act(() => {
      refObj!.toggleOpen();
    });
    expect(container.querySelector('.xui-tree-select__panel')).not.toBeNull();
    act(() => {
      refObj!.close();
    });
    expect(container.querySelector('.xui-tree-select__panel')).toBeNull();
  });
});
