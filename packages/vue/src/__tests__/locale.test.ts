/**
 * 全局国际化（locale）集成测试（Vue 适配层）
 *
 * 覆盖：默认 zh-CN 文案（与历史硬编码逐字一致）、setLocale 切换后组件响应式更新、
 * 显式 prop 优先于语言包、registerLocale 注册自定义语言包、切换回默认语言恢复。
 */

import { enableAutoUnmount, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { DatePicker, Modal, Table } from '../index';
import { DEFAULT_LOCALE, registerLocale, setLocale } from '../index';

enableAutoUnmount(afterEach);

const columns = [
  { key: 'name', title: '名称' },
  { key: 'age', title: '年龄' },
];

const rows = [
  { name: '张三', age: 28 },
  { name: '李四', age: 32 },
];

// Modal 经 Teleport 渲染到 body，需从 document.body 查询
const footerTexts = (): string[] =>
  Array.from(document.body.querySelectorAll<HTMLButtonElement>('.xui-modal__footer button')).map(
    (button) => button.textContent ?? '',
  );

describe('locale 国际化（vue）', () => {
  afterEach(() => {
    setLocale(DEFAULT_LOCALE);
  });

  it('Modal 默认文案为 取消/确认，setLocale 切换 en-US 后响应式更新', async () => {
    mount(Modal, { props: { visible: true } });
    expect(footerTexts()).toEqual(['取消', '确认']);

    setLocale('en-US');
    await nextTick();
    expect(footerTexts()).toEqual(['Cancel', 'OK']);

    setLocale(DEFAULT_LOCALE);
    await nextTick();
    expect(footerTexts()).toEqual(['取消', '确认']);
  });

  it('显式 okText / cancelText 优先于语言包', async () => {
    setLocale('en-US');
    mount(Modal, {
      props: { visible: true, okText: '好的', cancelText: '关闭' },
    });
    expect(footerTexts()).toEqual(['关闭', '好的']);
  });

  it('registerLocale 注册自定义语言包并切换生效（未覆盖分组回退当前包）', async () => {
    registerLocale('fr-FR', { modal: { ok: "D'accord", cancel: 'Annuler' } });
    setLocale('fr-FR');
    mount(Modal, { props: { visible: true } });
    expect(footerTexts()).toEqual(['Annuler', "D'accord"]);

    // 未覆盖的 table 分组回退注册时的基底包（zh-CN）
    setLocale('en-US');
    const table = mount(Table, { props: { columns, dataSource: [] } });
    await nextTick();
    expect(table.find('.xui-table__empty').text()).toBe('No data');
  });

  it('Table 空态与全选 aria 随语言切换', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: [], rowKey: 'name', rowSelection: {} },
    });
    expect(wrapper.find('.xui-table__empty').text()).toBe('暂无数据');
    expect(wrapper.find('input[type="checkbox"]').attributes('aria-label')).toBe('全选');

    setLocale('en-US');
    await nextTick();
    expect(wrapper.find('.xui-table__empty').text()).toBe('No data');
    expect(wrapper.find('input[type="checkbox"]').attributes('aria-label')).toBe('Select all');
  });

  it('Table 行选择 aria 按真实行号取值（首框为全选）', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows, rowKey: 'name', rowSelection: {} },
    });
    const boxes = wrapper.findAll('input[type="checkbox"]');
    expect(boxes[0]?.attributes('aria-label')).toBe('全选');
    expect(boxes[2]?.attributes('aria-label')).toBe('选择第 2 行');
  });

  it('DatePicker 占位符随语言切换', async () => {
    const wrapper = mount(DatePicker);
    expect(wrapper.find('.xui-date-picker__placeholder').text()).toBe('请选择日期');

    setLocale('en-US');
    await nextTick();
    expect(wrapper.find('.xui-date-picker__placeholder').text()).toBe('Select date');
  });

  it('DatePicker 星期标题与月份标题随语言切换', async () => {
    const wrapper = mount(DatePicker, { props: { defaultValue: '2026-01-15' } });
    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    expect(wrapper.find('.xui-date-picker__title').text()).toBe('2026 年 01 月');

    setLocale('en-US');
    await nextTick();
    expect(wrapper.find('.xui-date-picker__title').text()).toBe('January 2026');
    const weekdays = wrapper.findAll('.xui-date-picker__weekday').map((node) => node.text());
    expect(weekdays).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
  });
});
