/**
 * Form 纯逻辑工厂
 *
 * 状态：values / errors / validating / submitting / disabled / readonly
 * 操作：setFieldValue / getFieldValue / getFieldsValue / setFieldsValue /
 *       validateField / validate / resetFields / clearValidate / submit /
 *       registerField / unregisterField
 *
 * 字段注册机制：FormItem 挂载时调用 registerField（name, rules），
 * rules 合并：Form 级 rules[name] + FormItem 级 rules（FormItem 优先在前）。
 * 校验引擎复用 validators.ts 的 execRule，支持同步/异步、条件校验、跨字段校验。
 */

import type { LogicInstance, StateListener } from '../../types';
import { validateFieldRules, hasRequiredRule } from './validators';
import type {
  FormValues,
  FormErrors,
  FormValidationResult,
  ValidationRule,
  ValidationTrigger,
} from './validators';

export type {
  FormValues,
  FormErrors,
  FormValidationResult,
  ValidationRule,
  ValidationTrigger,
  ValidationRuleType,
  CustomValidator,
  FieldValidationResult,
} from './validators';

export { rules as formRules, execRule, validateFieldRules } from './validators';

/** Form 逻辑配置（由适配层从 Props 中提取注入） */
export type FormLogicOptions = {
  initialValues?: FormValues;
  rules?: Record<string, ValidationRule[]>;
  disabled?: boolean;
  readonly?: boolean;
  validateTrigger?: ValidationTrigger | ValidationTrigger[];
  onSubmit?: (values: FormValues) => void | Promise<void>;
  onSubmitFail?: (errors: FormErrors) => void;
  onValuesChange?: (changedValues: FormValues, allValues: FormValues) => void;
};

/** Form 状态快照 */
export type FormState = {
  values: FormValues;
  errors: FormErrors;
  validating: boolean;
  submitting: boolean;
  disabled: boolean;
  readonly: boolean;
};

/** Form 逻辑实例 */
export interface FormLogicInstance extends LogicInstance<FormLogicOptions, FormState> {
  setFieldValue: (name: string, value: unknown) => void;
  getFieldValue: (name: string) => unknown;
  getFieldsValue: () => FormValues;
  setFieldsValue: (values: FormValues) => void;
  validateField: (name: string, trigger?: ValidationTrigger) => Promise<string[]>;
  validate: (trigger?: ValidationTrigger) => Promise<FormValidationResult>;
  resetFields: (names?: string[]) => void;
  clearValidate: (names?: string[]) => void;
  submit: () => Promise<FormValidationResult>;
  registerField: (name: string, rules?: ValidationRule[]) => void;
  unregisterField: (name: string) => void;
}

