// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { createStepsLogic } from '../create-steps-logic';
import type { StepItem } from '../create-steps-logic';

const items: StepItem[] = [
  { key: 'a', title: '第一步' },
  { key: 'b', title: '第二步', disabled: true },
  { key: 'c', title: '第三步' },
  { key: 'd', title: '第四步' },
];

describe('createStepsLogic', () => {
  it('初始状态正确（defaultValue 支持，负数回退 0）', () => {
    expect(createStepsLogic({ items }).getState().value).toBe(0);
    expect(createStepsLogic({ items, defaultValue: 2 }).getState().value).toBe(2);
    expect(createStepsLogic({ items, defaultValue: -1 }).getState().value).toBe(0);
  });

  it('direction 收敛非法值为 horizontal', () => {
    // @ts-expect-error 注入非法值验证收敛
    const logic = createStepsLogic({ items, direction: 'diagonal' });
    expect(logic.getState().direction).toBe('horizontal');
  });

  it('select 切换当前步骤并触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createStepsLogic({ items, onChange });
    logic.select(2);
    expect(logic.getState().value).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('select 越界、禁用项与重复选中 no-op', () => {
    const onChange = vi.fn();
    const logic = createStepsLogic({ items, onChange });
    logic.select(99);
    logic.select(1); // disabled
    logic.select(0); // 初始已是 0，重复选中
    expect(onChange).not.toHaveBeenCalled();
    logic.select(2);
    logic.select(2); // 重复
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('getStatus 按索引推导 finish/process/wait', () => {
    const logic = createStepsLogic({ items, defaultValue: 1 });
    expect(logic.getStatus(0)).toBe('finish');
    expect(logic.getStatus(1)).toBe('process');
    expect(logic.getStatus(2)).toBe('wait');
  });

  it('status 覆盖当前步骤状态（error）', () => {
    const logic = createStepsLogic({ items, defaultValue: 1, status: 'error' });
    expect(logic.getStatus(1)).toBe('error');
    expect(logic.getStatus(0)).toBe('finish');
  });

  it('受控模式：select 不写内部值，仅回调', () => {
    const onChange = vi.fn();
    const logic = createStepsLogic({ items, value: 0, onChange });
    logic.select(2);
    expect(logic.getState().value).toBe(0);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('受控值经 updateOptions 同步', () => {
    const logic = createStepsLogic({ items, value: 0 });
    logic.updateOptions({ value: 3 });
    expect(logic.getState().value).toBe(3);
  });

  it('next / prev 越界与禁用目标 no-op', () => {
    const logic = createStepsLogic({ items });
    logic.next(); // 目标 1 被禁用 → no-op
    expect(logic.getState().value).toBe(0);
    logic.prev(); // 越界
    expect(logic.getState().value).toBe(0);
    logic.select(2);
    logic.next();
    expect(logic.getState().value).toBe(3);
    logic.prev();
    logic.prev(); // 目标 1 被禁用 → no-op
    expect(logic.getState().value).toBe(2);
  });

  it('运行时变更 items / direction / status 触发通知', () => {
    const logic = createStepsLogic({ items });
    const seen: StepsStateLite[] = [];
    logic.subscribe((s) => seen.push(s));
    logic.updateOptions({ direction: 'vertical', status: 'error' });
    expect(seen).toHaveLength(1);
    expect(seen[0]).toMatchObject({ direction: 'vertical', status: 'error' });
  });
});

type StepsStateLite = { direction: string; status: string | undefined };
