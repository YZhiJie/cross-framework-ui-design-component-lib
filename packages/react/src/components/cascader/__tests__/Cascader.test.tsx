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
