import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Breadcrumb } from '../Breadcrumb';

const ITEMS = [
  { label: '首页', href: '/home' },
  { label: '列表' },
  { label: '详情' },
];

describe('Breadcrumb (react)', () => {
  it('nav + ol 结构渲染 items，默认分隔符 /', () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    expect(container.querySelector('nav')?.getAttribute('aria-label')).toBe('面包屑');
    const items = container.querySelectorAll('.xui-breadcrumb__item');
    expect(items).toHaveLength(3);
    const separators = container.querySelectorAll('.xui-breadcrumb__separator');
    expect(separators).toHaveLength(2);
    expect(separators[0].textContent).toBe('/');
    expect(separators[0].getAttribute('aria-hidden')).toBe('true');
  });

  it('末项 is-active + aria-current=page，且无分隔符', () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    const items = container.querySelectorAll('.xui-breadcrumb__item');
    expect(items[2].className).toContain('is-active');
    expect(
      items[2].querySelector('.xui-breadcrumb__label')?.getAttribute('aria-current'),
    ).toBe('page');
    expect(items[2].querySelector('.xui-breadcrumb__separator')).toBeNull();
  });

  it('href 项渲染 <a>，无 href 中间项渲染可点击 label', () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    const items = container.querySelectorAll('.xui-breadcrumb__item');
    expect(items[0].querySelector('a')?.getAttribute('href')).toBe('/home');
    expect(items[1].querySelector('a')).toBeNull();
    expect(items[1].querySelector('.xui-breadcrumb__label')).not.toBeNull();
  });

  it('点击中间可导航项触发 onItemClick（携带 item 与 index）', () => {
    const onItemClick = vi.fn();
    const { container } = render(<Breadcrumb items={ITEMS} onItemClick={onItemClick} />);
    fireEvent.click(container.querySelectorAll('.xui-breadcrumb__item')[0].querySelector('a')!);
    expect(onItemClick).toHaveBeenCalledWith(ITEMS[0], 0);
  });

  it('点击末项不触发 onItemClick', () => {
    const onItemClick = vi.fn();
    const { container } = render(<Breadcrumb items={ITEMS} onItemClick={onItemClick} />);
    fireEvent.click(
      container.querySelectorAll('.xui-breadcrumb__item')[2].querySelector('.xui-breadcrumb__label')!,
    );
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('disabled 项 is-disabled 且点击不触发', () => {
    const onItemClick = vi.fn();
    const items = [{ label: 'A', href: '/a' }, { label: 'B', disabled: true }, { label: 'C' }];
    const { container } = render(<Breadcrumb items={items} onItemClick={onItemClick} />);
    const item = container.querySelectorAll('.xui-breadcrumb__item')[1];
    expect(item.className).toContain('is-disabled');
    fireEvent.click(item.querySelector('.xui-breadcrumb__label')!);
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('separator 自定义生效', () => {
    const { container } = render(<Breadcrumb items={ITEMS} separator=">" />);
    expect(container.querySelectorAll('.xui-breadcrumb__separator')[0].textContent).toBe('>');
  });

  it('children 覆盖 items 渲染', () => {
    const { container } = render(
      <Breadcrumb items={ITEMS}>
        <span>自定义内容</span>
      </Breadcrumb>,
    );
    expect(container.querySelector('nav')?.textContent).toBe('自定义内容');
    expect(container.querySelectorAll('.xui-breadcrumb__item')).toHaveLength(0);
  });
});
