import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Pagination } from '../Pagination';

const getButton = (container: HTMLElement, text: string) =>
  Array.from(container.querySelectorAll('button')).find((node) => node.textContent === text)!;

describe('Pagination (react)', () => {
  it('渲染页码按钮与当前页高亮（aria-current）', () => {
    const { container } = render(<Pagination total={95} defaultValue={2} />);
    // pageCount=10：序列为 [1,2,3,4,5,'···',10]，数字按钮 6 个
    expect(container.querySelectorAll('.xui-pagination__page')).toHaveLength(6);
    const current = getButton(container, '2');
    expect(current.classList.contains('is-active')).toBe(true);
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('点击页码触发 onChange 并高亮（非受控）', () => {
    const onChange = vi.fn();
    const { container } = render(<Pagination total={95} onChange={onChange} />);
    fireEvent.click(getButton(container, '5'));
    expect(onChange).toHaveBeenCalledWith(5);
    expect(getButton(container, '5').classList.contains('is-active')).toBe(true);
  });

  it('prev / next 按钮在边界禁用，中间可用', () => {
    const onChange = vi.fn();
    const { container } = render(<Pagination total={25} onChange={onChange} />);
    const buttons = container.querySelectorAll('button');
    const prev = buttons[0];
    const next = buttons[buttons.length - 1];
    expect(prev.disabled).toBe(true);
    fireEvent.click(next);
    expect(onChange).toHaveBeenCalledWith(2);
    expect(prev.disabled).toBe(false);
  });

  it('总页数超过 7 时渲染省略号占位', () => {
    const { container } = render(<Pagination total={200} defaultValue={10} />);
    expect(container.querySelectorAll('.xui-pagination__ellipsis')).toHaveLength(2);
  });

  it('受控模式：value 变更驱动当前页', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<Pagination total={95} value={1} onChange={onChange} />);
    fireEvent.click(getButton(container, '4'));
    expect(onChange).toHaveBeenCalledWith(4);
    expect(getButton(container, '1').classList.contains('is-active')).toBe(true);
    rerender(<Pagination total={95} value={4} onChange={onChange} />);
    expect(getButton(container, '4').classList.contains('is-active')).toBe(true);
  });

  it('disabled 时全部按钮禁用且点击不触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Pagination total={95} disabled onChange={onChange} />);
    expect(container.querySelector('.xui-pagination')?.classList.contains('is-disabled')).toBe(
      true,
    );
    fireEvent.click(getButton(container, '5'));
    expect(onChange).not.toHaveBeenCalled();
    expect(
      Array.from(container.querySelectorAll('button')).every((button) => button.disabled),
    ).toBe(true);
  });

  it('total/pageSize 变更重算页数', () => {
    const { container, rerender } = render(<Pagination total={95} />);
    expect(container.querySelectorAll('.xui-pagination__page')).toHaveLength(6);
    rerender(<Pagination total={95} pageSize={50} />);
    expect(container.querySelectorAll('.xui-pagination__page')).toHaveLength(2);
  });

  it('renderPrevIcon / renderNextIcon 自定义翻页图标，不渲染内置 svg', () => {
    const { container } = render(
      <Pagination
        total={95}
        renderPrevIcon={() => <i className="custom-prev" />}
        renderNextIcon={() => <i className="custom-next" />}
      />,
    );
    const buttons = container.querySelectorAll('.xui-pagination__nav');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].querySelector('.custom-prev')).not.toBeNull();
    expect(buttons[1].querySelector('.custom-next')).not.toBeNull();
    expect(buttons[0].querySelector('svg')).toBeNull();
    expect(buttons[1].querySelector('svg')).toBeNull();
  });

  it('passes className / style to root element', () => {
    const { container } = render(
      <Pagination total={95} className="my-x" style={{ color: 'red' }} />,
    );
    const root = container.querySelector('.xui-pagination') as HTMLElement;
    expect(root).toHaveClass('my-x');
    expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
