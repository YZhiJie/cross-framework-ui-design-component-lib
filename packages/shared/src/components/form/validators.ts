/**
 * 表单校验引擎 —— 纯逻辑层
 *
 * 类型定义（ValidationRule / FormValues 等）在此本地定义，
 * @xui-design/core 复用/对齐（遵循 shared 不依赖 core 的约定）。
 * 内置规则：required / email / phone / number / length / regex / url / custom
 * 支持同步与异步校验、条件校验（when）、跨字段校验（validator 可访问全部值）。
 */

/** 校验触发时机 */
export type ValidationTrigger = 'change' | 'blur' | 'submit';

/** 表单值映射 */
export type FormValues = Record<string, unknown>;

/** 表单错误集合（字段名 -> 错误信息数组） */
export type FormErrors = Record<string, string[]>;

/** 单字段校验结果 */
export interface FieldValidationResult {
  valid: boolean;
  errors: string[];
}

/** 表单校验结果 */
export interface FormValidationResult {
  valid: boolean;
  errors: FormErrors;
  values: FormValues;
}

/** 自定义校验函数：返回 true / string / Promise */
export type CustomValidator = (
  value: unknown,
  values: FormValues,
) => boolean | string | Promise<boolean | string>;

/** 内置校验规则类型 */
export type ValidationRuleType =
  'required' | 'email' | 'phone' | 'number' | 'length' | 'regex' | 'url' | 'custom';

/** 校验规则 */
export type ValidationRule = {
  /** 规则类型（省略时必须有 validator 字段走自定义） */
  type?: ValidationRuleType;
  /** 错误提示信息（覆盖内置默认提示） */
  message?: string;
  /** 触发时机（覆盖表单级 validateTrigger） */
  trigger?: ValidationTrigger;
  // length / number 规则参数
  /** 最小值（number）或最小长度（length） */
  min?: number;
  /** 最大值（number）或最大长度（length） */
  max?: number;
  /** 精确长度（length）或精确值（number） */
  exact?: number;
  /** regex 规则的正则（string 或 RegExp） */
  pattern?: string | RegExp;
  /** custom 规则的自定义校验函数 */
  validator?: CustomValidator;
  /** 条件校验：仅当返回 true 时执行本条规则 */
  when?: (values: FormValues) => boolean;
};

/** 判断值是否为"空"（required 规则用） */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
}

/** 将 RegExp | string 统一为 RegExp */
function toRegExp(pattern: string | RegExp): RegExp {
  return typeof pattern === 'string' ? new RegExp(pattern) : pattern;
}

/** 内置默认错误提示文案 */
const defaultMessages = {
  required: '该字段为必填项',
  email: '请输入有效的邮箱地址',
  phone: '请输入有效的手机号码',
  number: '请输入有效的数字',
  url: '请输入有效的 URL',
  length: '长度不符合要求',
  regex: '格式不正确',
  custom: '校验未通过',
};

// ────────── 内置规则实现 ──────────