export function createFormLogic(options: FormLogicOptions = {}): FormLogicInstance {
  const initial: FormValues = { ...(options.initialValues ?? {}) };

  const state: FormState = {
    values: { ...initial },
    errors: {},
    validating: false,
    submitting: false,
    disabled: options.disabled ?? false,
    readonly: options.readonly ?? false,
  };

  let formRules: Record<string, ValidationRule[]> = { ...(options.rules ?? {}) };
  let onSubmit = options.onSubmit;
  let onSubmitFail = options.onSubmitFail;
  let onValuesChange = options.onValuesChange;

  /** 字段注册表：name -> 局部 rules（来自 FormItem） */
  const fieldRegistry = new Map<string, ValidationRule[]>();

  const listeners = new Set<StateListener<FormState>>();

  const notify = () => {
    const snapshot: FormState = {
      values: { ...state.values },
      errors: Object.fromEntries(Object.entries(state.errors).map(([k, v]) => [k, [...v]])),
      validating: state.validating,
      submitting: state.submitting,
      disabled: state.disabled,
      readonly: state.readonly,
    };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 合并 Form 级 + FormItem 级规则（FormItem 优先在前） */
  const getMergedRules = (name: string): ValidationRule[] => {
    const itemRules = fieldRegistry.get(name) ?? [];
    const formLevelRules = formRules[name] ?? [];
    return [...itemRules, ...formLevelRules];
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({
      values: { ...state.values },
      errors: Object.fromEntries(Object.entries(state.errors).map(([k, v]) => [k, [...v]])),
      validating: state.validating,
      submitting: state.submitting,
      disabled: state.disabled,
      readonly: state.readonly,
    }),

    updateOptions(next) {
      let changed = false;

      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        changed = true;
      }
      if (next.readonly !== undefined && next.readonly !== state.readonly) {
        state.readonly = next.readonly;
        changed = true;
      }
      if (next.rules !== undefined) {
        formRules = { ...next.rules };
      }
      if (next.onSubmit !== undefined) onSubmit = next.onSubmit;
      if (next.onSubmitFail !== undefined) onSubmitFail = next.onSubmitFail;
      if (next.onValuesChange !== undefined) onValuesChange = next.onValuesChange;

      if (changed) notify();
    },

    setFieldValue(name, value) {
      if (state.values[name] === value) return;
      state.values[name] = value;
      onValuesChange?.({ [name]: value }, { ...state.values });
      notify();
    },

    getFieldValue(name) {
      return state.values[name];
    },

    getFieldsValue() {
      return { ...state.values };
    },

    setFieldsValue(values) {
      state.values = { ...state.values, ...values };
      onValuesChange?.({ ...values }, { ...state.values });
      notify();
    },

    async validateField(name, trigger) {
      const allRules = getMergedRules(name);
      if (allRules.length === 0) {
        delete state.errors[name];
        notify();
        return [];
      }

      state.validating = true;
      notify();

      const value = state.values[name];
      // 将触发配置传入校验引擎：规则自身的 trigger 与调用 trigger 都会参与过滤
      const result = await validateFieldRules(allRules, value, { ...state.values }, trigger);

      state.validating = false;
      if (result.errors.length > 0) {
        state.errors[name] = result.errors;
      } else {
        delete state.errors[name];
      }
      notify();
      return result.errors;
    },

    async validate(trigger) {
      const allNames = new Set([...Object.keys(formRules), ...fieldRegistry.keys()]);
      const errors: FormErrors = {};
      let valid = true;

      state.validating = true;
      notify();

      for (const name of allNames) {
        const allRules = getMergedRules(name);
        if (allRules.length === 0) continue;
        const value = state.values[name];
        const result = await validateFieldRules(allRules, value, { ...state.values }, trigger);
        if (result.errors.length > 0) {
          errors[name] = result.errors;
          valid = false;
        }
      }

      state.validating = false;
      state.errors = errors;
      notify();

      return { valid, errors, values: { ...state.values } };
    },

    resetFields(names) {
      if (names && names.length > 0) {
        for (const name of names) {
          if (initial[name] !== undefined) {
            state.values[name] = initial[name];
          } else {
            delete state.values[name];
          }
          delete state.errors[name];
        }
      } else {
        state.values = { ...initial };
        state.errors = {};
      }
      notify();
    },

    clearValidate(names) {
      if (names && names.length > 0) {
        for (const name of names) {
          delete state.errors[name];
        }
      } else {
        state.errors = {};
      }
      notify();
    },

    async submit() {
      const result = await this.validate('submit');
      if (result.valid) {
        state.submitting = true;
        notify();
        try {
          await onSubmit?.(result.values);
        } finally {
          state.submitting = false;
          notify();
        }
      } else {
        onSubmitFail?.(result.errors);
      }
      return result;
    },

    registerField(name, rules) {
      if (rules && rules.length > 0) {
        fieldRegistry.set(name, rules);
      } else {
        fieldRegistry.set(name, []);
      }
    },

    unregisterField(name) {
      fieldRegistry.delete(name);
      delete state.errors[name];
      notify();
    },
  };
}

/** 便捷导出：判断规则是否含 required（供 FormItem 推断必填星号） */
export { hasRequiredRule };
