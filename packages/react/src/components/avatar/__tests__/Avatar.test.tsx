import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar (react)', () => {
  it('默认渲染图标与尺寸/形状类名', () => {
    const { container } = render(<Avatar />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('xui-avatar');
    expect(root.className).toContain('xui-avatar--md');
    expect(root.className).toContain('xui-avatar--circle');
    expect(container.querySelector('svg.xui-avatar__icon')).not.toBeNull();
  });

  it('children 渲染自定义内容', () => {
    const { container } = render(<Avatar>X</Avatar>);
    expect(container.querySelector('.xui-avatar__inner')?.textContent).toBe('X');
    expect(container.querySelector('svg.xui-avatar__icon')).toBeNull();
  });

  it('src 渲染图片与 alt', () => {
    const { container } = render(<Avatar src="a.png" alt="头像" />);
    const img = container.querySelector('img.xui-avatar__img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('a.png');
    expect(img.getAttribute('alt')).toBe('头像');
  });

  it('图片加载失败回退默认图标并触发 onError', () => {
    const onError = vi.fn();
    const { container } = render(<Avatar src="broken.png" onError={onError} />);
    fireEvent.error(container.querySelector('img') as HTMLImageElement);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg.xui-avatar__icon')).not.toBeNull();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('失败后更换 src 重置失败态（新图可重试）', () => {
    const { container, rerender } = render(<Avatar src="broken.png" />);
    fireEvent.error(container.querySelector('img') as HTMLImageElement);
    expect(container.querySelector('img')).toBeNull();

    rerender(<Avatar src="fixed.png" />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('fixed.png');
  });

  it('square 形状与尺寸类名', () => {
    const { container } = render(<Avatar size="lg" shape="square" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('xui-avatar--lg');
    expect(root.className).toContain('xui-avatar--square');
  });

  it('passes className / style to root element', () => {
    const { container } = render(<Avatar className="my-x" style={{ color: 'red' }} />);
    const root = container.querySelector('.xui-avatar') as HTMLElement;
    expect(root).toHaveClass('my-x');
    expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
