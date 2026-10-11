import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Tag } from '../Tag';

describe('Tag (react)', () => {
  it('渲染内容与 BEM 类名', () => {
    const { container } = render(<Tag>标签</Tag>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('xui-tag');
    expect(el.className).toContain('xui-tag--default');
    expect(el.className).toContain('xui-tag--md');
    expect(el.textContent).toContain('标签');
  });

  it('type / size 类名正确', () => {
    const { container } = render(
      <Tag type="success" size="sm">
        ok
      </Tag>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('xui-tag--success');
    expect(el.className).toContain('xui-tag--sm');
  });

  it('closable 时渲染关闭按钮', () => {
    const { container } = render(<Tag closable>x</Tag>);
    expect(container.querySelector('.xui-tag__close')).not.toBeNull();
  });

  it('点击关闭按钮触发 onClose 并隐藏标签', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Tag closable onClose={onClose}>
        x
      </Tag>,
    );
    const close = container.querySelector('.xui-tag__close') as HTMLElement;
    fireEvent.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.xui-tag')).toBeNull();
  });

  it('非 closable 时无关闭按钮', () => {
    const { container } = render(<Tag>x</Tag>);
    expect(container.querySelector('.xui-tag__close')).toBeNull();
  });

  it('renderCloseIcon 自定义关闭图标，不渲染内置 svg', () => {
    const { container } = render(
      <Tag closable renderCloseIcon={() => <i className="custom-x" />} />,
    );
    expect(container.querySelector('.custom-x')).not.toBeNull();
    expect(container.querySelector('.xui-tag__close svg')).toBeNull();
  });

  it('passes className / style to root element', () => {
    const { container } = render(
      <Tag className="my-x" style={{ color: 'red' }}>
        x
      </Tag>,
    );
    const root = container.querySelector('.xui-tag') as HTMLElement;
    expect(root).toHaveClass('my-x');
    expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
