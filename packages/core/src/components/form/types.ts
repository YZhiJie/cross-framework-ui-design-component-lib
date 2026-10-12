/**
 * Form 契约类型
 *
 * Props / Events / Slots / State / Logic
 * Form 是复合容器组件（Form + FormItem），二者类型统一定义在此。
 * 验证规则类型也由此文件导出，供 spec 与适配层复用。
 * 逻辑层类型在 @xui-design/shared 本地定义（ValidationRule / FormValues 等），
 * core 复用/对齐（遵循 shared 不依赖 core 的约定）。
 */

import type { LogicInstance } from '../../types';
import type {
  FormValues,
  FormErrors,
  FormValidationResult,
  ValidationRule,
  ValidationTrigger,
} from '@xui-design/shared';

/** 校验触发时机 */
export type { ValidationTrigger };

/** 表单值映射 */
export type { FormValues };

/** 表单错误集合（字段名 -> 错误信息数组） */
export type { FormErrors };

/** 表单校验结果 */
export type { FormValidationResult };

/** 校验规则 */
export type { ValidationRule };

/** 表单级校验触发配置：单触发时机或数组 */
export type FormValidateTrigger = ValidationTrigger | ValidationTrigger[];

/** 标签位置 */
export type FormLabelPosition = 'left' | 'right' | 'top';

/** Form Props（Vue 与 React 共用） */
export type FormProps = {
  /** 表单初始值（非受控模式下的字段初始值） */
  initialValues?: FormValues;
  /** 字段级校验规则映射（key 为字段名，value 为规则数组） */
  rules?: Record<string, ValidationRule[]>;
  /** 全局禁用（所有 FormItem 内的子控件继承此状态） */
  disabled?: boolean;
  /** 全局只读 */
  readonly?: boolean;
  /** 标签宽度（数值按 px 处理，字符串原样输出） */
  labelWidth?: string | number;
  /** 标签位置 */
  labelPosition?: FormLabelPosition;
  /** 校验触发时机（可被 FormItem 的 trigger 覆盖） */
  validateTrigger?: FormValidateTrigger;
  /** 是否在字段校验失败时自动滚动到第一个错误字段 */
  scrollToFirstError?: boolean;
  /** 提交回调（校验通过后触发，接收表单值） */
  onSubmit?: (values: FormValues) => void | Promise<void>;
  /** 提交失败回调（校验不通过时触发，接收错误集合） */
  onSubmitFail?: (errors: FormErrors) => void;
  /** 字段值变更回调（接收变更值与全部值） */
  onValuesChange?: (changedValues: FormValues, allValues: FormValues) => void;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};

/** Form 事件契约 */
export type FormEvents = {
  submit: (values: FormValues) => void;
  submitFail: (errors: FormErrors) => void;
  valuesChange: (changedValues: FormValues, allValues: FormValues) => void;
};

/** Form 插槽契约 */
export type FormSlots = {
  /** 默认插槽（放置 FormItem 列表） */
  default: Record<string, never>;
  /** 提交按钮区域（表单底部操作区） */
  actions: Record<string, never>;
};

/** Form 状态快照（由逻辑层暴露） */
export type FormState = {
  /** 当前所有字段值 */
  values: FormValues;
  /** 当前所有字段错误（字段名 -> 错误信息数组） */
  errors: FormErrors;
  /** 是否正在校验（任一字段异步校验进行中） */
  validating: boolean;
  /** 是否正在提交 */
  submitting: boolean;
  /** 全局禁用状态 */
  disabled: boolean;
  /** 全局只读状态 */
  readonly: boolean;
};

