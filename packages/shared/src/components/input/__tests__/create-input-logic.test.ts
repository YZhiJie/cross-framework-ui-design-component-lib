import { describe, it, expect, vi } from 'vitest';
import { createInputLogic } from '../create-input-logic';

describe('createInputLogic', () => {
  describe('初始化', () => {
    it('默认状态为空值、未聚焦、非禁用、非只读', () => {
      const logic = createInputLogic();
      expect(logic.getState()).toEqual({
        value: '',
        focused: false,
        disabled: false,
        readonly: false,
      });
    });

    it('接受 defaultValue', () => {
      const logic = createInputLogic({ defaultValue: 'hello' });
      expect(logic.getState().value).toBe('hello');
    });

    it('value 优先于 defaultValue', () => {
      const logic = createInputLogic({ value: 'controlled', defaultValue: 'uncontrolled' });
      expect(logic.getState().value).toBe('controlled');
    });

    it('接受 disabled 和 readonly', () => {
      const logic = createInputLogic({ disabled: true, readonly: true });
      expect(logic.getState().disabled).toBe(true);
      expect(logic.getState().readonly).toBe(true);
    });
  });

  describe('getState', () => {
    it('返回浅拷贝快照', () => {
      const logic = createInputLogic({ defaultValue: 'x' });
      const snap = logic.getState();
      snap.value = 'y';
      expect(logic.getState().value).toBe('x');
    });
  });

  describe('subscribe', () => {
    it('状态变更时通知订阅者', () => {
      const logic = createInputLogic();
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.updateOptions({ disabled: true });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('返回取消订阅函数', () => {
      const logic = createInputLogic();
      const listener = vi.fn();
      const unsub = logic.subscribe(listener);

      logic.updateOptions({ disabled: true });
      expect(listener).toHaveBeenCalledTimes(1);

      unsub();
      logic.updateOptions({ disabled: false });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOptions', () => {
    it('更新 value', () => {
      const logic = createInputLogic();
      logic.updateOptions({ value: 'new' });
      expect(logic.getState().value).toBe('new');
    });

    it('更新 disabled', () => {
      const logic = createInputLogic();
      logic.updateOptions({ disabled: true });
      expect(logic.getState().disabled).toBe(true);
    });

    it('更新 readonly', () => {
      const logic = createInputLogic();
      logic.updateOptions({ readonly: true });
      expect(logic.getState().readonly).toBe(true);
    });

    it('更新所有回调', () => {
      const logic = createInputLogic();
      const onInput = vi.fn();
      const onChange = vi.fn();
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      const onClear = vi.fn();

      logic.updateOptions({ onInput, onChange, onFocus, onBlur, onClear });
      logic.handleInput('a');
      logic.handleChange('b');
      logic.handleFocus({} as FocusEvent);
      logic.handleBlur({} as FocusEvent);
      logic.handleClear();

      expect(onInput).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('值未变化时不触发通知', () => {
      const logic = createInputLogic({ disabled: true });
      const listener = vi.fn();
      logic.subscribe(listener);
      logic.updateOptions({ disabled: true });
      expect(listener).not.toHaveBeenCalled();
    });

    it('undefined 值不触发状态变更', () => {
      const logic = createInputLogic({ value: 'x' });
      const listener = vi.fn();
      logic.subscribe(listener);
      logic.updateOptions({ value: undefined });
      expect(listener).not.toHaveBeenCalled();
      expect(logic.getState().value).toBe('x');
    });
  });

  describe('handleInput - 非受控模式', () => {
    it('更新内部 value 并触发 onInput', () => {
      const onInput = vi.fn();
      const logic = createInputLogic({ defaultValue: '', onInput });
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.handleInput('typed');
      expect(logic.getState().value).toBe('typed');
      expect(onInput).toHaveBeenCalledWith('typed');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('disabled 时不触发', () => {
      const onInput = vi.fn();
      const logic = createInputLogic({ disabled: true, onInput });
      logic.handleInput('x');
      expect(onInput).not.toHaveBeenCalled();
      expect(logic.getState().value).toBe('');
    });

    it('readonly 时不触发', () => {
      const onInput = vi.fn();
      const logic = createInputLogic({ readonly: true, onInput });
      logic.handleInput('x');
      expect(onInput).not.toHaveBeenCalled();
    });
  });

  describe('handleInput - 受控模式', () => {
    it('不更新内部 value，只触发 onInput', () => {
      const onInput = vi.fn();
      const logic = createInputLogic({ value: 'initial', onInput });
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.handleInput('typed');
      expect(logic.getState().value).toBe('initial');
      expect(onInput).toHaveBeenCalledWith('typed');
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('handleChange', () => {
    it('触发 onChange 回调', () => {
      const onChange = vi.fn();
      const logic = createInputLogic({ onChange });
      logic.handleChange('committed');
      expect(onChange).toHaveBeenCalledWith('committed');
    });

    it('disabled 时不触发', () => {
      const onChange = vi.fn();
      const logic = createInputLogic({ disabled: true, onChange });
      logic.handleChange('x');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('readonly 时不触发', () => {
      const onChange = vi.fn();
      const logic = createInputLogic({ readonly: true, onChange });
      logic.handleChange('x');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('handleFocus / handleBlur', () => {
    it('handleFocus 设置 focused=true 并通知', () => {
      const onFocus = vi.fn();
      const logic = createInputLogic({ onFocus });
      const listener = vi.fn();
      logic.subscribe(listener);

      const event = {} as FocusEvent;
      logic.handleFocus(event);
      expect(logic.getState().focused).toBe(true);
      expect(onFocus).toHaveBeenCalledWith(event);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('handleBlur 设置 focused=false 并通知', () => {
      const onBlur = vi.fn();
      const logic = createInputLogic({ onBlur });
      const listener = vi.fn();
      logic.subscribe(listener);

      // 先 focus 再 blur
      logic.handleFocus({} as FocusEvent);
      listener.mockClear();

      const event = {} as FocusEvent;
      logic.handleBlur(event);
      expect(logic.getState().focused).toBe(false);
      expect(onBlur).toHaveBeenCalledWith(event);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleClear', () => {
    it('非受控模式清空 value 并触发 onInput 和 onClear', () => {
      const onInput = vi.fn();
      const onClear = vi.fn();
      const logic = createInputLogic({ defaultValue: 'text', onInput, onClear });
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.handleClear();
      expect(logic.getState().value).toBe('');
      expect(onInput).toHaveBeenCalledWith('');
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('受控模式不更新内部 value 但触发回调', () => {
      const onInput = vi.fn();
      const onClear = vi.fn();
      const logic = createInputLogic({ value: 'controlled', onInput, onClear });
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.handleClear();
      expect(logic.getState().value).toBe('controlled');
      expect(onInput).toHaveBeenCalledWith('');
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(listener).not.toHaveBeenCalled();
    });

    it('disabled 时不触发', () => {
      const onClear = vi.fn();
      const logic = createInputLogic({ disabled: true, onClear });
      logic.handleClear();
      expect(onClear).not.toHaveBeenCalled();
    });

    it('readonly 时不触发', () => {
      const onClear = vi.fn();
      const logic = createInputLogic({ readonly: true, onClear });
      logic.handleClear();
      expect(onClear).not.toHaveBeenCalled();
    });
  });

  describe('通过 updateOptions 从非受控切为受控后的行为', () => {
    it('初始受控标志在创建时确定，不随 updateOptions 改变', () => {
      const logic = createInputLogic({ defaultValue: 'a' });
      // 非受控：handleInput 会更新内部 value
      logic.handleInput('b');
      expect(logic.getState().value).toBe('b');

      // 用 updateOptions 设 value 后仍然是非受控模式
      logic.updateOptions({ value: 'c' });
      expect(logic.getState().value).toBe('c');

      // handleInput 仍然更新内部 value（因为初始 controlled=false）
      logic.handleInput('d');
      expect(logic.getState().value).toBe('d');
    });
  });
});
