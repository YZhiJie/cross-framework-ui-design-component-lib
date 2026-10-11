import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { DatePicker } from '../DatePicker';

const findDay = (container: HTMLElement, date: string) =>
  Array.from(container.querySelectorAll<HTMLButtonElement>('.xui-date-picker__day')).find(
    (node) => node.getAttribute('aria-label') === date,
  );

describe('DatePicker (react)', () => {
  it('渲染占位文案与日历图标，点击展开面板', () => {
    const { container } = render(<DatePicker />);
    expect(container.querySelector('.xui-date-picker__placeholder')?.textContent).toBe(
      '请选择日期',
    );
    expect(container.querySelector('.xui-date-picker__panel')).toBeNull();

    fireEvent.click(container.querySelector('.xui-date-picker__trigger')!);
    const panel = container.querySelector('.xui-date-picker__panel');
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(container.querySelectorAll('.xui-date-picker__weekday')).toHaveLength(7);
    expect(container.querySelectorAll('.xui-date-picker__day')).toHaveLength(42);
  });

  it('再次点击 / Escape 收起面板', () => {
    const { container } = render(<DatePicker />);
    const trigger = container.querySelector('.xui-date-picker__trigger')!;
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(container.querySelector('.xui-date-picker__panel')).toBeNull();

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(container.querySelector('.xui-date-picker__panel')).toBeNull();
  });

  it('defaultValue 显示选中值并定位视图，选择触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<DatePicker defaultValue="2026-10-11" onChange={onChange} />);
    expect(container.querySelector('.xui-date-picker__value')?.textContent).toBe('2026-10-11');

    fireEvent.click(container.querySelector('.xui-date-picker__trigger')!);
    expect(container.querySelector('.xui-date-picker__title')?.textContent).toBe('2026 年 10 月');

    fireEvent.click(findDay(container, '2026-10-15')!);
    expect(onChange).toHaveBeenCalledWith('2026-10-15');
    expect(container.querySelector('.xui-date-picker__panel')).toBeNull();
    expect(container.querySelector('.xui-date-picker__value')?.textContent).toBe('2026-10-15');
  });

  it('今天与选中态样式标记', () => {
    const { container } = render(<DatePicker defaultValue="2026-10-11" />);
    fireEvent.click(container.querySelector('.xui-date-picker__trigger')!);
    expect(container.querySelector('.xui-date-picker__day.is-today')).not.toBeNull();
    expect(findDay(container, '2026-10-11')?.classList.contains('is-selected')).toBe(true);
  });

  it('上 / 下月切换滚动视图', () => {
    const { container } = render(<DatePicker defaultValue="2026-01-15" />);
    fireEvent.click(container.querySelector('.xui-date-picker__trigger')!);
    const navs = container.querySelectorAll('.xui-date-picker__nav');
    fireEvent.click(navs[0]);
    expect(container.querySelector('.xui-date-picker__title')?.textContent).toBe('2025 年 12 月');
    fireEvent.click(navs[1]);
    expect(container.querySelector('.xui-date-picker__title')?.textContent).toBe('2026 年 01 月');
    fireEvent.click(navs[1]);
    expect(container.querySelector('.xui-date-picker__title')?.textContent).toBe('2026 年 02 月');
  });

  it('clearable 显示清除图标并触发 onClear', () => {
    const onClear = vi.fn();
    const { container } = render(
      <DatePicker defaultValue="2026-10-11" clearable onClear={onClear} />,
    );
    const clear = container.querySelector('.xui-date-picker__clear');
    expect(clear).not.toBeNull();
    fireEvent.click(clear!);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.xui-date-picker__value')).toBeNull();
  });

  it('自定义图标回调：clear / calendar / prev / next 替换内置 svg', () => {
    // clear 与 calendar 互斥（clearable 且有值时显示 clear），分两次渲染断言
    const { container } = render(
      <DatePicker
        defaultValue="2026-10-11"
        clearable
        renderClearIcon={() => <i className="custom-clear" />}
        renderPrevIcon={() => <i className="custom-prev" />}
        renderNextIcon={() => <i className="custom-next" />}
      />,
    );
    expect(container.querySelector('.xui-date-picker__clear .custom-clear')).not.toBeNull();
    expect(container.querySelector('.xui-date-picker__clear svg')).toBeNull();

    const { container: c2 } = render(
      <DatePicker renderCalendarIcon={() => <i className="custom-calendar" />} />,
    );
    expect(c2.querySelector('.xui-date-picker__icon .custom-calendar')).not.toBeNull();
    expect(c2.querySelector('.xui-date-picker__icon svg')).toBeNull();

    fireEvent.click(container.querySelector('.xui-date-picker__trigger')!);
    const navs = container.querySelectorAll('.xui-date-picker__nav');
    expect(navs[0].querySelector('.custom-prev')).not.toBeNull();
    expect(navs[1].querySelector('.custom-next')).not.toBeNull();
    expect(navs[0].querySelector('svg')).toBeNull();
    expect(navs[1].querySelector('svg')).toBeNull();
  });

  it('受控模式：value 变更驱动显示，选择仅回调', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<DatePicker value="2026-10-11" onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-date-picker__trigger')!);
    fireEvent.click(findDay(container, '2026-10-15')!);
    expect(onChange).toHaveBeenCalledWith('2026-10-15');
    expect(container.querySelector('.xui-date-picker__value')?.textContent).toBe('2026-10-11');

    rerender(<DatePicker value="2026-11-01" onChange={onChange} />);
    expect(container.querySelector('.xui-date-picker__value')?.textContent).toBe('2026-11-01');
  });

  it('disabled 时不展开、无清除图标', () => {
    const { container } = render(<DatePicker defaultValue="2026-10-11" clearable disabled />);
    fireEvent.click(container.querySelector('.xui-date-picker__trigger')!);
    expect(container.querySelector('.xui-date-picker__panel')).toBeNull();
    expect(container.querySelector('.xui-date-picker__clear')).toBeNull();
    expect(container.querySelector('.xui-date-picker__trigger')?.getAttribute('tabindex')).toBe(
      '-1',
    );
  });

  it('passes className / style to root element', () => {
    const { container } = render(<DatePicker className="my-x" style={{ color: 'red' }} />);
    const root = container.querySelector('.xui-date-picker') as HTMLElement;
    expect(root).toHaveClass('my-x');
    expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
