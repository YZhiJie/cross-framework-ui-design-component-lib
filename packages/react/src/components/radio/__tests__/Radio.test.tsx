import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Radio } from '../Radio';
import { RadioGroup } from '../../radio-group/RadioGroup';

describe('Radio (react)', () => {
  it('渲染结构与 BEM 类名', () => {
    const { container } = render(<Radio value="x">选项</Radio>);
    const label = container.firstElementChild as HTMLElement;
    expect(label.className).toContain('xui-radio');
    expect(label.querySelector('.xui-radio__dot')).not.toBeNull();
    expect(label.textContent).toContain('选项');
  });

  it('组外渲染作兜底：点击后保持永不选中（React 受控恢复）', () => {
    const { container } = render(<Radio value="x" />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.click(input);
    expect(input.checked).toBe(false);
  });

  it('组内渲染（组合挂载）：随组值选中、点击触发组 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioGroup defaultValue="x" onChange={onChange}>
        <Radio value="x">X</Radio>
        <Radio value="y">Y</Radio>
      </RadioGroup>,
    );
    const inputs = Array.from(
      container.querySelectorAll('input[type="radio"]'),
    ) as HTMLInputElement[];
    expect(inputs[0].checked).toBe(true);
    expect(inputs[1].checked).toBe(false);

    fireEvent.click(inputs[1]);
    expect(onChange).toHaveBeenCalledWith('y');
    expect(inputs[1].checked).toBe(true);
    expect(inputs[0].checked).toBe(false);
  });

  it('disabled 渲染禁用状态且不触发组 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioGroup onChange={onChange}>
        <Radio value="x" disabled>
          X
        </Radio>
      </RadioGroup>,
    );
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    const label = container.querySelector('.xui-radio') as HTMLElement;
    expect(label.className).toContain('is-disabled');
    fireEvent.click(input);
    expect(onChange).not.toHaveBeenCalled();
  });
});
