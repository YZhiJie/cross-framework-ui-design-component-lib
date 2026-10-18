import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDropdownLogic, HOVER_CLOSE_DELAY, HOVER_OPEN_DELAY } from '../create-dropdown-logic';
import type { DropdownOption } from '../create-dropdown-logic';

const menu: DropdownOption[] = [
  { key: 'copy', label: '复制' },
  { key: 'cut', label: '剪切', disabled: true },
  { key: 'del', label: '删除', danger: true, divided: true },
];

describe('createDropdownLogic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初始状态正确（默认 hover / bottom）', () => {
    const logic = createDropdownLogic({ menu, disabled: true });
    expect(logic.getState()).toEqual({
      open: false,
      placement: 'bottom',
      trigger: 'hover',
      disabled: true,
    });
  });

  it('非法 placement / trigger 收敛到默认值', () => {
    const logic = createDropdownLogic({
      menu,
      placement: 'center' as never,
      trigger: 'contextmenu' as never,
    });
    expect(logic.getState().placement).toBe('bottom');
    expect(logic.getState().trigger).toBe('hover');
  });

  it('click 触发：toggle 切换开关并回调 onVisibleChange', () => {
    const onVisibleChange = vi.fn();
    const logic = createDropdownLogic({ menu, trigger: 'click', onVisibleChange });

    logic.toggle();
    expect(logic.getState().open).toBe(true);
    expect(onVisibleChange).toHaveBeenNthCalledWith(1, true);

    logic.toggle();
    expect(logic.getState().open).toBe(false);
    expect(onVisibleChange).toHaveBeenNthCalledWith(2, false);
  });

  it('hover 触发：toggle 为 no-op', () => {
    const logic = createDropdownLogic({ menu });
    logic.toggle();
    expect(logic.getState().open).toBe(false);
  });

  it('hover 进入延迟展开，离开（未开）取消待执行展开', () => {
    const logic = createDropdownLogic({ menu });

    logic.handleTriggerEnter();
    expect(logic.getState().open).toBe(false);
    vi.advanceTimersByTime(HOVER_OPEN_DELAY - 1);
    expect(logic.getState().open).toBe(false);
    vi.advanceTimersByTime(1);
    expect(logic.getState().open).toBe(true);

    // 未开状态下离开：清理待执行展开
    logic.closeMenu();
    logic.handleTriggerEnter();
    logic.handleTriggerLeave();
    vi.advanceTimersByTime(HOVER_OPEN_DELAY + HOVER_CLOSE_DELAY);
    expect(logic.getState().open).toBe(false);
  });

  it('打开后离开延迟收起，菜单进入取消收起', () => {
    const logic = createDropdownLogic({ menu });

    logic.handleTriggerEnter();
    vi.advanceTimersByTime(HOVER_OPEN_DELAY);
    expect(logic.getState().open).toBe(true);

    logic.handleTriggerLeave();
    vi.advanceTimersByTime(HOVER_CLOSE_DELAY - 1);
    expect(logic.getState().open).toBe(true);
    logic.handlePopperEnter();
    vi.advanceTimersByTime(HOVER_CLOSE_DELAY);
    expect(logic.getState().open).toBe(true);

    logic.handlePopperLeave();
    vi.advanceTimersByTime(HOVER_CLOSE_DELAY);
    expect(logic.getState().open).toBe(false);
  });

  it('select 正常项：收起 + 回调（key / option 载荷）', () => {
    const onSelect = vi.fn();
    const onVisibleChange = vi.fn();
    const logic = createDropdownLogic({ menu, trigger: 'click', onSelect, onVisibleChange });

    logic.toggle();
    logic.select('del');
    expect(logic.getState().open).toBe(false);
    expect(onSelect).toHaveBeenCalledWith('del', menu[2]);
    expect(onVisibleChange).toHaveBeenNthCalledWith(2, false);
  });

  it('select 禁用项 / 未知 key：no-op', () => {
    const onSelect = vi.fn();
    const logic = createDropdownLogic({ menu, trigger: 'click', onSelect });

    logic.toggle();
    logic.select('cut');
    expect(logic.getState().open).toBe(true);
    logic.select('missing');
    expect(logic.getState().open).toBe(true);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('close 仅收起不回调 onSelect', () => {
    const onSelect = vi.fn();
    const logic = createDropdownLogic({ menu, trigger: 'click', onSelect });

    logic.toggle();
    logic.close();
    expect(logic.getState().open).toBe(false);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('updateOptions：运行时禁用收起已开菜单，menu 热更新生效', () => {
    const onVisibleChange = vi.fn();
    const onSelect = vi.fn();
    const logic = createDropdownLogic({ menu, trigger: 'click', onVisibleChange, onSelect });

    logic.toggle();
    logic.updateOptions({ disabled: true });
    expect(logic.getState().open).toBe(false);
    expect(onVisibleChange).toHaveBeenNthCalledWith(2, false);

    const nextMenu = [{ key: 'only', label: '唯一项' }];
    logic.updateOptions({ disabled: false, menu: nextMenu });
    logic.toggle();
    logic.select('only');
    expect(onSelect).toHaveBeenCalledWith('only', nextMenu[0]);
  });

  it('trigger 变更清理 hover 调度，切换后 toggle 生效', () => {
    const logic = createDropdownLogic({ menu });

    logic.handleTriggerEnter();
    logic.updateOptions({ trigger: 'click' });
    vi.advanceTimersByTime(HOVER_OPEN_DELAY + HOVER_CLOSE_DELAY);
    expect(logic.getState().open).toBe(false);

    logic.toggle();
    expect(logic.getState().open).toBe(true);
  });
});
