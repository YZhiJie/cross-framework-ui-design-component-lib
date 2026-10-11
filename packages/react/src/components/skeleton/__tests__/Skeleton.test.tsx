import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../Skeleton';

describe('Skeleton (react)', () => {
  it('默认渲染骨架：3 行 + role=status', () => {
    const { container } = render(<Skeleton />);
    const root = container.querySelector('.xui-skeleton');
    expect(root).not.toBeNull();
    expect(root?.getAttribute('role')).toBe('status');
    expect(root?.getAttribute('aria-label')).toBe('加载中');
    expect(container.querySelectorAll('.xui-skeleton__row')).toHaveLength(3);
    expect(container.querySelector('.xui-skeleton__avatar')).toBeNull();
  });

  it('avatar=true 渲染头像占位', () => {
    const { container } = render(<Skeleton avatar />);
    expect(container.querySelector('.xui-skeleton__avatar')).not.toBeNull();
  });

  it('rows 自定义行数，末行 is-last', () => {
    const { container } = render(<Skeleton rows={5} />);
    const rows = container.querySelectorAll('.xui-skeleton__row');
    expect(rows).toHaveLength(5);
    expect(rows[4].className).toContain('is-last');
    expect(rows[0].className).not.toContain('is-last');
  });

  it('rows 非法值回退 3 行', () => {
    const { container } = render(<Skeleton rows={0} />);
    expect(container.querySelectorAll('.xui-skeleton__row')).toHaveLength(3);
  });

  it('loading=false 渲染 children 真实内容', () => {
    const { container } = render(
      <Skeleton loading={false}>
        <p>真实内容</p>
      </Skeleton>,
    );
    expect(container.querySelector('.xui-skeleton')).toBeNull();
    expect(container.textContent).toBe('真实内容');
  });

  it('loading 动态切换：骨架与真实内容互换', () => {
    const { container, rerender } = render(
      <Skeleton>
        <p>真实内容</p>
      </Skeleton>,
    );
    expect(container.querySelector('.xui-skeleton')).not.toBeNull();
    rerender(
      <Skeleton loading={false}>
        <p>真实内容</p>
      </Skeleton>,
    );
    expect(container.querySelector('.xui-skeleton')).toBeNull();
    expect(container.textContent).toBe('真实内容');
    rerender(
      <Skeleton loading={true}>
        <p>真实内容</p>
      </Skeleton>,
    );
    expect(container.querySelector('.xui-skeleton')).not.toBeNull();
  });

  it('骨架占位元素 aria-hidden', () => {
    const { container } = render(<Skeleton avatar />);
    expect(container.querySelector('.xui-skeleton__avatar')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(container.querySelector('.xui-skeleton__rows')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('passes className / style to root element', () => {
    const { container } = render(<Skeleton className="my-x" style={{ color: 'red' }} />);
    const root = container.querySelector('.xui-skeleton') as HTMLElement;
    expect(root).toHaveClass('my-x');
    expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
