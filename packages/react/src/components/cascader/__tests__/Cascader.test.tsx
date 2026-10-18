import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Cascader } from '../Cascader';
import type { CascaderOption } from '@xui-design/core';

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

describe('Cascader (react)', () => {
  it('渲染占位文案，点击展开第一列', () => {
    const { container } = render(<Cascader options={options} />);
    expect(container.querySelector('.xui-cascader__placeholder')?.textContent).toBe('请选择');
    fireEvent.click(container.querySelector('.xui-cascader__trigger')!);
    const panel = container.querySelector('.xui-cascader__panel');
    expect(panel).not.toBeNull();
    // 第一列有两个选项
    expect(container.querySelectorAll('.xui-cascader__column')).toHaveLength(1);
    expect(
      container
        .querySelectorAll('.xui-cascader__column')[0]
        .querySelectorAll('.xui-cascader__item'),
    ).toHaveLength(2);
  });

  it('defaultValue 显示选中路径文案', () => {
    const { container } = render(<Cascader options={options} defaultValue={['zj', 'hz', 'xh']} />);
    expect(container.querySelector('.xui-cascader__value')?.textContent).toBe(
      '浙江 / 杭州 / 西湖区',
    );
  });

  it('逐级选择触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Cascader options={options} onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-cascader__trigger')!);
    // 第一列：浙江
    fireEvent.click(screen_getByText(container, '浙江'));
    // 出现第二列
    expect(container.querySelectorAll('.xui-cascader__column')).toHaveLength(2);
    // 第二列：杭州
    fireEvent.click(screen_getByText(container, '杭州'));
    expect(container.querySelectorAll('.xui-cascader__column')).toHaveLength(3);
    // 第三列：西湖区（叶子）
    fireEvent.click(screen_getByText(container, '西湖区'));
    expect(onChange).toHaveBeenCalledWith(['zj', 'hz', 'xh'], ['浙江', '杭州', '西湖区']);
    // 选中后面板收起
    expect(container.querySelector('.xui-cascader__panel')).toBeNull();
  });

  it('changeOnSelect 选中任意层级即触发', () => {
    const onChange = vi.fn();
    const { container } = render(<Cascader options={options} changeOnSelect onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-cascader__trigger')!);
    fireEvent.click(screen_getByText(container, '浙江'));
    expect(onChange).toHaveBeenCalledWith(['zj'], ['浙江']);
    expect(container.querySelector('.xui-cascader__panel')).toBeNull();
  });

  it('disabled 时点击不展开', () => {
    const { container } = render(<Cascader options={options} disabled />);
    fireEvent.click(container.querySelector('.xui-cascader__trigger')!);
    expect(container.querySelector('.xui-cascader__panel')).toBeNull();
  });

  it('clearable 时点击清除触发 onClear', () => {
    const onClear = vi.fn();
    const { container } = render(
      <Cascader options={options} defaultValue={['zj']} clearable onClear={onClear} />,
    );
    fireEvent.click(container.querySelector('.xui-cascader__clear')!);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('点击外部收起面板', () => {
    const { container } = render(
      <div>
        <Cascader options={options} />
        <button type="button" data-testid="outside">
          outside
        </button>
      </div>,
    );
    fireEvent.click(container.querySelector('.xui-cascader__trigger')!);
    expect(container.querySelector('.xui-cascader__panel')).not.toBeNull();
    fireEvent.mouseDown(container.querySelector('[data-testid="outside"]')!);
    expect(container.querySelector('.xui-cascader__panel')).toBeNull();
  });

  it('禁用选项不可点击', () => {
    const opts: CascaderOption[] = [
      { label: 'A', value: 'a', disabled: true },
      { label: 'B', value: 'b' },
    ];
    const onChange = vi.fn();
    const { container } = render(<Cascader options={opts} onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-cascader__trigger')!);
    fireEvent.click(screen_getByText(container, 'A'));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen_getByText(container, 'B'));
    expect(onChange).toHaveBeenCalledWith(['b'], ['B']);
  });

  it('多选：父级勾选态由子级推导（全选勾选 / 部分半选）', () => {
    const { container } = render(<Cascader options={options} multiple />);
    const itemsOf = (col: number) =>
      container
        .querySelectorAll('.xui-cascader__column')
        [col].querySelectorAll('.xui-cascader__item');
    const checkboxOf = (col: number, idx: number) =>
      itemsOf(col)[idx].querySelector('.xui-cascader__checkbox-inner')!;

    fireEvent.click(container.querySelector('.xui-cascader__trigger')!);
    // 逐级展开：浙江 → 杭州
    fireEvent.click(itemsOf(0)[0]);
    fireEvent.click(itemsOf(1)[0]);
    // 勾选西湖区：杭州部分子级选中 → 半选；浙江半选
    fireEvent.click(itemsOf(2)[0]);
    expect(checkboxOf(1, 0).className).toContain('is-indeterminate');
    expect(checkboxOf(0, 0).className).toContain('is-indeterminate');
    // 勾选余杭区：杭州子级全选 → 勾选；浙江仍半选（宁波未选）
    fireEvent.click(itemsOf(2)[1]);
    expect(checkboxOf(1, 0).className).toContain('is-checked');
    expect(checkboxOf(1, 0).className).not.toContain('is-indeterminate');
    expect(checkboxOf(0, 0).className).toContain('is-indeterminate');
    // 勾选宁波：浙江后代叶子全选 → 勾选
    fireEvent.click(itemsOf(1)[1]);
    expect(checkboxOf(0, 0).className).toContain('is-checked');
    expect(checkboxOf(0, 0).className).not.toContain('is-indeterminate');
  });

  it('多选：存在未勾选的禁用子级时父级显示半选而非全选', () => {
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
    const { container } = render(<Cascader options={tree} multiple />);
    fireEvent.click(container.querySelector('.xui-cascader__trigger')!);
    // 展开华北，勾选唯一可用子级北京
    fireEvent.click(
      container
        .querySelectorAll('.xui-cascader__column')[0]
        .querySelectorAll('.xui-cascader__item')[0],
    );
    fireEvent.click(
      container
        .querySelectorAll('.xui-cascader__column')[1]
        .querySelectorAll('.xui-cascader__item')[0],
    );
    const parent = container
      .querySelectorAll('.xui-cascader__column')[0]
      .querySelector('.xui-cascader__checkbox-inner')!;
    expect(parent.className).toContain('is-indeterminate');
    expect(parent.className).not.toContain('is-checked');
  });
});

// 辅助：在 container 中按文本查找元素
function screen_getByText(container: HTMLElement, text: string): HTMLElement {
  const nodes = Array.from(container.querySelectorAll('*'));
  const target = nodes.find(
    (node) => node.textContent === text && node.querySelector('*') === null,
  );
  if (!target) throw new Error(`not found: ${text}`);
  return target as HTMLElement;
}
