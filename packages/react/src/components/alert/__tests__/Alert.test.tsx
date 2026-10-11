import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Alert } from '../Alert';

describe('Alert (react)', () => {
  it('渲染 title / description 与 BEM 类名', () => {
    const { container } = render(<Alert title="提示" description="内容详情" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('xui-alert');
    expect(el.className).toContain('xui-alert--info');
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.querySelector('.xui-alert__title')!.textContent).toBe('提示');
    expect(el.querySelector('.xui-alert__description')!.textContent).toBe('内容详情');
  });

  it('children 覆盖 description', () => {
    const { container } = render(
      <Alert title="t" description="prop">
        children 描述
      </Alert>,
    );
    expect(container.querySelector('.xui-alert__description')!.textContent).toBe('children 描述');
  });

  it('renderTitle 覆盖 title', () => {
    const { container } = render(
      <Alert title="prop 标题" renderTitle={() => <b>render 标题</b>} />,
    );
    expect(container.querySelector('.xui-alert__title')!.textContent).toBe('render 标题');
  });

  it('type 类名正确', () => {
    const { container } = render(<Alert type="warning" title="w" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('xui-alert--warning');
  });

  it('showIcon 时渲染默认图标，renderIcon 覆盖', () => {
    const { container, rerender } = render(<Alert showIcon title="x" />);
    expect(container.querySelector('.xui-alert__icon svg')).not.toBeNull();
    rerender(<Alert showIcon title="x" renderIcon={() => <b className="custom-icon">!</b>} />);
    expect(container.querySelector('.custom-icon')).not.toBeNull();
  });

  it('closable 时点击关闭按钮触发 onClose 并隐藏', () => {
    const onClose = vi.fn();
    const { container } = render(<Alert closable title="x" onClose={onClose} />);
    const close = container.querySelector('.xui-alert__close') as HTMLElement;
    fireEvent.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.xui-alert')).toBeNull();
  });

  it('非 closable 时不渲染关闭按钮', () => {
    const { container } = render(<Alert title="x" />);
    expect(container.querySelector('.xui-alert__close')).toBeNull();
  });

  it('renderCloseIcon 自定义关闭图标，不渲染内置 svg', () => {
    const { container } = render(
      <Alert closable title="x" renderCloseIcon={() => <i className="custom-x" />} />,
    );
    expect(container.querySelector('.custom-x')).not.toBeNull();
    expect(container.querySelector('.xui-alert__close svg')).toBeNull();
  });

  it('passes className / style to root element', () => {
    const { container } = render(<Alert className="my-x" style={{ color: 'red' }} />);
    const root = container.querySelector('.xui-alert') as HTMLElement;
    expect(root).toHaveClass('my-x');
    expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
