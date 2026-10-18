import { beforeEach, describe, expect, it, vi } from 'vitest';
import { enUS, zhCN } from '../index';
import {
  DEFAULT_LOCALE,
  getLocale,
  getLocaleData,
  registerLocale,
  setLocale,
  subscribeLocale,
} from '../locale';

beforeEach(() => {
  // 模块级单例状态复位到默认语言（zh-CN 包引用未被 registerLocale 污染）
  setLocale('zh-CN');
});

describe('locale 运行时 API', () => {
  it('默认语言 zh-CN，文案与历史硬编码默认值一致', () => {
    expect(getLocale()).toBe('zh-CN');
    expect(getLocaleData()).toBe(zhCN);
    expect(getLocaleData().modal).toEqual({ ok: '确认', cancel: '取消' });
    expect(getLocaleData().popconfirm).toEqual({ confirm: '确定', cancel: '取消' });
    expect(getLocaleData().table.empty).toBe('暂无数据');
    expect(getLocaleData().table.selectAll).toBe('全选');
    expect(getLocaleData().table.selectRow(2)).toBe('选择第 3 行');
    expect(getLocaleData().pagination).toEqual({ nav: '分页', prev: '上一页', next: '下一页' });
    expect(getLocaleData().datePicker.weekdays).toEqual(['日', '一', '二', '三', '四', '五', '六']);
    expect(getLocaleData().datePicker.placeholder).toBe('请选择日期');
    expect(getLocaleData().datePicker.confirm).toBe('确认');
    expect(getLocaleData().datePicker.cancel).toBe('取消');
    expect(getLocaleData().skeleton.loading).toBe('加载中');
    expect(getLocaleData().breadcrumb.nav).toBe('面包屑');
    expect(getLocaleData().select).toEqual({
      searchPlaceholder: '搜索...',
      searchAriaLabel: '搜索选项',
      triggerPlaceholder: '请选择',
    });
    expect(DEFAULT_LOCALE).toBe('zh-CN');
  });

  it('setLocale(en-US) 切换文案、更换稳定引用并通知订阅者', () => {
    const before = getLocaleData();
    const listener = vi.fn();
    subscribeLocale(listener);

    setLocale('en-US');
    expect(getLocale()).toBe('en-US');
    expect(getLocaleData()).toBe(enUS);
    expect(getLocaleData()).not.toBe(before);
    expect(getLocaleData().modal).toEqual({ ok: 'OK', cancel: 'Cancel' });
    expect(getLocaleData().table.selectRow(0)).toBe('Select row 1');
    expect(getLocaleData().datePicker.weekdays).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(enUS);
  });

  it('setLocale 未注册 key 静默忽略（不切换、不通知）', () => {
    const listener = vi.fn();
    subscribeLocale(listener);

    setLocale('fr-FR');
    expect(getLocale()).toBe('zh-CN');
    expect(getLocaleData()).toBe(zhCN);
    expect(listener).not.toHaveBeenCalled();
  });

  it('setLocale 与当前语言相同静默返回（不重复通知）', () => {
    const listener = vi.fn();
    subscribeLocale(listener);

    setLocale('zh-CN');
    expect(listener).not.toHaveBeenCalled();
  });

  it('registerLocale 注册新语言：基底回退当前生效包，setLocale 后生效', () => {
    registerLocale('ja-JP', { modal: { ok: '決定', cancel: 'キャンセル' } });
    setLocale('ja-JP');

    expect(getLocale()).toBe('ja-JP');
    expect(getLocaleData().modal).toEqual({ ok: '決定', cancel: 'キャンセル' });
    // 未提供组继承注册时的当前生效包（zh-CN）
    expect(getLocaleData().table.empty).toBe('暂无数据');
    expect(getLocaleData().pagination).toEqual({ nav: '分页', prev: '上一页', next: '下一页' });
  });

  it('registerLocale 覆盖当前生效语言：重建缓存引用、通知订阅者、未提供字段保留', () => {
    const before = getLocaleData();
    const listener = vi.fn();
    subscribeLocale(listener);

    registerLocale('zh-CN', { modal: { ok: '好的' } });
    expect(getLocaleData()).not.toBe(before);
    expect(getLocaleData().modal.ok).toBe('好的');
    // 未提供字段继承既有 zh-CN 包
    expect(getLocaleData().modal.cancel).toBe('取消');
    expect(getLocaleData().table.empty).toBe('暂无数据');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(getLocaleData());
  });

  it('registerLocale 覆盖非当前语言不通知，setLocale 后才生效', () => {
    const listener = vi.fn();
    subscribeLocale(listener);

    registerLocale('en-US', { modal: { ok: 'Confirm' } });
    expect(listener).not.toHaveBeenCalled();

    setLocale('en-US');
    expect(getLocaleData().modal.ok).toBe('Confirm');
    expect(getLocaleData().modal.cancel).toBe('Cancel');
  });

  it('registerLocale 的 weekdays 整组替换、函数型文案可覆盖', () => {
    registerLocale('zh-CN', {
      datePicker: { weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] },
      table: { selectRow: (index) => `选中行 ${index + 1}` },
    });
    expect(getLocaleData().datePicker.weekdays).toEqual([
      '周日',
      '周一',
      '周二',
      '周三',
      '周四',
      '周五',
      '周六',
    ]);
    expect(getLocaleData().table.selectRow(0)).toBe('选中行 1');
    // 同组未提供的字段保留
    expect(getLocaleData().datePicker.panel).toBe('选择日期');
    expect(getLocaleData().table.empty).toBe('暂无数据');
  });

  it('registerLocale 非法入参静默忽略', () => {
    const before = getLocaleData();
    registerLocale('', { modal: { ok: 'x' } });
    registerLocale('zh-CN', null as never);
    registerLocale('zh-CN', { modal: null as never });
    expect(getLocaleData()).toBe(before);
  });

  it('退订后不再收到通知', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeLocale(listener);
    unsubscribe();

    setLocale('en-US');
    expect(listener).not.toHaveBeenCalled();
  });
});
