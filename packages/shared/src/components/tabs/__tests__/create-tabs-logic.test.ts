import { describe, expect, it, vi } from 'vitest';
import { createTabsLogic } from '../create-tabs-logic';
import type { TabItem } from '../create-tabs-logic';

const ITEMS: TabItem[] = [
  { label: ' tab1', value: 'a' },
  { label: 'tab2', value: 'b', disabled: true },
  { label: 'tab3', value: 'c' },
  { label: 'tab4', value: 'd' },
];

describe('createTabsLogic', () => {
  it('初始状态正确：默认无激活项，defaultValue 提供初始值', () => {
    expect(createTabsLogic({ items: ITEMS }).getState()).toEqual({ value: null });
    expect(createTabsLogic({ items: ITEMS, defaultValue: 'a' }).getState()).toEqual({ value: 'a' });
  });

  it('activate 非受控：更新激活值并触发 onChange', () => {
    const onChange = vi.fn();
    const listener = vi.fn();
    const logic = createTabsLogic({ items: ITEMS, defaultValue: 'a', onChange });
    logic.subscribe(listener);
    logic.activate('c');
    expect(logic.getState().value).toBe('c');
    expect(onChange).toHaveBeenCalledWith('c');
    expect(listener).toHaveBeenCalled();
  });

  it('activate 相同值：不触发回调', () => {
    const onChange = vi.fn();
    const logic = createTabsLogic({ items: ITEMS, defaultValue: 'a', onChange });
    logic.activate('a');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('activate 禁用项忽略', () => {
    const onChange = vi.fn();
    const logic = createTabsLogic({ items: ITEMS, defaultValue: 'a', onChange });
    logic.activate('b');
    expect(logic.getState().value).toBe('a');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('activate 不存在的值忽略', () => {
    const onChange = vi.fn();
    const logic = createTabsLogic({ items: ITEMS, defaultValue: 'a', onChange });
    logic.activate('x');
    expect(logic.getState().value).toBe('a');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('受控模式：activate 仅回调，不改内部值；外部 updateOptions 同步', () => {
    const onChange = vi.fn();
    const logic = createTabsLogic({ items: ITEMS, value: 'a', onChange });
    logic.activate('c');
    expect(logic.getState().value).toBe('a');
    expect(onChange).toHaveBeenCalledWith('c');

    logic.updateOptions({ value: 'c' });
    expect(logic.getState().value).toBe('c');
  });

  it('moveActive：向下跳过禁用项', () => {
    const onChange = vi.fn();
    const logic = createTabsLogic({ items: ITEMS, defaultValue: 'a', onChange });
    logic.moveActive(1);
    // b 禁用，跳到 c
    expect(logic.getState().value).toBe('c');
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('moveActive：循环（从尾向下回首项，从首向上回尾项）', () => {
    const logic = createTabsLogic({ items: ITEMS, defaultValue: 'd' });
    logic.moveActive(1);
    expect(logic.getState().value).toBe('a');

    logic.moveActive(-1);
    expect(logic.getState().value).toBe('d');
  });

  it('moveActive：无激活项时向下定位第一个可用项、向上定位最后一个可用项', () => {
    const logic = createTabsLogic({ items: ITEMS });
    logic.moveActive(1);
    expect(logic.getState().value).toBe('a');

    const logic2 = createTabsLogic({ items: ITEMS });
    logic2.moveActive(-1);
    expect(logic2.getState().value).toBe('d');
  });

  it('moveActive：全部禁用时不动', () => {
    const onChange = vi.fn();
    const logic = createTabsLogic({
      items: ITEMS.map((item) => ({ ...item, disabled: true })),
      onChange,
    });
    logic.moveActive(1);
    expect(logic.getState().value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('moveActive：items 为空时忽略', () => {
    const logic = createTabsLogic({});
    logic.moveActive(1);
    expect(logic.getState().value).toBeNull();
  });

  it('updateOptions：替换 items 后按新列表校验激活', () => {
    const logic = createTabsLogic({ items: ITEMS, defaultValue: 'a' });
    logic.updateOptions({ items: [{ label: '新标签', value: 'z' }] });
    logic.activate('z');
    expect(logic.getState().value).toBe('z');
  });
});
