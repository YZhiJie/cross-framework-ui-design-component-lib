import { describe, expect, it, vi } from 'vitest';
import { createPageItems, createPaginationLogic } from '../create-pagination-logic';

describe('createPaginationLogic', () => {
  it('初始状态：默认第 1 页，页数由 total/pageSize 计算', () => {
    const logic = createPaginationLogic({ total: 95, pageSize: 10 });
    expect(logic.getState()).toEqual({ page: 1, pageCount: 10, disabled: false });
  });

  it('defaultValue 越界时 clamp 到有效范围', () => {
    const logic = createPaginationLogic({ total: 25, defaultValue: 99 });
    expect(logic.getState().page).toBe(3);
  });

  it('goTo 更新页码并触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createPaginationLogic({ total: 100, onChange });
    logic.goTo(3);
    expect(logic.getState().page).toBe(3);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('goTo 越界 clamp，重复跳转为 no-op 不触发回调', () => {
    const onChange = vi.fn();
    const logic = createPaginationLogic({ total: 25, onChange });
    logic.goTo(99);
    expect(logic.getState().page).toBe(3);
    expect(onChange).toHaveBeenCalledTimes(1);
    logic.goTo(3);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('prev / next 在边界为 no-op', () => {
    const onChange = vi.fn();
    const logic = createPaginationLogic({ total: 25, defaultValue: 3, onChange });
    logic.prev();
    expect(logic.getState().page).toBe(2);
    logic.prev();
    logic.prev();
    expect(logic.getState().page).toBe(1);
    logic.prev();
    expect(logic.getState().page).toBe(1);
    logic.next();
    logic.next();
    expect(logic.getState().page).toBe(3);
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it('disabled 时忽略所有跳转', () => {
    const onChange = vi.fn();
    const logic = createPaginationLogic({ total: 100, disabled: true, onChange });
    logic.goTo(2);
    logic.prev();
    logic.next();
    expect(logic.getState().page).toBe(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('受控模式：goTo 仅回调不内部更新，由 updateOptions 同步', () => {
    const onChange = vi.fn();
    const logic = createPaginationLogic({ value: 1, total: 100, onChange });
    logic.goTo(4);
    expect(logic.getState().page).toBe(1);
    expect(onChange).toHaveBeenCalledWith(4);
    logic.updateOptions({ value: 4 });
    expect(logic.getState().page).toBe(4);
  });

  it('updateOptions 变更 total/pageSize 重算页数并收敛当前页', () => {
    const listener = vi.fn();
    const logic = createPaginationLogic({ total: 100, defaultValue: 10 });
    logic.subscribe(listener);
    logic.updateOptions({ total: 15 });
    expect(logic.getState()).toEqual({ page: 2, pageCount: 2, disabled: false });
    expect(listener).toHaveBeenCalled();
  });

  it('updateOptions 传入非法 pageSize 回退为 1 页起', () => {
    const logic = createPaginationLogic({ total: 100 });
    logic.updateOptions({ pageSize: 0 });
    expect(logic.getState().pageCount).toBe(100);
  });
});

describe('createPageItems', () => {
  it('总页数 <= 7 时全部展示', () => {
    expect(createPageItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(createPageItems(1, 1)).toEqual([1]);
  });

  it('当前页靠前时展示前 5 页 + 尾省略号', () => {
    expect(createPageItems(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-next', 20]);
    expect(createPageItems(4, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-next', 20]);
  });

  it('当前页靠后时展示首省略号 + 末 5 页', () => {
    expect(createPageItems(20, 20)).toEqual([1, 'ellipsis-prev', 16, 17, 18, 19, 20]);
    expect(createPageItems(17, 20)).toEqual([1, 'ellipsis-prev', 16, 17, 18, 19, 20]);
  });

  it('中间页展示首末 + 当前 ±1 + 双侧省略号', () => {
    expect(createPageItems(10, 20)).toEqual([1, 'ellipsis-prev', 9, 10, 11, 'ellipsis-next', 20]);
  });

  it('page 越界时 clamp 后生成', () => {
    expect(createPageItems(99, 20)).toEqual([1, 'ellipsis-prev', 16, 17, 18, 19, 20]);
  });
});
