import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Spin } from '../Spin';

describe('Spin (react)', () => {
  it('独立模式：渲染指示器与 role=status，默认 is-md', () => {
    const { container } = render(<Spin />);
    const root = container.querySelector('.xui-spin');
    expect(root).not.toBeNull();
    expect(root?.getAttribute('role')).toBe('status');
    expect(root?.getAttribute('aria-live')).toBe('polite');
    expect(root?.querySelector('.xui-spin__indicator')?.className).toContain('is-md');
    expect(root?.querySelector('.xui-spin__tip')).toBeNull();
  });

  it('tip 渲染在指示器下方', () => {
    const { container } = render(<Spin tip="加载中" />);
    expect(container.querySelector('.xui-spin__tip')?.textContent).toBe('加载中');
  });

  it('size sm / lg 类名生效', () => {
    const sm = render(<Spin size="sm" />);
    expect(sm.container.querySelector('.xui-spin__indicator')?.className).toContain('is-sm');
    sm.unmount();
    const lg = render(<Spin size="lg" />);
    expect(lg.container.querySelector('.xui-spin__indicator')?.className).toContain('is-lg');
  });

  it('包裹模式：内容渲染 + 遮罩 + 内容模糊', () => {
    const { container } = render(
      <Spin tip="加载中">
        <p>面板内容</p>
      </Spin>,
    );
    expect(container.querySelector('.xui-spin--wrapper')).not.toBeNull();
    expect(container.querySelector('.xui-spin__content')?.textContent).toBe('面板内容');
    expect(container.querySelector('.xui-spin__content')?.className).toContain('is-blur');
    expect(container.querySelector('.xui-spin__mask')).not.toBeNull();
    expect(container.querySelector('.xui-spin__mask .xui-spin__tip')?.textContent).toBe('加载中');
  });

  it('包裹模式 spinning=false：遮罩消失、内容不模糊', () => {
    const { container } = render(
      <Spin spinning={false}>
        <p>面板内容</p>
      </Spin>,
    );
    expect(container.querySelector('.xui-spin__mask')).toBeNull();
    expect(container.querySelector('.xui-spin__content')?.className).not.toContain('is-blur');
    expect(container.querySelector('.xui-spin__content')?.textContent).toBe('面板内容');
  });

  it('独立模式 spinning=false 不渲染', () => {
    const { container } = render(<Spin spinning={false} />);
    expect(container.querySelector('.xui-spin')).toBeNull();
  });

  it('spinning 动态切换：遮罩出现与消失', () => {
    const { container, rerender } = render(<Spin>content</Spin>);
    expect(container.querySelector('.xui-spin__mask')).not.toBeNull();
    rerender(<Spin spinning={false}>content</Spin>);
    expect(container.querySelector('.xui-spin__mask')).toBeNull();
    rerender(<Spin spinning={true}>content</Spin>);
    expect(container.querySelector('.xui-spin__mask')).not.toBeNull();
  });
});
