import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { TimeSlotPicker } from '../TimeSlotPicker';
import type { TimeSlotPickerRef } from '../TimeSlotPicker';

const cells = (container: HTMLElement): HTMLButtonElement[] =>
  Array.from(container.querySelectorAll('button.xui-time-slot-picker__cell'));

describe('TimeSlotPicker (react)', () => {
  it('默认按周渲染：7 行 × 24 列，共 168 个时段', () => {
    const { container } = render(<TimeSlotPicker />);
    const root = container.querySelector('.xui-time-slot-picker');
    expect(root?.className).toContain('xui-time-slot-picker--week');
    expect(cells(container)).toHaveLength(168);
    expect(
      Array.from(container.querySelectorAll('.xui-time-slot-picker__row-label')).map(
        (node) => node.textContent,
      ),
    ).toEqual(['一', '二', '三', '四', '五', '六', '日']);
    expect(
      Array.from(container.querySelectorAll('.xui-time-slot-picker__col-label'))
        .map((node) => node.textContent)
        .filter(Boolean),
    ).toEqual(['00', '03', '06', '09', '12', '15', '18', '21']);
  });

  it('点击切换选中态并触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<TimeSlotPicker onChange={onChange} />);
    const first = cells(container)[0];

    fireEvent.click(first);
    expect(first.className).toContain('is-selected');
    expect(first.getAttribute('aria-pressed')).toBe('true');
    expect(onChange).toHaveBeenLastCalledWith(['w:1:00']);

    fireEvent.click(first);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('受控模式只回调不自行变更选中态', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <TimeSlotPicker value={['w:1:01']} onChange={onChange} />,
    );
    expect(cells(container)[1].className).toContain('is-selected');

    fireEvent.click(cells(container)[2]);
    expect(onChange).toHaveBeenCalledWith(['w:1:01', 'w:1:02']);
    expect(cells(container)[2].className).not.toContain('is-selected');

    rerender(<TimeSlotPicker value={['w:1:01', 'w:1:02']} onChange={onChange} />);
    expect(container.querySelectorAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(2);
  });

  it('矩形框选：拖拽按矩形预览，mouseup 后统一提交', () => {
    const { container } = render(<TimeSlotPicker />);
    const buttons = cells(container);

    // 第 1 行第 2 列 → 第 3 行第 1 列，矩形覆盖 3 行 × 2 列
    fireEvent.mouseDown(buttons[1]);
    fireEvent.mouseEnter(buttons[48]);
    expect(container.querySelectorAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(0);
    expect(
      container.querySelectorAll('.xui-time-slot-picker__cell.is-preview-selected'),
    ).toHaveLength(6);

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(container.querySelectorAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(6);
    expect(
      container.querySelectorAll('.xui-time-slot-picker__cell.is-preview-selected'),
    ).toHaveLength(0);

    // 从已选格子开始拖拽 → 矩形内全部进入取消预览，mouseup 后取消
    fireEvent.mouseDown(buttons[1]);
    fireEvent.mouseEnter(buttons[48]);
    expect(
      container.querySelectorAll('.xui-time-slot-picker__cell.is-preview-unselected'),
    ).toHaveLength(6);

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(container.querySelectorAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(0);

    // 结束后 mouseenter 不再产生预览
    fireEvent.mouseEnter(buttons[30]);
    expect(
      container.querySelectorAll('.xui-time-slot-picker__cell.is-preview-selected'),
    ).toHaveLength(0);
  });

  it('按月渲染：日历格子、前置占位与底部统计', () => {
    const { container } = render(<TimeSlotPicker granularity="month" referenceDate="2026-10-20" />);
    const buttons = cells(container);
    expect(buttons).toHaveLength(31);
    expect(buttons[0].textContent).toBe('1');
    expect(buttons[30].textContent).toBe('31');
    // 3 个前置占位 + 1 个行尾占位
    expect(container.querySelectorAll('.xui-time-slot-picker__cell.is-empty')).toHaveLength(4);
    expect(container.querySelector('.xui-time-slot-picker__summary')?.textContent).toBe(
      '点击或拖拽选择投放时段',
    );

    fireEvent.click(buttons[0]);
    expect(container.querySelector('.xui-time-slot-picker__summary')?.textContent).toBe(
      '已选 1 / 31 个时段',
    );
    expect(container.querySelector('.xui-time-slot-picker__legend')?.textContent).toContain('未选');
    expect(container.querySelector('.xui-time-slot-picker__legend')?.textContent).toContain('已选');
  });

  it('按年渲染：全年日期与月份列头', () => {
    const { container } = render(<TimeSlotPicker granularity="year" referenceDate="2026-10-20" />);
    expect(cells(container)).toHaveLength(365);
    expect(
      cells(container).some((button) => button.getAttribute('title') === '2026 年 1 月 1 日'),
    ).toBe(true);
    const headers = Array.from(container.querySelectorAll('.xui-time-slot-picker__col-label'))
      .map((node) => node.textContent)
      .filter(Boolean);
    expect(headers[0]).toBe('1 月');
    expect(headers).toContain('12 月');
  });

  it('按日渲染：24 个小时格并在格子内显示小时', () => {
    const { container } = render(<TimeSlotPicker granularity="day" />);
    const buttons = cells(container);
    expect(buttons).toHaveLength(24);
    expect(buttons[0].textContent).toBe('00');
    expect(buttons[23].textContent).toBe('23');
    expect(container.querySelector('.xui-time-slot-picker__col-label')).toBeNull();
  });

  it('disabled 时不可交互', () => {
    const onChange = vi.fn();
    const { container } = render(<TimeSlotPicker disabled onChange={onChange} />);
    const first = cells(container)[0];
    expect(first.disabled).toBe(true);
    fireEvent.click(first);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('showFooter=false 隐藏底部统计', () => {
    const { container } = render(<TimeSlotPicker showFooter={false} />);
    expect(container.querySelector('.xui-time-slot-picker__footer')).toBeNull();
  });

  it('暴露 clear / selectAll / toggle 命令式 API', () => {
    const ref = createRef<TimeSlotPickerRef>();
    const { container } = render(<TimeSlotPicker ref={ref} />);

    act(() => ref.current?.selectAll());
    expect(container.querySelectorAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(168);

    act(() => ref.current?.toggle('w:1:00'));
    expect(container.querySelectorAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(167);

    act(() => ref.current?.clear());
    expect(container.querySelectorAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(0);
  });
});
