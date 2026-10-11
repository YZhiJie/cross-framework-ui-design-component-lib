import { describe, expect, it, vi } from 'vitest';
import { createInputNumberLogic } from '../create-input-number-logic';

describe('createInputNumberLogic', () => {
  it('初始状态正确（null / 无边界 / step 1 / 无精度）', () => {
    const logic = createInputNumberLogic();
    expect(logic.getState()).toEqual({
      value: null,
      disabled: false,
      min: -Infinity,
      max: Infinity,
      step: 1,
      precision: null,
    });
  });

  it('defaultValue 收敛为初始值', () => {
    expect(createInputNumberLogic({ defaultValue: 5 }).getState().value).toBe(5);
  });

  it('非法 defaultValue（NaN / 非有限）回退 null', () => {
    expect(createInputNumberLogic({ defaultValue: Number.NaN }).getState().value).toBeNull();
    expect(
      createInputNumberLogic({ defaultValue: Number.POSITIVE_INFINITY }).getState().value,
    ).toBeNull();
  });

  it('初始值按 min/max clamp', () => {
    const logic = createInputNumberLogic({ defaultValue: 99, min: 0, max: 10 });
    expect(logic.getState().value).toBe(10);
  });

  it('初始值应用 precision', () => {
    const logic = createInputNumberLogic({ defaultValue: 3.14159, precision: 2 });
    expect(logic.getState().value).toBe(3.14);
  });

  it('min > max 视为非法边界并交换', () => {
    const logic = createInputNumberLogic({ min: 10, max: 0 });
    expect(logic.getState().min).toBe(0);
    expect(logic.getState().max).toBe(10);
  });

  it('precision 非法（非整数 / 越界）回退 null', () => {
    expect(createInputNumberLogic({ precision: 1.5 }).getState().precision).toBeNull();
    expect(createInputNumberLogic({ precision: 21 }).getState().precision).toBeNull();
    expect(createInputNumberLogic({ precision: -1 }).getState().precision).toBeNull();
  });

  it('stepValue 从空值以 clamp(defaultValue ?? 0) 起步', () => {
    const onChange = vi.fn();
    const logic = createInputNumberLogic({ defaultValue: 5, step: 2, onChange });
    logic.stepValue(1);
    expect(logic.getState().value).toBe(7);
    expect(onChange).toHaveBeenCalledWith(7);
    logic.stepValue(-1);
    logic.stepValue(-1);
    expect(logic.getState().value).toBe(3);
  });

  it('stepValue 整数域运算防浮点误差（0.1 + 0.2 → 0.3）', () => {
    const logic = createInputNumberLogic({ defaultValue: 0.1, step: 0.2 });
    logic.stepValue(1);
    expect(logic.getState().value).toBe(0.3);
  });

  it('stepValue 越界 clamp，且到边界后重复步进 no-op', () => {
    const onChange = vi.fn();
    const logic = createInputNumberLogic({ defaultValue: 9, max: 10, onChange });
    logic.stepValue(1);
    expect(logic.getState().value).toBe(10);
    logic.stepValue(1);
    expect(logic.getState().value).toBe(10);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('stepValue disabled 时 no-op', () => {
    const onChange = vi.fn();
    const logic = createInputNumberLogic({ defaultValue: 5, disabled: true, onChange });
    logic.stepValue(1);
    expect(logic.getState().value).toBe(5);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('commitText 合法数字（含空白）收敛', () => {
    const onChange = vi.fn();
    const logic = createInputNumberLogic({ onChange });
    logic.commitText(' 42 ');
    expect(logic.getState().value).toBe(42);
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it('commitText 空串 / 空白提交 null', () => {
    const onChange = vi.fn();
    const logic = createInputNumberLogic({ defaultValue: 5, onChange });
    logic.commitText('');
    expect(logic.getState().value).toBeNull();
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('commitText 非法输入回退 null（对齐 DatePicker 非法契约风格）', () => {
    const onChange = vi.fn();
    const logic = createInputNumberLogic({ defaultValue: 5, onChange });
    logic.commitText('abc');
    expect(logic.getState().value).toBeNull();
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('commitText 应用 clamp 与 precision', () => {
    const logic = createInputNumberLogic({ min: 0, precision: 2 });
    logic.commitText('-5');
    expect(logic.getState().value).toBe(0);
    logic.commitText('3.14159');
    expect(logic.getState().value).toBe(3.14);
  });

  it('受控模式：stepValue 仅回调不改内部状态', () => {
    const onChange = vi.fn();
    const logic = createInputNumberLogic({ value: 5, onChange });
    logic.stepValue(1);
    expect(logic.getState().value).toBe(5);
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('受控 null 是有效受控值：commitText 仅回调', () => {
    const onChange = vi.fn();
    const logic = createInputNumberLogic({ value: null, onChange });
    logic.commitText('7');
    expect(logic.getState().value).toBeNull();
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('updateOptions 受控值同步（含 null）', () => {
    const logic = createInputNumberLogic({ defaultValue: 1 });
    logic.updateOptions({ value: 9 });
    expect(logic.getState().value).toBe(9);
    logic.updateOptions({ value: null });
    expect(logic.getState().value).toBeNull();
  });

  it('updateOptions 边界 / 精度变化时对当前值重新收敛', () => {
    const logic = createInputNumberLogic({ defaultValue: 9 });
    logic.updateOptions({ max: 5 });
    expect(logic.getState().value).toBe(5);
    logic.updateOptions({ precision: 0 });
    expect(logic.getState().value).toBe(5);
  });

  it('updateOptions step 收敛为正数', () => {
    const logic = createInputNumberLogic();
    logic.updateOptions({ step: 0 });
    expect(logic.getState().step).toBe(1);
    logic.updateOptions({ step: 3 });
    expect(logic.getState().step).toBe(3);
  });

  it('updateOptions 后 disabled 守卫生效', () => {
    const onChange = vi.fn();
    const logic = createInputNumberLogic({ defaultValue: 5, onChange });
    logic.updateOptions({ disabled: true });
    logic.stepValue(1);
    logic.commitText('9');
    expect(logic.getState().value).toBe(5);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('subscribe 通知状态变更，getState 返回快照', () => {
    const listener = vi.fn();
    const logic = createInputNumberLogic({});
    logic.subscribe(listener);
    logic.commitText('1');
    expect(listener).toHaveBeenCalledTimes(1);
    const snapshot = logic.getState();
    logic.commitText('2');
    expect(snapshot.value).toBe(1);
  });
});
