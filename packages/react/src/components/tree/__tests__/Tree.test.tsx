import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { Tree } from '../Tree';
import type { TreeRef } from '../Tree';
import type { TreeNode } from '@xui-design/core';

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

const titles = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.xui-tree__title')).map((el) => el.textContent);

describe('Tree (react)', () => {
  it('渲染根节点与 BEM 类名，子节点默认收起', () => {
    const { container } = render(<Tree data={data} />);
    expect(container.querySelector('.xui-tree')).toBeTruthy();
    expect(container.querySelector('[role="tree"]')).toBeTruthy();
    expect(titles(container)).toEqual(['A', 'B']);
  });

  it('点击 switcher 展开/收起子节点并触发 onExpand', () => {
    const onExpand = vi.fn();
    const { container } = render(<Tree data={data} onExpand={onExpand} />);
    const switcher = container.querySelector('.xui-tree__switcher')!;
    fireEvent.click(switcher);
    expect(titles(container)).toEqual(['A', 'A-1', 'A-2', 'B']);
    expect(onExpand).toHaveBeenCalledWith(['a'], { key: 'a', expanded: true });

    fireEvent.click(container.querySelector('.xui-tree__switcher')!);
    expect(titles(container)).toEqual(['A', 'B']);
  });

  it('defaultExpandAll 展开全部非叶子节点', () => {
    const { container } = render(<Tree data={data} defaultExpandAll />);
    expect(titles(container)).toEqual(['A', 'A-1', 'A-2', 'A-2-1', 'A-2-2', 'B']);
  });

  it('点击标题选中节点并触发 onSelect', () => {
    const onSelect = vi.fn();
    const { container } = render(<Tree data={data} onSelect={onSelect} />);
    fireEvent.click(screen_getByText(container, 'B'));
    expect(onSelect).toHaveBeenCalledWith('b', { key: 'b' });
    expect(container.querySelectorAll('.xui-tree__node')[1].classList.contains('is-selected')).toBe(
      true,
    );
  });

  it('禁用节点点击标题不触发 onSelect', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <Tree data={[{ key: 'x', label: 'X', disabled: true }]} onSelect={onSelect} />,
    );
    fireEvent.click(screen_getByText(container, 'X'));
    expect(onSelect).not.toHaveBeenCalled();
    expect(container.querySelector('.xui-tree__node')!.classList.contains('is-disabled')).toBe(
      true,
    );
  });

  it('checkable 渲染勾选框，点击父级级联勾选非禁用后代', () => {
    const onCheck = vi.fn();
    const { container } = render(<Tree data={data} checkable defaultExpandAll onCheck={onCheck} />);
    const checkboxes = container.querySelectorAll('.xui-tree__checkbox');
    expect(checkboxes.length).toBe(6);

    fireEvent.click(checkboxes[0]);
    expect(onCheck).toHaveBeenCalledWith(['a', 'a-1', 'a-2', 'a-2-1'], {
      key: 'a',
      checked: true,
    });
  });

  it('勾选部分后代父级显示半选态', () => {
    const { container } = render(
      <Tree data={data} checkable defaultExpandAll defaultCheckedKeys={['a-1']} />,
    );
    const inners = container.querySelectorAll('.xui-tree__checkbox-inner');
    expect(inners[0].classList.contains('is-indeterminate')).toBe(true);
    expect(inners[1].classList.contains('is-checked')).toBe(true);
  });

  it('受控 checkedKeys：勾选仅回调，内部状态由外部更新', () => {
    const onCheck = vi.fn();
    const { container, rerender } = render(
      <Tree data={data} checkable defaultExpandAll checkedKeys={[]} onCheck={onCheck} />,
    );
    fireEvent.click(container.querySelectorAll('.xui-tree__checkbox')[5]);
    expect(onCheck).toHaveBeenCalledWith(['b'], { key: 'b', checked: true });
    expect(container.querySelectorAll('.xui-tree__checkbox-inner.is-checked').length).toBe(0);

    rerender(<Tree data={data} checkable defaultExpandAll checkedKeys={['b']} onCheck={onCheck} />);
    const inners = container.querySelectorAll('.xui-tree__checkbox-inner');
    expect(inners[5].classList.contains('is-checked')).toBe(true);
  });

  it('受控 selectedKey', () => {
    const onSelect = vi.fn();
    const { container, rerender } = render(
      <Tree data={data} selectedKey={null} onSelect={onSelect} />,
    );
    fireEvent.click(screen_getByText(container, 'B'));
    expect(onSelect).toHaveBeenCalledWith('b', { key: 'b' });
    expect(container.querySelectorAll('.xui-tree__node.is-selected').length).toBe(0);

    rerender(<Tree data={data} selectedKey="b" onSelect={onSelect} />);
    expect(container.querySelectorAll('.xui-tree__node')[1].classList.contains('is-selected')).toBe(
      true,
    );
  });

  it('renderTitle 自定义节点渲染', () => {
    const { container } = render(
      <Tree data={data} renderTitle={(node) => <span>★{node.label}</span>} />,
    );
    expect(screen_getByText(container, '★A')).toBeTruthy();
  });

  it('ref 命令式 API：expandAll / collapseAll / checkAll / uncheckAll', () => {
    const ref = createRef<TreeRef>();
    const { container } = render(<Tree ref={ref} data={data} checkable />);

    act(() => ref.current!.expandAll());
    expect(titles(container).length).toBe(6);

    act(() => ref.current!.collapseAll());
    expect(titles(container).length).toBe(2);

    act(() => {
      ref.current!.expandAll();
      ref.current!.checkAll();
    });
    // 禁用叶子 a-2-2 不勾选 → a/a-2 半选；a-1/a-2-1/b 全选
    expect(container.querySelectorAll('.xui-tree__checkbox-inner.is-checked').length).toBe(3);
    expect(container.querySelectorAll('.xui-tree__checkbox-inner.is-indeterminate').length).toBe(2);

    act(() => ref.current!.uncheckAll());
    expect(container.querySelectorAll('.xui-tree__checkbox-inner.is-checked').length).toBe(0);
  });

  it('disabled 整棵树：switcher/checkbox/title 均不响应', () => {
    const onExpand = vi.fn();
    const onCheck = vi.fn();
    const onSelect = vi.fn();
    const { container } = render(
      <Tree
        data={data}
        checkable
        disabled
        onExpand={onExpand}
        onCheck={onCheck}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(container.querySelector('.xui-tree__switcher')!);
    expect(onExpand).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('.xui-tree__checkbox')!);
    expect(onCheck).not.toHaveBeenCalled();
    fireEvent.click(screen_getByText(container, 'A'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

// 辅助：在 container 中按文本查找元素（与 Cascader.test.tsx 同款本地约定）
function screen_getByText(container: HTMLElement, text: string): HTMLElement {
  const nodes = Array.from(container.querySelectorAll('*'));
  const target = nodes.find(
    (node) => node.textContent === text && node.querySelector('*') === null,
  );
  if (!target) throw new Error(`not found: ${text}`);
  return target as HTMLElement;
}
