import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge (react)', () => {
  it('包裹模式：渲染内容与徽标', () => {
    const { container } = render(<Badge count={5}>inbox</Badge>);
    expect(container.querySelector('.xui-badge')).not.toBeNull();
    const sup = container.querySelector('.xui-badge__sup') as HTMLElement;
    expect(sup.textContent).toContain('5');
    expect(container.textContent).toContain('inbox');
  });

  it('count 未提供时不渲染徽标', () => {
    const { container } = render(<Badge>inbox</Badge>);
    expect(container.querySelector('.xui-badge__sup')).toBeNull();
  });

  it('count 为 0 默认隐藏，showZero 开启后显示', () => {
    const { container } = render(<Badge count={0}>inbox</Badge>);
    expect(container.querySelector('.xui-badge__sup')).toBeNull();

    const { container: shown } = render(
      <Badge count={0} showZero>
        inbox
      </Badge>,
    );
    expect((shown.querySelector('.xui-badge__sup') as HTMLElement).textContent).toContain('0');
  });

  it('count 超过 max 显示 `${max}+`', () => {
    const { container } = render(<Badge count={120}>inbox</Badge>);
    expect((container.querySelector('.xui-badge__sup') as HTMLElement).textContent).toContain(
      '99+',
    );
  });

  it('dot 模式渲染点状徽标（无文本、aria-hidden）', () => {
    const { container } = render(
      <Badge count={5} dot>
        inbox
      </Badge>,
    );
    const sup = container.querySelector('.xui-badge__sup') as HTMLElement;
    expect(sup.className).toContain('is-dot');
    expect(sup.getAttribute('aria-hidden')).toBe('true');
    expect(sup.textContent).not.toContain('5');
  });

  it('独立模式渲染 standalone 徽标', () => {
    const { container } = render(<Badge count={5} />);
    const sup = container.querySelector('sup') as HTMLElement;
    expect(sup.className).toContain('xui-badge__sup');
    expect(sup.className).toContain('xui-badge__sup--standalone');
  });

  it('非法 count（NaN）不渲染徽标', () => {
    const { container } = render(<Badge count={Number.NaN}>inbox</Badge>);
    expect(container.querySelector('.xui-badge__sup')).toBeNull();
  });

  it('passes className / style to root element', () => {
    const { container } = render(
      <Badge count={5} className="my-x" style={{ color: 'red' }}>
        inbox
      </Badge>,
    );
    const root = container.querySelector('.xui-badge') as HTMLElement;
    expect(root).toHaveClass('my-x');
    expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
