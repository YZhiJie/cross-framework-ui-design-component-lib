import { describe, expect, it, vi } from 'vitest';
import { createVirtualListLogic } from '../create-virtual-list-logic';

/** 100 条 × 30px，视口 300px：可见 10 条 + 上下 overscan 5 条 */
const setup = (overscan = 5) =>
  createVirtualListLogic({ itemCount: 100, itemHeight: 30, viewportHeight: 300, overscan });

describe('createVirtualListLogic', () => {
  it('初始窗口：startIndex 0，endIndex = 可见数 + overscan', () => {
    const logic = setup();
    const state = logic.getState();
    expect(state.startIndex).toBe(0);
    expect(state.endIndex).toBe(15);
    expect(state.offsetY).toBe(0);
    expect(state.totalHeight).toBe(3000);
    expect(state.fillerHeight).toBe(3000 - 16 * 30);
  });

  it('scrollTo 计算新窗口并通知（300px → rawStart 10）', () => {
    const logic = setup();
    const listener = vi.fn();
    logic.subscribe(listener);

    logic.scrollTo(300);
    const state = logic.getState();
    expect(state.startIndex).toBe(5); // 10 - overscan 5
    expect(state.endIndex).toBe(25); // 10 + 10 + 5
    expect(state.offsetY).toBe(150);
    expect(state.scrollTop).toBe(300);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('滚动偏移越界自动 clamp 到 [0, maxScroll]', () => {
    const logic = setup();
    logic.scrollTo(-100);
    expect(logic.getState().scrollTop).toBe(0);

    logic.scrollTo(99999);
    expect(logic.getState().scrollTop).toBe(3000 - 300);
    expect(logic.getState().endIndex).toBe(99);
  });

  it('滚动值未产生窗口变化时不通知', () => {
    const logic = setup();
    const listener = vi.fn();
    logic.subscribe(listener);

    logic.scrollTo(0);
    expect(listener).not.toHaveBeenCalled();
  });

  it('itemCount 为 0：endIndex -1，totalHeight 0', () => {
    const logic = createVirtualListLogic({ itemCount: 0, itemHeight: 30, viewportHeight: 300 });
    const state = logic.getState();
    expect(state.endIndex).toBe(-1);
    expect(state.totalHeight).toBe(0);
  });

  it('viewportHeight 为 0：可见数 0，窗口起点 0', () => {
    const logic = createVirtualListLogic({ itemCount: 100, itemHeight: 30, viewportHeight: 0 });
    const state = logic.getState();
    expect(state.startIndex).toBe(0);
    expect(state.endIndex).toBe(5); // rawStart 0 + overscan 5
  });

  it('updateOptions 更新 itemCount 后窗口重排', () => {
    const logic = setup();
    logic.scrollTo(2970); // 滚到底
    expect(logic.getState().endIndex).toBe(99);

    logic.updateOptions({ itemCount: 10 });
    const state = logic.getState();
    // 最大滚动 0（总高 300 = 视口 300），回弹到顶
    expect(state.scrollTop).toBe(0);
    expect(state.totalHeight).toBe(300);
    expect(state.endIndex).toBe(9);
  });

  it('updateOptions 更新 itemHeight 后 totalHeight 重算', () => {
    const logic = setup();
    logic.updateOptions({ itemHeight: 48 });
    expect(logic.getState().totalHeight).toBe(4800);
  });

  it('scrollToIndex(start)：目标条目滚到视口顶', () => {
    const logic = setup();
    logic.scrollToIndex(50, 'start');
    const state = logic.getState();
    expect(state.scrollTop).toBe(1500);
    expect(state.startIndex).toBe(45); // 50 - overscan 5
  });

  it('scrollToIndex(end)：目标条目滚到视口底', () => {
    const logic = setup();
    logic.scrollToIndex(50, 'end');
    expect(logic.getState().scrollTop).toBe(51 * 30 - 300);
  });

  it('scrollToIndex(auto)：目标已在窗口内不滚动', () => {
    const listener = vi.fn();
    const logic = setup();
    logic.subscribe(listener);

    logic.scrollToIndex(10); // 0~15 窗口内
    expect(listener).not.toHaveBeenCalled();

    logic.scrollToIndex(50); // 窗口外，滚到顶
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('scrollToIndex 越界 clamp', () => {
    const logic = setup();
    logic.scrollToIndex(999);
    const state = logic.getState();
    expect(state.scrollTop).toBe(3000 - 300);
    expect(state.endIndex).toBe(99);
  });

  it('退订后不再收到通知', () => {
    const logic = setup();
    const listener = vi.fn();
    const unsubscribe = logic.subscribe(listener);
    unsubscribe();

    logic.scrollTo(300);
    expect(listener).not.toHaveBeenCalled();
  });

  it('非法入参兜底：itemHeight 最小 1，overscan/负数 itemCount 取 0', () => {
    const logic = createVirtualListLogic({
      itemCount: -5,
      itemHeight: 0,
      viewportHeight: -100,
      overscan: -3,
    });
    const state = logic.getState();
    expect(state.totalHeight).toBe(0);
    logic.scrollTo(50);
    expect(logic.getState().scrollTop).toBe(0);
  });
});