function validateRequired(value: unknown): boolean {
  return !isEmpty(value);
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function validateEmail(value: unknown): boolean {
  if (isEmpty(value)) return true; // 非必填时空值放行
  return typeof value === 'string' && emailRegex.test(value);
}

const phoneRegex = /^1[3-9]\d{9}$/;
function validatePhone(value: unknown): boolean {
  if (isEmpty(value)) return true;
  return typeof value === 'string' && phoneRegex.test(value);
}

function validateNumber(value: unknown, min?: number, max?: number, exact?: number): boolean {
  if (isEmpty(value)) return true;
  const num = Number(value);
  if (Number.isNaN(num)) return false;
  if (exact !== undefined && num !== exact) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
}

function validateLength(value: unknown, min?: number, max?: number, exact?: number): boolean {
  if (isEmpty(value)) return true;
  const len = Array.isArray(value) ? value.length : String(value).length;
  if (exact !== undefined && len !== exact) return false;
  if (min !== undefined && len < min) return false;
  if (max !== undefined && len > max) return false;
  return true;
}

function validateRegex(value: unknown, pattern: string | RegExp): boolean {
  if (isEmpty(value)) return true;
  return toRegExp(pattern).test(String(value));
}

const urlRegex = /^https?:\/\/[^\s]+$/;
function validateUrl(value: unknown): boolean {
  if (isEmpty(value)) return true;
  return typeof value === 'string' && urlRegex.test(value);
}

/**
 * 执行单条规则校验，返回错误信息（通过则返回 null）
 * trigger 过滤：若规则有 trigger 且与传入 trigger 不匹配则跳过
 */
export async function execRule(
  rule: ValidationRule,
  value: unknown,
  values: FormValues,
  trigger?: ValidationTrigger,
): Promise<string | null> {
  // trigger 过滤：submit 时机不过滤（执行所有规则）；
  // 否则规则有 trigger 且与调用 trigger 不匹配时跳过
  if (rule.trigger && trigger && trigger !== 'submit' && rule.trigger !== trigger) return null;

  // 条件校验
  if (rule.when && !rule.when(values)) return null;

  const getMessage = () => rule.message ?? defaultMessages[rule.type ?? 'custom'];

  switch (rule.type) {
    case 'required':
      return validateRequired(value) ? null : getMessage();

    case 'email':
      return validateEmail(value) ? null : getMessage();

    case 'phone':
      return validatePhone(value) ? null : getMessage();

    case 'number':
      return validateNumber(value, rule.min, rule.max, rule.exact) ? null : getMessage();

    case 'length':
      return validateLength(value, rule.min, rule.max, rule.exact) ? null : getMessage();

    case 'regex':
      if (!rule.pattern) return null;
      return validateRegex(value, rule.pattern) ? null : getMessage();

    case 'url':
      return validateUrl(value) ? null : getMessage();

    case 'custom':
    default: {
      if (!rule.validator) return null;
      // custom validator 可返回 true / string / Promise<true | string>
      const customResult = await rule.validator(value, values);
      if (customResult === true) return null;
      if (typeof customResult === 'string') return customResult;
      return getMessage();
    }
  }
}

/**
 * 校验单个字段（运行其全部规则，收集所有错误）
 * @param rules   规则数组
 * @param value   字段值
 * @param values  全部字段值（供跨字段校验）
 * @param trigger 触发时机（过滤规则）
 * @param validateFirst 仅返回第一条错误
 */
export async function validateFieldRules(
  rules: ValidationRule[],
  value: unknown,
  values: FormValues,
  trigger?: ValidationTrigger,
  validateFirst = false,
): Promise<FieldValidationResult> {
  const errors: string[] = [];
  for (const rule of rules) {
    const error = await execRule(rule, value, values, trigger);
    if (error) {
      errors.push(error);
      if (validateFirst) break;
    }
  }
  return { valid: errors.length === 0, errors };
}

/** 判断规则数组中是否含 required 规则 */
export function hasRequiredRule(rules: ValidationRule[] | undefined): boolean {
  if (!rules) return false;
  return rules.some((r) => r.type === 'required');
}

// ────────── 便捷规则工厂（供用户快速创建规则） ──────────

export const rules = {
  required: (message?: string): ValidationRule => ({ type: 'required', message }),
  email: (message?: string): ValidationRule => ({ type: 'email', message }),
  phone: (message?: string): ValidationRule => ({ type: 'phone', message }),
  number: (opts?: {
    min?: number;
    max?: number;
    exact?: number;
    message?: string;
  }): ValidationRule => ({
    type: 'number',
    ...opts,
  }),
  length: (opts?: {
    min?: number;
    max?: number;
    exact?: number;
    message?: string;
  }): ValidationRule => ({
    type: 'length',
    ...opts,
  }),
  regex: (pattern: string | RegExp, message?: string): ValidationRule => ({
    type: 'regex',
    pattern,
    message,
  }),
  url: (message?: string): ValidationRule => ({ type: 'url', message }),
  custom: (
    validator: CustomValidator,
    message?: string,
    trigger?: ValidationTrigger,
  ): ValidationRule => ({ type: 'custom', validator, message, trigger }),
};
