import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Checkbox } from '../Checkbox';

describe('Checkbox (react)', () => {
  it('渲染结构与默认状态', () => {
    const { container } = render(<Checkbox>同意协议</Checkbox>);
    const label = container.firstElementChild as HTMLElement;
    expect(label.className).toContain('xui-checkbox');
    expect(container.querySelector('input[type="checkbox"]')).not.toBeNull();
    expect(label.textContent).toContain('同意协议');
  });

  it('非受控模式：点击切换并触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Checkbox onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.click(input);
    expect(input.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('受控模式：value 驱动选中态，点击仅通知', () => {
    const onChange = vi.fn();
    const { container } = render(<Checkbox value onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledWith(false);
    expect(input.checked).toBe(true);
  });

  it('defaultValue 提供非受控初始状态', () => {
    const { container } = render(<Checkbox defaultValue />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('indeterminate 同步原生 DOM 属性', () => {
    const { container } = render(<Checkbox indeterminate />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    const label = container.firstElementChild as HTMLElement;
    expect(label.className).toContain('is-indeterminate');
  });

  it('disabled 时不触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Checkbox disabled onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.click(input);
    expect(onChange).not.toHaveBeenCalled();
    expect((container.firstElementChild as HTMLElement).className).toContain('is-disabled');
  });

  it('className / style 透传到根元素', () => {
    const { container } = render(<Checkbox className="my-x" style={{ color: 'red' }} />);
    const root = container.querySelector('.xui-checkbox') as HTMLElement;
    expect(root).toHaveClass('my-x', 'xui-checkbox');
    expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
