/**
 * FormItem - React 19 适配层
 *
 * 通过 useContext 获取 Form context，注册字段（name + rules）。
 * 使用 cloneElement 向子元素注入 value / onChange / onBlur / disabled，
 * 实现自动双向绑定——用户无需手动绑定 value 与事件。
 * 渲染标签、校验错误、额外提示。
 */

import {
  Children,
  cloneElement,
  useEffect,
  useImperativeHandle,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import type { FormItemProps, FormItemRef } from '@xui-design/core';
import type { ValidationRule, ValidationTrigger } from '@xui-design/shared';
import { hasRequiredRule } from '@xui-design/shared';
import { useFormContext } from './Form';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** FormItem 组件 Props */
export type FormItemComponentProps = Omit<FormItemProps, 'className' | 'style' | 'rules'> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  rules?: ValidationRule[];
  ref?: Ref<FormItemRef>;
};

export function FormItem(props: FormItemComponentProps) {
  const {
    name,
    label,
    rules,
    required = false,
    validateFirst = false,
    hidden = false,
    extra,
    labelAlign = 'right',
    className,
    style,
    children,
    ref,
  } = props;

  const ctx = useFormContext();

  // 注册 / 注销字段
  useEffect(() => {
    if (name && ctx) {
      ctx.logic.registerField(name, rules ?? []);
    }
    return () => {
      if (name && ctx) {
        ctx.logic.unregisterField(name);
      }
    };
  }, [name, ctx, rules]);

  // 订阅表单状态（用于触发本 FormItem 重渲染）
  const state = useLogicState(
    ctx ? ctx.logic.subscribe : () => () => {},
    ctx
      ? ctx.logic.getState
      : () => ({
          values: {} as Record<string, unknown>,
          errors: {} as Record<string, string[]>,
          validating: false,
          submitting: false,
          disabled: false,
          readonly: false,
        }),
  );

  const fieldValue = name ? state.values[name] : undefined;
  const fieldErrors = name ? (state.errors[name] ?? []) : [];
  const fieldValidating = state.validating;
  const isRequired = required || hasRequiredRule(rules);
  const isDisabled = ctx?.disabled ?? false;
  const isReadonly = ctx?.readonly ?? false;

  // 值变更处理
  const handleValueChange = (value: unknown) => {
    if (!name || !ctx) return;
    ctx.logic.setFieldValue(name, value);
    ctx.logic.validateField(name, 'change');
  };

  // 失焦处理
  const handleBlur = () => {
    if (!name || !ctx) return;
    ctx.logic.validateField(name, 'blur');
  };

  // 克隆子元素并注入 props
  const injectedChild = (() => {
    if (!children) return null;
    const child = Children.only(children) as React.ReactElement<Record<string, unknown>>;
    if (!child) return null;

    const childProps = child.props as Record<string, unknown>;

    return cloneElement(child, {
      value: fieldValue,
      disabled: isDisabled || undefined,
      readonly: isReadonly || undefined,
      onUpdateValue: (v: unknown) => {
        handleValueChange(v);
        if (typeof childProps.onUpdateValue === 'function') childProps.onUpdateValue(v);
      },
      onChange: (v: unknown) => {
        handleValueChange(v);
        if (typeof childProps.onChange === 'function') childProps.onChange(v);
      },
      onBlur: (e: unknown) => {
        handleBlur();
        if (typeof childProps.onBlur === 'function') childProps.onBlur(e);
      },
    });
  })();

  // 命令式 API
  useImperativeHandle(
    ref,
    () => ({
      validate: (triggerArg?: ValidationTrigger) => {
        if (!name || !ctx) return Promise.resolve([]);
        return ctx.logic.validateField(name, triggerArg);
      },
      clearValidation: () => {
        if (!name || !ctx) return;
        ctx.logic.clearValidate([name]);
      },
      resetField: () => {
        if (!name || !ctx) return;
        ctx.logic.resetFields([name]);
      },
    }),
    [name, ctx],
  );

  if (hidden) return null;

  // validateFirst 仅影响错误展示数量，目前已通过 fieldErrors 体现
  void validateFirst;

  return (
    <div
      className={cn(
        'xui-form-item',
        `xui-form-item--label-${ctx?.labelPosition ?? 'right'}`,
        {
          'is-error': fieldErrors.length > 0,
          'is-required': isRequired,
          'is-validating': fieldValidating,
        },
        className,
      )}
      style={style as CSSProperties}
    >
      {label !== undefined && (
        <label
          className={cn('xui-form-item__label', `xui-form-item__label--${labelAlign}`)}
          style={(() => {
            const width = ctx?.labelWidth;
            if (width === undefined) return undefined;
            return {
              width: typeof width === 'number' ? `${width}px` : width,
              flexShrink: 0,
            } as CSSProperties;
          })()}
        >
          {label}
        </label>
      )}
      <div className="xui-form-item__content">
        {injectedChild}
        {extra && <div className="xui-form-item__extra">{extra}</div>}
        {fieldErrors.length > 0 && (
          <div className="xui-form-item__error">
            {fieldErrors[0]}
            {fieldErrors.length > 1 && (
              <span className="xui-form-item__error-count">(+{fieldErrors.length - 1})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
