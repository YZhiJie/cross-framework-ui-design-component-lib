import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Switch } from '../Switch';

describe('Switch (react)', () => {
  it('渲染 role="switch" 与默认状态', () => {
    const { container } = render(<Switch />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('role')).toBe('switch');
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.className).toContain('xui-switch');
    expect(el.className).toContain('xui-switch--md');
  });

  it('非受控模式：点击切换并触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Switch onChange={onChange} />);
    const el = container.firstElementChild as HTMLElement;
    fireEvent.click(el);
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(onChange).toHaveBeenCalledWith(true);
    fireEvent.click(el);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('受控模式：value 驱动选中态，点击仅通知', () => {
    const onChange = vi.fn();
    const { container } = render(<Switch value onChange={onChange} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(el);
    expect(onChange).toHaveBeenCalledWith(false);
    expect(el.getAttribute('aria-checked')).toBe('true');
  });

  it('defaultValue 提供非受控初始状态', () => {
    const { container } = render(<Switch defaultValue />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-checked')).toBe('true');
  });

  it('disabled 时不触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Switch disabled onChange={onChange} />);
    const el = container.firstElementChild as HTMLElement;
    fireEvent.click(el);
    expect(onChange).not.toHaveBeenCalled();
    expect(el.className).toContain('is-disabled');
  });

  it('loading 时切换被忽略并渲染 spinner', () => {
    const onChange = vi.fn();
    const { container } = render(<Switch loading onChange={onChange} />);
    const el = container.firstElementChild as HTMLElement;
    fireEvent.click(el);
    expect(onChange).not.toHaveBeenCalled();
    expect(el.className).toContain('is-loading');
    expect(el.querySelector('.xui-switch__spinner')).not.toBeNull();
  });

  it('size 类名正确', () => {
    const { container } = render(<Switch size="sm" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('xui-switch--sm');
  });
});
