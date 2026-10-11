/**
 * Input - React 19 适配层
 *
 * 使用 ref-as-prop + useSyncExternalStore 桥接 @xui/shared 逻辑。
 * 支持受控（value prop）/ 非受控（defaultValue）双模式。
 * 通过 useImperativeHandle 暴露 focus / blur / clear。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import type { ChangeEvent, FocusEvent, InputEvent, ReactNode, Ref } from 'react';
import type { InputProps } from '@xui/core';
import { createInputLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { InputLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Input 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type InputComponentProps = InputProps & {
  /** 额外内容（一般不使用，保留以兼容 children 透传） */
  children?: ReactNode;
  /** 自定义前置内容 */
  renderPrefix?: () => ReactNode;
  /** 自定义后置内容 */
  renderSuffix?: () => ReactNode;
  /** 自定义清除图标（默认渲染内联 SVG） */
  renderClearIcon?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<InputRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface InputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

export function Input(props: InputComponentProps) {
  const {
    type: inputType = 'text',
    value,
    defaultValue,
    placeholder,
    disabled = false,
    readonly = false,
    maxLength,
    clearable = false,
    onInput,
    onChange,
    onFocus,
    onBlur,
    onClear,
    renderPrefix,
    renderSuffix,
    renderClearIcon,
    ref,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  // 逻辑实例只创建一次：value 提供即受控，否则用 defaultValue 非受控
  const logicRef = useRef<InputLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createInputLogic({
      value,
      defaultValue,
      disabled,
      readonly,
      onInput: (v) => onInput?.(v),
      onChange: (v) => onChange?.(v),
      onFocus: (event) => onFocus?.(event),
      onBlur: (event) => onBlur?.(event),
      onClear: () => onClear?.(),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层
  useEffect(() => {
    logic.updateOptions({
      value,
      disabled,
      readonly,
      onInput: (v) => onInput?.(v),
      onChange: (v) => onChange?.(v),
      onFocus: (event) => onFocus?.(event),
      onBlur: (event) => onBlur?.(event),
      onClear: () => onClear?.(),
    });
  }, [logic, value, disabled, readonly, onInput, onChange, onFocus, onBlur, onClear]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => logic.handleClear(),
    }),
    [logic],
  );

  // onInput 在 React 19 中触发 InputEvent（target 仅为 EventTarget，无 value），
  // 故取 currentTarget.value（currentTarget 类型为 EventTarget & HTMLInputElement）。
  const handleInputEvent = (e: InputEvent<HTMLInputElement>) => {
    logic.handleInput(e.currentTarget.value);
  };
  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    logic.handleChange(e.currentTarget.value);
  };
  const handleFocusEvent = (e: FocusEvent<HTMLInputElement>) => {
    logic.handleFocus(e.nativeEvent);
  };
  const handleBlurEvent = (e: FocusEvent<HTMLInputElement>) => {
    logic.handleBlur(e.nativeEvent);
  };
  const handleClearEvent = () => {
    logic.handleClear();
  };

  const showClear = clearable && !!state.value && !state.disabled && !state.readonly;

  return (
    <div
      className={cn('xui-input', {
        'is-focused': state.focused,
        'is-disabled': state.disabled,
        'is-readonly': state.readonly,
      })}
    >
      {renderPrefix && <span className="xui-input__prefix">{renderPrefix()}</span>}
      <input
        ref={inputRef}
        className="xui-input__inner"
        type={inputType}
        value={state.value}
        placeholder={placeholder}
        disabled={state.disabled}
        readOnly={state.readonly}
        maxLength={maxLength}
        onInput={handleInputEvent}
        onChange={handleChangeEvent}
        onFocus={handleFocusEvent}
        onBlur={handleBlurEvent}
      />
      {showClear && (
        <button
          type="button"
          className="xui-input__clear"
          tabIndex={0}
          onClick={handleClearEvent}
          aria-label="clear"
        >
          {renderClearIcon ? renderClearIcon() : <ClearIcon />}
        </button>
      )}
      {renderSuffix && <span className="xui-input__suffix">{renderSuffix()}</span>}
    </div>
  );
}

/** 清除图标（数据来自 @xui/icons，与 Vue 端圆圈 X 样式一致） */
function ClearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      dangerouslySetInnerHTML={{ __html: icons.clear }}
    />
  );
}
