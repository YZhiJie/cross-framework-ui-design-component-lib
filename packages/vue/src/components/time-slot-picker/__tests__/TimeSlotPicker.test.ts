import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimeSlotPicker from '../TimeSlotPicker.vue';
import type { TimeSlotPickerRef } from '../index';

const cellButtons = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('button.xui-time-slot-picker__cell');

afterEach(() => {
  document.body.innerHTML = '';
});

describe('TimeSlotPicker (vue)', () => {
  it('默认按周渲染：7 行 × 24 列，共 168 个时段', () => {
    const wrapper = mount(TimeSlotPicker);
    expect(wrapper.classes()).toContain('xui-time-slot-picker--week');
    expect(cellButtons(wrapper)).toHaveLength(168);
    expect(wrapper.findAll('.xui-time-slot-picker__row-label').map((node) => node.text())).toEqual([
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '日',
    ]);
    expect(
      wrapper
        .findAll('.xui-time-slot-picker__col-label')
        .map((node) => node.text())
        .filter(Boolean),
    ).toEqual(['00', '03', '06', '09', '12', '15', '18', '21']);
  });

  it('点击切换选中态，并触发 change / update:value', async () => {
    const wrapper = mount(TimeSlotPicker);
    const first = cellButtons(wrapper)[0];
    await first.trigger('click');
    expect(first.classes()).toContain('is-selected');
    expect(first.attributes('aria-pressed')).toBe('true');
    expect(wrapper.emitted('change')?.[0]).toEqual([['w:1:00']]);
    expect(wrapper.emitted('update:value')?.[0]).toEqual([['w:1:00']]);

    await first.trigger('click');
    expect(wrapper.emitted('change')?.[1]).toEqual([[]]);
  });

  it('受控模式只回调不自行变更选中态', async () => {
    const wrapper = mount(TimeSlotPicker, {
      props: { value: ['w:1:01'] },
    });
    const buttons = cellButtons(wrapper);
    expect(buttons[1].classes()).toContain('is-selected');

    await buttons[2].trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([['w:1:01', 'w:1:02']]);
    expect(buttons[2].classes()).not.toContain('is-selected');

    await wrapper.setProps({ value: ['w:1:01', 'w:1:02'] });
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(2);
  });

  it('矩形框选：拖拽按矩形预览，mouseup 后统一提交', async () => {
    const wrapper = mount(TimeSlotPicker);
    const buttons = cellButtons(wrapper);

    // 第 1 行第 2 列 → 第 3 行第 1 列，矩形覆盖 3 行 × 2 列
    await buttons[1].trigger('mousedown');
    await buttons[48].trigger('mouseenter');
    await nextTick();
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(0);
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-preview-selected')).toHaveLength(6);

    window.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(6);
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-preview-selected')).toHaveLength(0);

    // 从已选格子开始拖拽 → 矩形内全部进入取消预览，mouseup 后取消
    await buttons[1].trigger('mousedown');
    await buttons[48].trigger('mouseenter');
    await nextTick();
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-preview-unselected')).toHaveLength(6);

    window.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(0);

    // 结束后 mouseenter 不再产生预览
    await buttons[30].trigger('mouseenter');
    await nextTick();
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-preview-selected')).toHaveLength(0);
  });

  it('按月渲染：日历格子、前置占位与底部统计', async () => {
    const wrapper = mount(TimeSlotPicker, {
      props: { granularity: 'month', referenceDate: '2026-10-20' },
    });
    expect(wrapper.classes()).toContain('xui-time-slot-picker--month');
    const buttons = cellButtons(wrapper);
    expect(buttons).toHaveLength(31);
    expect(buttons[0].text()).toBe('1');
    expect(buttons[30].text()).toBe('31');
    // 3 个前置占位 + 1 个行尾占位
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-empty')).toHaveLength(4);
    expect(wrapper.find('.xui-time-slot-picker__summary').text()).toBe('点击或拖拽选择投放时段');

    await buttons[0].trigger('click');
    expect(wrapper.find('.xui-time-slot-picker__summary').text()).toBe('已选 1 / 31 个时段');
    expect(wrapper.find('.xui-time-slot-picker__legend').text()).toContain('未选');
    expect(wrapper.find('.xui-time-slot-picker__legend').text()).toContain('已选');
  });

  it('按年渲染：全年日期与月份列头', () => {
    const wrapper = mount(TimeSlotPicker, {
      props: { granularity: 'year', referenceDate: '2026-10-20' },
    });
    expect(wrapper.classes()).toContain('xui-time-slot-picker--year');
    expect(cellButtons(wrapper)).toHaveLength(365);
    expect(
      cellButtons(wrapper).some((button) => button.attributes('title') === '2026 年 1 月 1 日'),
    ).toBe(true);
    const headers = wrapper
      .findAll('.xui-time-slot-picker__col-label')
      .map((node) => node.text())
      .filter(Boolean);
    expect(headers[0]).toBe('1 月');
    expect(headers).toContain('12 月');
  });

  it('按日渲染：24 个小时格并在格子内显示小时', () => {
    const wrapper = mount(TimeSlotPicker, { props: { granularity: 'day' } });
    const buttons = cellButtons(wrapper);
    expect(buttons).toHaveLength(24);
    expect(buttons[0].text()).toBe('00');
    expect(buttons[23].text()).toBe('23');
    expect(wrapper.find('.xui-time-slot-picker__col-label').exists()).toBe(false);
  });

  it('disabled 时不可交互', async () => {
    const wrapper = mount(TimeSlotPicker, { props: { disabled: true } });
    const first = cellButtons(wrapper)[0];
    expect(first.attributes('disabled')).toBeDefined();
    await first.trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('showFooter=false 隐藏底部统计', () => {
    const wrapper = mount(TimeSlotPicker, { props: { showFooter: false } });
    expect(wrapper.find('.xui-time-slot-picker__footer').exists()).toBe(false);
  });

  it('暴露 clear / selectAll / toggle 命令式 API', async () => {
    const wrapper = mount(TimeSlotPicker);
    const api = wrapper.vm as unknown as TimeSlotPickerRef;

    api.selectAll();
    await nextTick();
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(168);

    api.toggle('w:1:00');
    await nextTick();
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(167);

    api.clear();
    await nextTick();
    expect(wrapper.findAll('.xui-time-slot-picker__cell.is-selected')).toHaveLength(0);
  });
});
