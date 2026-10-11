import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Empty } from '../Empty';

describe('Empty (react)', () => {
  it('渲染默认插画', () => {
    const { container } = render(<Empty />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('xui-empty');
    expect(container.querySelector('svg.xui-empty__svg')).not.toBeNull();
  });

  it('description 渲染描述文案', () => {
    const { container } = render(<Empty description="暂无数据" />);
    expect(container.querySelector('.xui-empty__description')?.textContent).toBe('暂无数据');
  });

  it('未提供或空白 description 不渲染描述区', () => {
    const { container } = render(<Empty />);
    expect(container.querySelector('.xui-empty__description')).toBeNull();

    const { container: blank } = render(<Empty description="   " />);
    expect(blank.querySelector('.xui-empty__description')).toBeNull();
  });

  it('renderImage 覆盖默认插画', () => {
    const { container } = render(<Empty renderImage={() => <div className="custom-img" />} />);
    expect(container.querySelector('.custom-img')).not.toBeNull();
    expect(container.querySelector('svg.xui-empty__svg')).toBeNull();
  });

  it('children 渲染底部动作区', () => {
    const { container } = render(<Empty description="暂无数据">去创建</Empty>);
    expect(container.querySelector('.xui-empty__footer')?.textContent).toContain('去创建');
  });

  it('未提供 children 时不渲染动作区', () => {
    const { container } = render(<Empty description="暂无数据" />);
    expect(container.querySelector('.xui-empty__footer')).toBeNull();
  });
});