/** Form 逻辑实例（通用接口 + 表单操作方法） */
export type FormLogic = LogicInstance<FormProps, FormState> & {
  /** 设置指定字段的值 */
  setFieldValue: (name: string, value: unknown) => void;
  /** 获取指定字段的值 */
  getFieldValue: (name: string) => unknown;
  /** 获取所有字段值 */
  getFieldsValue: () => FormValues;
  /** 批量设置字段值 */
  setFieldsValue: (values: FormValues) => void;
  /** 校验指定字段（可选触发时机过滤） */
  validateField: (name: string, trigger?: ValidationTrigger) => Promise<string[]>;
  /** 校验全部字段（可选触发时机过滤） */
  validate: (trigger?: ValidationTrigger) => Promise<FormValidationResult>;
  /** 重置字段（回到 initialValues 或清空） */
  resetFields: (names?: string[]) => void;
  /** 清除指定字段的校验错误 */
  clearValidate: (names?: string[]) => void;
  /** 提交表单（触发校验后调用 onSubmit / onSubmitFail） */
  submit: () => Promise<FormValidationResult>;
  /** 注册字段（FormItem 挂载时调用，提供字段名与局部规则） */
  registerField: (name: string, rules?: ValidationRule[]) => void;
  /** 注销字段（FormItem 卸载时调用） */
  unregisterField: (name: string) => void;
};

// ────────────────────── FormItem ──────────────────────

/** FormItem Props（Vue 与 React 共用） */
export type FormItemProps = {
  /** 字段名（与 Form 的 rules / initialValues key 对应；不设则不参与表单校验） */
  name?: string;
  /** 标签文本 */
  label?: string;
  /** 字段级校验规则（与 Form 的 rules 同名时合并，FormItem 的规则优先在前） */
  rules?: ValidationRule[];
  /** 是否必填（仅影响标签前的星号显示，实际校验仍由 rules 控制） */
  required?: boolean;
  /** 本字段校验触发时机（覆盖 Form 级 validateTrigger） */
  trigger?: FormValidateTrigger;
  /** 仅显示第一条错误（默认 false 显示全部） */
  validateFirst?: boolean;
  /** 是否隐藏该项（不渲染 DOM，用于条件表单） */
  hidden?: boolean;
  /** 额外提示文案（显示在控件下方） */
  extra?: string;
  /** 标签文本对齐方式 */
  labelAlign?: 'left' | 'right';
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};

/** FormItem 事件契约 */
export type FormItemEvents = {
  /** 字段值变更 */
  change: (value: unknown) => void;
  /** 字段失焦 */
  blur: (value: unknown) => void;
};

/** FormItem 插槽契约 */
export type FormItemSlots = {
  /** 默认插槽（放置表单控件） */
  default: Record<string, never>;
  /** 自定义标签内容 */
  label: Record<string, never>;
  /** 自定义错误提示 */
  error: Record<string, never>;
  /** 自定义额外提示 */
  extra: Record<string, never>;
};

/** FormItem 状态快照 */
export type FormItemState = {
  /** 当前字段值 */
  value: unknown;
  /** 校验错误信息数组 */
  errors: string[];
  /** 是否正在校验 */
  validating: boolean;
  /** 是否已触过校验（首次触发后为 true） */
  touched: boolean;
  /** 是否必填（从 rules 推断或显式 required） */
  required: boolean;
  /** 全局禁用 */
  disabled: boolean;
  /** 全局只读 */
  readonly: boolean;
};

/** FormItem ref 命令式 API */
export type FormItemRef = {
  /** 手动触发本字段校验 */
  validate: (trigger?: ValidationTrigger) => Promise<string[]>;
  /** 清除本字段错误 */
  clearValidation: () => void;
  /** 重置本字段值与校验状态 */
  resetField: () => void;
};

/** Form ref 命令式 API（双端统一） */
export type FormRef = {
  /** 校验全部字段 */
  validate: (trigger?: ValidationTrigger) => Promise<FormValidationResult>;
  /** 校验指定字段 */
  validateField: (name: string, trigger?: ValidationTrigger) => Promise<string[]>;
  /** 获取字段值 */
  getFieldValue: (name: string) => unknown;
  /** 获取所有字段值 */
  getFieldsValue: () => FormValues;
  /** 设置字段值 */
  setFieldValue: (name: string, value: unknown) => void;
  /** 批量设置字段值 */
  setFieldsValue: (values: FormValues) => void;
  /** 重置字段 */
  resetFields: (names?: string[]) => void;
  /** 清除校验错误 */
  clearValidate: (names?: string[]) => void;
  /** 提交表单 */
  submit: () => Promise<FormValidationResult>;
};
