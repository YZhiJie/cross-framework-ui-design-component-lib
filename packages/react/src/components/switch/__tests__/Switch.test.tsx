import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
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

  it('renderLoadingIcon 自定义加载图标，不渲染内置 svg', () => {
    const { container } = render(
      <Switch loading renderLoadingIcon={() => <i className="custom-loading" />} />,
    );
    expect(container.querySelector('.custom-loading')).not.toBeNull();
    expect(container.querySelector('.xui-switch__spinner')).toBeNull();
  });

  it('size 类名正确', () => {
    const { container } = render(<Switch size="sm" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('xui-switch--sm');
  });

  it('className / style 透传到根元素', () => {
    const { container } = render(<Switch className="my-x" style={{ color: 'red' }} />);
    const root = container.querySelector('.xui-switch') as HTMLElement;
    expect(root).toHaveClass('my-x', 'xui-switch');
    expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('双态文本：checkedText / uncheckedText 随状态切换渲染', () => {
    const { container } = render(<Switch checkedText="开" uncheckedText="关" />);
    const root = container.querySelector('.xui-switch') as HTMLElement;
    expect(root).toHaveClass('xui-switch--has-text');
    const textEl = () => container.querySelector('.xui-switch__text') as HTMLElement;
    expect(textEl()).toBeTruthy();
    expect(textEl()).toHaveClass('xui-switch__text--unchecked');
    expect(textEl()).toHaveTextContent('关');
    // 文本对读屏隐藏（状态由 role="switch" + aria-checked 传达）
    expect(textEl()).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(root);
    expect(textEl()).toHaveClass('xui-switch__text--checked');
    expect(textEl()).toHaveTextContent('开');
  });

  it('双态文本：超长文本提供 title 提示，空串兜底不渲染', () => {
    const { container } = render(
      <Switch checkedText="" uncheckedText="超长文本超长文本超长文本超长文本" />,
    );
    // 空串 checkedText 视为未提供，关闭态仍渲染 uncheckedText 并带 title 提示
    const textEl = container.querySelector('.xui-switch__text') as HTMLElement;
    expect(textEl).toBeTruthy();
    expect(textEl).toHaveClass('xui-switch__text--unchecked');
    expect(textEl).toHaveAttribute('title', '超长文本超长文本超长文本超长文本');

    // 仅提供 checkedText：关闭态无文本节点
    const { container: c2 } = render(<Switch checkedText="开启" />);
    expect(c2.querySelector('.xui-switch')).toHaveClass('xui-switch--has-text');
    expect(c2.querySelector('.xui-switch__text')).toBeNull();
  });

  it('不传双态文本时保持纯开关模式（无文本节点与 has-text 类）', () => {
    const { container } = render(<Switch />);
    const root = container.querySelector('.xui-switch') as HTMLElement;
    expect(root).not.toHaveClass('xui-switch--has-text');
    expect(container.querySelector('.xui-switch__text')).toBeNull();
  });
});
