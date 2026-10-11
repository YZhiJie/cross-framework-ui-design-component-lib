import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { InputNumber } from '../InputNumber';

describe('InputNumber (react)', () => {
  it('渲染 spinbutton + 上下步进按钮，空值无 aria-valuenow', () => {
    const { container } = render(<InputNumber />);
    const input = container.querySelector('input');
    expect(input?.getAttribute('role')).toBe('spinbutton');
    expect(input?.getAttribute('aria-valuenow')).toBeNull();
    expect(container.querySelectorAll('.xui-input-number__btn')).toHaveLength(2);
  });

  it('defaultValue 显示初始值', () => {
    const { container } = render(<InputNumber defaultValue={5} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('5');
    expect(input.getAttribute('aria-valuenow')).toBe('5');
  });

  it('输入合法数字提交（blur）：onChange 载荷 + 显示对齐', () => {
    const onChange = vi.fn();
    const { container } = render(<InputNumber onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '42' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(42);
    expect(input.value).toBe('42');
  });

  it('非法输入提交回退 null（显示清空）', () => {
    const onChange = vi.fn();
    const { container } = render(<InputNumber defaultValue={5} onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(null);
    expect(input.value).toBe('');
  });

  it('清空提交 onChange(null)', () => {
    const onChange = vi.fn();
    const { container } = render(<InputNumber defaultValue={5} onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('上按钮步进 + onChange 事件', () => {
    const onChange = vi.fn();
    const { container } = render(<InputNumber defaultValue={5} onChange={onChange} />);
    fireEvent.click(container.querySelectorAll('.xui-input-number__btn')[0]);
    expect(onChange).toHaveBeenCalledWith(6);
    expect((container.querySelector('input') as HTMLInputElement).value).toBe('6');
  });

  it('键盘 ArrowUp / ArrowDown 步进', () => {
    const onChange = vi.fn();
    const { container } = render(<InputNumber defaultValue={5} onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenNthCalledWith(1, 6);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenNthCalledWith(2, 5);
  });

  it('越界 clamp：到边界后重复步进不再触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<InputNumber defaultValue={9} max={10} onChange={onChange} />);
    const up = container.querySelectorAll('.xui-input-number__btn')[0];
    fireEvent.click(up);
    expect(onChange).toHaveBeenCalledTimes(1);
    fireEvent.click(up);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((container.querySelector('input') as HTMLInputElement).value).toBe('10');
  });

  it('precision 显示固定小数位', () => {
    const onChange = vi.fn();
    const { container } = render(<InputNumber precision={2} onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '3.1' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(3.1);
    expect(input.value).toBe('3.10');
  });

  it('disabled：输入与按钮禁用，步进无效', () => {
    const onChange = vi.fn();
    const { container } = render(<InputNumber defaultValue={5} disabled onChange={onChange} />);
    expect(container.querySelector('.xui-input-number')?.className).toContain('is-disabled');
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    fireEvent.click(container.querySelectorAll('.xui-input-number__btn')[0]);
    expect(onChange).not.toHaveBeenCalled();
    expect(input.value).toBe('5');
  });

  it('受控模式：提交仅回调，props 更新驱动显示', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<InputNumber value={5} onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(7);
    expect(input.value).toBe('5');
    rerender(<InputNumber value={7} onChange={onChange} />);
    expect(input.value).toBe('7');
  });

  it('placeholder 生效', () => {
    const { container } = render(<InputNumber placeholder="请输入数量" />);
    expect((container.querySelector('input') as HTMLInputElement).placeholder).toBe('请输入数量');
  });
});
