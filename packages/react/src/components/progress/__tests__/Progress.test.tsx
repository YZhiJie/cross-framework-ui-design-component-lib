import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Progress } from '../Progress';

describe('Progress (react)', () => {
  it('渲染 line 进度条与百分比文本', () => {
    const { container } = render(<Progress percent={30} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('xui-progress');
    expect(root.className).toContain('xui-progress--line');
    expect(root.getAttribute('role')).toBe('progressbar');
    expect(root.getAttribute('aria-valuenow')).toBe('30');
    expect(root.textContent).toContain('30%');
    const bar = container.querySelector('.xui-progress__bar') as HTMLElement;
    expect(bar.style.width).toBe('30%');
  });

  it('percent 越界收敛到 [0, 100]', () => {
    const { container } = render(<Progress percent={150} />);
    expect((container.firstElementChild as HTMLElement).getAttribute('aria-valuenow')).toBe('100');
  });

  it('percent 非有限数值按 0 处理', () => {
    const { container } = render(<Progress percent={Number.NaN} />);
    expect((container.firstElementChild as HTMLElement).getAttribute('aria-valuenow')).toBe('0');
  });

  it('percent 达到 100 派生 success 状态类', () => {
    const { container } = render(<Progress percent={100} />);
    expect((container.firstElementChild as HTMLElement).className).toContain('is-success');
  });

  it('显式 status 优先于派生', () => {
    const { container } = render(<Progress percent={100} status="error" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('is-error');
  });

  it('showText false 不渲染文本', () => {
    const { container } = render(<Progress percent={30} showText={false} />);
    expect(container.querySelector('.xui-progress__text')).toBeNull();
  });

  it('circle 类型渲染 SVG 圆环', () => {
    const { container } = render(<Progress percent={40} type="circle" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('xui-progress--circle');
    expect(container.querySelector('svg.xui-progress__svg')).not.toBeNull();
    const bar = container.querySelector('circle.xui-progress__bar') as SVGCircleElement;
    expect(Number(bar.getAttribute('stroke-dashoffset'))).toBeGreaterThan(0);
  });
});
