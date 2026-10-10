/**
 * Input 组件测试（React 19 适配层）
 *
 * 覆盖：渲染与占位、非受控/受控双模式、onInput/onChange 回调、
 * disabled/readonly、onFocus/onBlur、clearable、ref 命令式 API（focus/blur/clear）。
 *
 * 契约说明：@xui/core 的 Input 使用 onInput（每次键入）/ onChange（值变更提交），
 * 而非 onValueChange，断言按实际契约编写。
 */

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { useLayoutEffect, useRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Input } from '../index';
import type { InputRef } from '../index';

describe('Input 组件', () => {
  afterEach(() => {
    cleanup();
  });

  describe('渲染', () => {
    it('渲染 textbox 输入框，placeholder 生效', () => {
      render(<Input placeholder="请输入" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', '请输入');
    });

    it('defaultValue 提供非受控初始值', () => {
      render(<Input defaultValue="初始值" />);
      expect(screen.getByRole('textbox')).toHaveValue('初始值');
    });

    it('type 传值生效（默认 text）', () => {
      const { container } = render(<Input type="password" />);
      expect(container.querySelector('input')).toHaveAttribute('type', 'password');
    });

    it('renderPrefix / renderSuffix 自定义前后置内容渲染', () => {
      render(
        <Input renderPrefix={() => <span>前缀</span>} renderSuffix={() => <span>后缀</span>} />,
      );
      expect(screen.getByText('前缀')).toBeInTheDocument();
      expect(screen.getByText('后缀')).toBeInTheDocument();
    });
  });

  describe('输入与回调', () => {
    it('非受控模式：键入更新值并触发 onInput', () => {
      const onInput = vi.fn();
      render(<Input defaultValue="" onInput={onInput} />);
      const input = screen.getByRole('textbox');
      fireEvent.input(input, { target: { value: 'hello' } });
      expect(input).toHaveValue('hello');
      expect(onInput).toHaveBeenCalledWith('hello');
    });

    it('受控模式：父组件经 onInput 更新 value，输入框同步显示', () => {
      function ControlledDemo() {
        const [value, setValue] = useState('a');
        return <Input value={value} onInput={setValue} />;
      }
      render(<ControlledDemo />);
      const input = screen.getByRole('textbox');
      fireEvent.input(input, { target: { value: 'ab' } });
      expect(input).toHaveValue('ab');
    });

    it('受控模式：外部更新 value 同步到输入框', () => {
      const { rerender } = render(<Input value="a" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('a');
      rerender(<Input value="b" />);
      expect(input).toHaveValue('b');
    });

    it('onChange 值变更提交回调', () => {
      const onChange = vi.fn();
      render(<Input defaultValue="a" onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ab' } });
      expect(onChange).toHaveBeenCalledWith('ab');
    });
  });

  describe('禁用与只读', () => {
    it('disabled 时输入被忽略', () => {
      const onInput = vi.fn();
      render(<Input disabled defaultValue="x" onInput={onInput} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input.closest('.xui-input')).toHaveClass('is-disabled');
      fireEvent.input(input, { target: { value: 'y' } });
      expect(input).toHaveValue('x');
      expect(onInput).not.toHaveBeenCalled();
    });

    it('readonly 时输入被忽略', () => {
      const onInput = vi.fn();
      render(<Input readonly defaultValue="x" onInput={onInput} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
      expect(input.closest('.xui-input')).toHaveClass('is-readonly');
      fireEvent.input(input, { target: { value: 'y' } });
      expect(input).toHaveValue('x');
      expect(onInput).not.toHaveBeenCalled();
    });
  });

  describe('焦点', () => {
    it('onFocus / onBlur 回调与 is-focused 类切换', () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      render(<Input onFocus={onFocus} onBlur={onBlur} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(input.closest('.xui-input')).toHaveClass('is-focused');
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(input.closest('.xui-input')).not.toHaveClass('is-focused');
    });
  });

  describe('clearable 清除', () => {
    it('有值时显示清除按钮，点击清空并触发 onClear / onInput("")', () => {
      const onClear = vi.fn();
      const onInput = vi.fn();
      render(<Input clearable defaultValue="abc" onClear={onClear} onInput={onInput} />);
      fireEvent.click(screen.getByRole('button', { name: 'clear' }));
      expect(screen.getByRole('textbox')).toHaveValue('');
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onInput).toHaveBeenCalledWith('');
    });

    it('无值时不显示清除按钮', () => {
      render(<Input clearable />);
      expect(screen.queryByRole('button', { name: 'clear' })).not.toBeInTheDocument();
    });

    it('disabled 时不显示清除按钮', () => {
      render(<Input clearable disabled defaultValue="abc" />);
      expect(screen.queryByRole('button', { name: 'clear' })).not.toBeInTheDocument();
    });

    it('renderClearIcon 自定义清除图标渲染', () => {
      render(<Input clearable defaultValue="abc" renderClearIcon={() => <span>清</span>} />);
      expect(screen.getByText('清')).toBeInTheDocument();
    });
  });

  describe('ref 命令式 API', () => {
    it('focus / blur 切换焦点，clear 清空并触发 onClear', () => {
      const ref: { current: InputRef | null } = { current: null };
      const onClear = vi.fn();
      render(<Input ref={ref} defaultValue="abc" onClear={onClear} />);
      const input = screen.getByRole('textbox');
      act(() => {
        ref.current?.focus();
      });
      expect(input).toHaveFocus();
      act(() => {
        ref.current?.blur();
      });
      expect(input).not.toHaveFocus();
      act(() => {
        ref.current?.clear();
      });
      expect(input).toHaveValue('');
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('passive effects 运行前（首次提交阶段）的交互走初始回调闭包', () => {
      const onClear = vi.fn();
      const onInput = vi.fn();
      function ClearBeforeEffects() {
        const ref = useRef<InputRef>(null);
        // useImperativeHandle 在 layout 阶段挂载，早于同步 updateOptions 的 passive effect；
        // 此处模拟用户交互先于 effects 执行，验证初始闭包可用
        useLayoutEffect(() => {
          ref.current?.clear();
        }, []);
        return <Input ref={ref} defaultValue="abc" onClear={onClear} onInput={onInput} />;
      }
      render(<ClearBeforeEffects />);
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onInput).toHaveBeenCalledWith('');
      // 注意：useSyncExternalStore 在 passive 阶段才订阅，此阶段状态变更不会触发重渲染
    });
  });
});
