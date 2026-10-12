/**
 * 全局国际化（locale）集成测试（React 适配层）
 *
 * 覆盖：默认 zh-CN 文案（与历史硬编码逐字一致）、setLocale 切换后组件响应式更新、
 * 显式 prop 优先于语言包、registerLocale 注册自定义语言包、切换回默认语言恢复。
 */

import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DatePicker, Modal, Table } from '../index';
import { DEFAULT_LOCALE, registerLocale, setLocale } from '../index';

const columns = [
  { key: 'name', title: '名称' },
  { key: 'age', title: '年龄' },
];

const rows = [
  { name: '张三', age: 28 },
  { name: '李四', age: 32 },
];

// Modal 经 createPortal 挂载到 document.body，需从 document 查询
const footerTexts = (): string[] =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('.xui-modal__footer button')).map(
    (button) => button.textContent ?? '',
  );

describe('locale 国际化（react）', () => {
  afterEach(() => {
    setLocale(DEFAULT_LOCALE);
    cleanup();
  });

  it('Modal 默认文案为 取消/确认，setLocale 切换 en-US 后响应式更新', () => {
    render(<Modal visible>内容</Modal>);
    expect(footerTexts()).toEqual(['取消', '确认']);

    act(() => setLocale('en-US'));
    expect(footerTexts()).toEqual(['Cancel', 'OK']);

    act(() => setLocale(DEFAULT_LOCALE));
    expect(footerTexts()).toEqual(['取消', '确认']);
  });

  it('显式 okText / cancelText 优先于语言包', () => {
    act(() => setLocale('en-US'));
    render(
      <Modal visible okText="好的" cancelText="关闭">
        内容
      </Modal>,
    );
    expect(footerTexts()).toEqual(['关闭', '好的']);
  });

  it('registerLocale 注册自定义语言包并切换生效（未覆盖分组回退当前包）', () => {
    registerLocale('fr-FR', { modal: { ok: "D'accord", cancel: 'Annuler' } });
    act(() => setLocale('fr-FR'));
    render(<Modal visible>内容</Modal>);
    expect(footerTexts()).toEqual(['Annuler', "D'accord"]);

    // 未覆盖的 skeleton 分组回退注册时的基底包（zh-CN）
    act(() => setLocale('en-US'));
    const skeleton = render(<Table columns={columns} dataSource={[]} />);
    expect(skeleton.container.querySelector('.xui-table__empty')?.textContent).toBe('No data');
  });

  it('Table 空态与全选 aria 随语言切换', () => {
    const { container } = render(
      <Table columns={columns} dataSource={[]} rowKey="name" rowSelection={{}} />,
    );
    expect(container.querySelector('.xui-table__empty')?.textContent).toBe('暂无数据');
    expect(container.querySelector('.xui-table__check')?.getAttribute('aria-label')).toBe('全选');

    act(() => setLocale('en-US'));
    expect(container.querySelector('.xui-table__empty')?.textContent).toBe('No data');
    expect(container.querySelector('.xui-table__check')?.getAttribute('aria-label')).toBe(
      'Select all',
    );
  });

  it('Table 行选择 aria 按真实行号取值（首框为全选）', () => {
    const { container } = render(
      <Table columns={columns} dataSource={rows} rowKey="name" rowSelection={{}} />,
    );
    const boxes = container.querySelectorAll('input[type="checkbox"]');
    expect(boxes[0]?.getAttribute('aria-label')).toBe('全选');
    expect(boxes[2]?.getAttribute('aria-label')).toBe('选择第 2 行');
  });

  it('DatePicker 占位符随语言切换', () => {
    const { container } = render(<DatePicker />);
    expect(container.querySelector('.xui-date-picker__placeholder')?.textContent).toBe(
      '请选择日期',
    );
    act(() => setLocale('en-US'));
    expect(container.querySelector('.xui-date-picker__placeholder')?.textContent).toBe(
      'Select date',
    );
  });

  it('DatePicker 星期标题与月份标题随语言切换', () => {
    const { container } = render(<DatePicker defaultValue="2026-01-15" />);
    fireEvent.click(container.querySelector('.xui-date-picker__trigger')!);
    expect(container.querySelector('.xui-date-picker__title')?.textContent).toBe('2026 年 01 月');

    act(() => setLocale('en-US'));
    expect(container.querySelector('.xui-date-picker__title')?.textContent).toBe('January 2026');
    const weekdays = Array.from(container.querySelectorAll('.xui-date-picker__weekday')).map(
      (node) => node.textContent,
    );
    expect(weekdays).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
  });
});
