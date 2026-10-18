import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { TimePicker } from '../TimePicker';

describe('TimePicker (react)', () => {
  it('渲染占位文案与时钟图标，点击展开面板', () => {
    const { container } = render(<TimePicker />);
    expect(container.querySelector('.xui-time-picker__placeholder')?.textContent).toBe(
      '请选择时间',
    );
    expect(container.querySelector('.xui-time-picker__panel')).toBeNull();

    fireEvent.click(container.querySelector('.xui-time-picker__trigger')!);
    const panel = container.querySelector('.xui-time-picker__panel');
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute('role')).toBe('dialog');
    // 三列：时 / 分 / 秒
    expect(container.querySelectorAll('.xui-time-picker__column')).toHaveLength(3);
  });

  it('defaultValue 显示选中值', () => {
    const { container } = render(<TimePicker defaultValue="09:30:00" />);
    expect(container.querySelector('.xui-time-picker__value')?.textContent).toBe('09:30:00');
  });

  it('format=HH:mm 不渲染秒列、不显示秒', () => {
    const { container } = render(<TimePicker defaultValue="09:30:45" format="HH:mm" />);
    expect(container.querySelector('.xui-time-picker__value')?.textContent).toBe('09:30');
    fireEvent.click(container.querySelector('.xui-time-picker__trigger')!);
    // HH:mm 只有两列
    expect(container.querySelectorAll('.xui-time-picker__column')).toHaveLength(2);
  });

  it('点击时间项仅更新草稿，确认后触发 onChange 并收起面板', () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-time-picker__trigger')!);
    // 点击时列的 08
    const hourItems = container.querySelectorAll('[aria-label="hour"] .xui-time-picker__item');
    const target = Array.from(hourItems).find((el) => el.textContent === '08');
    fireEvent.click(target!);
    // 草稿阶段不触发 onChange，面板保持展开
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector('.xui-time-picker__panel')).not.toBeNull();
    // 点击确认提交
    fireEvent.click(container.querySelector('.xui-time-picker__footer-btn--confirm')!);
    expect(onChange).toHaveBeenCalledWith('08:00:00');
    expect(container.querySelector('.xui-time-picker__panel')).toBeNull();
  });

  it('点击取消丢弃草稿，不触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker defaultValue="09:30:00" onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-time-picker__trigger')!);
    const hourItems = container.querySelectorAll('[aria-label="hour"] .xui-time-picker__item');
    const target = Array.from(hourItems).find((el) => el.textContent === '08');
    fireEvent.click(target!);
    fireEvent.click(container.querySelector('.xui-time-picker__footer-btn--cancel')!);
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector('.xui-time-picker__panel')).toBeNull();
    // 重新展开后面板高亮回退到已选值
    fireEvent.click(container.querySelector('.xui-time-picker__trigger')!);
    const selected = container.querySelector(
      '[aria-label="hour"] .xui-time-picker__item.is-selected',
    );
    expect(selected?.textContent).toBe('09');
  });

  it('disabled 时点击不展开面板', () => {
    const { container } = render(<TimePicker disabled />);
    fireEvent.click(container.querySelector('.xui-time-picker__trigger')!);
    expect(container.querySelector('.xui-time-picker__panel')).toBeNull();
  });

  it('clearable 时点击清除触发 onClear', () => {
    const onClear = vi.fn();
    const { container } = render(
      <TimePicker defaultValue="12:00:00" clearable onClear={onClear} />,
    );
    fireEvent.click(container.querySelector('.xui-time-picker__clear')!);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('点击组件外部收起面板', () => {
    const { container } = render(
      <div>
        <TimePicker />
        <button type="button" data-testid="outside">
          outside
        </button>
      </div>,
    );
    fireEvent.click(container.querySelector('.xui-time-picker__trigger')!);
    expect(container.querySelector('.xui-time-picker__panel')).not.toBeNull();
    fireEvent.mouseDown(container.querySelector('[data-testid="outside"]')!);
    expect(container.querySelector('.xui-time-picker__panel')).toBeNull();
  });

  it('hourStep/minuteStep 控制可选值', () => {
    const { container } = render(<TimePicker hourStep={2} minuteStep={15} />);
    fireEvent.click(container.querySelector('.xui-time-picker__trigger')!);
    const hourItems = container.querySelectorAll('[aria-label="hour"] .xui-time-picker__item');
    expect(hourItems[0].textContent).toBe('00');
    expect(hourItems[1].textContent).toBe('02');
    const minuteItems = container.querySelectorAll('[aria-label="minute"] .xui-time-picker__item');
    expect(minuteItems[0].textContent).toBe('00');
    expect(minuteItems[1].textContent).toBe('15');
  });
});
