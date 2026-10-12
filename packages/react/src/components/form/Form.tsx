/**
 * Form - React 19 适配层
 *
 * 通过 Context.Provider 向所有 FormItem 注入表单 context（逻辑实例 + 全局 props）。
 * 渲染原生 <form> 元素，拦截 submit 事件 → 调用 logic.submit()。
 * 通过 ref-as-prop 暴露 FormRef 命令式 API。
 */

import {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { createFormLogic } from '@xui-design/shared';
import type { FormLogicInstance } from '@xui-design/shared';
import type { FormProps, FormRef } from '@xui-design/core';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** 表单 Context 值 */
export interface FormContextValue {
  logic: FormLogicInstance;
  disabled: boolean;
  readonly: boolean;
  labelWidth?: string | number;
  labelPosition?: 'left' | 'right' | 'top';
}

/** React Context（默认值为 undefined，FormItem 通过 useContext 消费） */
const FormContext = createContext<FormContextValue | undefined>(undefined);

/** 供 FormItem 调用的 hook */
export function useFormContext(): FormContextValue | undefined {
  return useContext(FormContext);
}

/** Form 组件 Props */
export type FormComponentProps = Omit<
  FormProps,
  'onSubmit' | 'onSubmitFail' | 'onValuesChange' | 'className' | 'style'
> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  onSubmitFail?: (errors: Record<string, string[]>) => void;
  onValuesChange?: (
    changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>,
  ) => void;
  ref?: Ref<FormRef>;
};

export function Form(props: FormComponentProps) {
  const {
    initialValues,
    rules,
    disabled = false,
    readonly = false,
    labelWidth,
    labelPosition = 'right',
    validateTrigger,
    className,
    style,
    onSubmit,
    onSubmitFail,
    onValuesChange,
    children,
    ref,
  } = props;

  // 逻辑实例只创建一次
  const logicRef = useRef<FormLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createFormLogic({
      initialValues,
      rules,
      disabled,
      readonly,
      validateTrigger,
      onSubmit: (values) => onSubmit?.(values),
      onSubmitFail: (errors) => onSubmitFail?.(errors),
      onValuesChange: (changed, all) => onValuesChange?.(changed, all),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层
  useEffect(() => {
    logic.updateOptions({
      disabled,
      readonly,
      rules,
      onSubmit: (values) => onSubmit?.(values),
      onSubmitFail: (errors) => onSubmitFail?.(errors),
      onValuesChange: (changed, all) => onValuesChange?.(changed, all),
    });
  }, [logic, disabled, readonly, rules, onSubmit, onSubmitFail, onValuesChange]);

  // 订阅逻辑层状态（用于触发表单级重渲染）
  const state = useLogicState(logic.subscribe, logic.getState);

  // 命令式 API
  useImperativeHandle(
    ref,
    () => ({
      validate: (trigger) => logic.validate(trigger),
      validateField: (name, trigger) => logic.validateField(name, trigger),
      getFieldValue: (name) => logic.getFieldValue(name),
      getFieldsValue: () => logic.getFieldsValue(),
      setFieldValue: (name, value) => logic.setFieldValue(name, value),
      setFieldsValue: (values) => logic.setFieldsValue(values),
      resetFields: (names) => logic.resetFields(names),
      clearValidate: (names) => logic.clearValidate(names),
      submit: () => logic.submit(),
    }),
    [logic],
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logic.submit();
  };

  const contextValue: FormContextValue = {
    logic,
    disabled: state.disabled,
    readonly: state.readonly,
    labelWidth,
    labelPosition,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        className={cn('xui-form', className)}
        style={style as CSSProperties}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
