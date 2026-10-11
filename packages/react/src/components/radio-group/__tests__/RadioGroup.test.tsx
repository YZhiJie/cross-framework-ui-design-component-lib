import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { RadioGroup } from '../RadioGroup';
import { Radio } from '../../radio/Radio';

const options = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c', disabled: true },
];

const queryInputs = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('input[type="radio"]')) as HTMLInputElement[];

describe('RadioGroup (react)', () => {
  it('渲染 role="radiogroup" 与 options 选项', () => {
    const { container } = render(<RadioGroup options={options} />);
    const group = container.firstElementChild as HTMLElement;
    expect(group.className).toContain('xui-radio-group');
    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(queryInputs(container)).toHaveLength(3);
    expect(group.textContent).toContain('A');
  });

  it('defaultValue 提供非受控初始选中', () => {
    const { container } = render(<RadioGroup options={options} defaultValue="b" />);
    expect(queryInputs(container)[1].checked).toBe(true);
  });

  it('非受控模式：点击选项触发 onChange 并互斥切换', () => {
    const onChange = vi.fn();
    const { container } = render(<RadioGroup options={options.slice(0, 2)} onChange={onChange} />);
    const inputs = queryInputs(container);
    fireEvent.click(inputs[1]);
    expect(onChange).toHaveBeenCalledWith('b');
    expect(inputs[1].checked).toBe(true);
    expect(inputs[0].checked).toBe(false);
  });

  it('受控模式：value 驱动选中态，外部未回写时视觉回退', () => {
    const onChange = vi.fn();
    const { container } = render(<RadioGroup options={options.slice(0, 2)} value="a" onChange={onChange} />);
    const inputs = queryInputs(container);
    expect(inputs[0].checked).toBe(true);

    fireEvent.click(inputs[1]);
    expect(onChange).toHaveBeenCalledWith('b');
    expect(inputs[1].checked).toBe(false);
    expect(inputs[0].checked).toBe(true);
  });

  it('受控模式：value 更新驱动选中切换', () => {
    const { container, rerender } = render(
      <RadioGroup options={options.slice(0, 2)} value="a" />,
    );
    expect(queryInputs(container)[0].checked).toBe(true);

    rerender(<RadioGroup options={options.slice(0, 2)} value="b" />);
    expect(queryInputs(container)[1].checked).toBe(true);
  });

  it('disabled 整组禁用：点击不触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioGroup options={options.slice(0, 2)} disabled onChange={onChange} />,
    );
    fireEvent.click(queryInputs(container)[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('options 中的单项 disabled 透传', () => {
    const { container } = render(<RadioGroup options={options} />);
    const inputs = queryInputs(container);
    expect(inputs[2].disabled).toBe(true);
    expect(inputs[0].disabled).toBe(false);
  });

  it('children 渲染 Radio 子项并触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioGroup onChange={onChange}>
        <Radio value="x">X</Radio>
        <Radio value="y">Y</Radio>
      </RadioGroup>,
    );
    expect(queryInputs(container)).toHaveLength(2);
    fireEvent.click(queryInputs(container)[0]);
    expect(onChange).toHaveBeenCalledWith('x');
  });
});
