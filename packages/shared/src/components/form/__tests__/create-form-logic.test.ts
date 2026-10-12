/**
 * Form 逻辑层测试
 *
 * 覆盖：
 * - 字段注册 / 注销
 * - 值读写（setFieldValue / getFieldValue / getFieldsValue / setFieldsValue）
 * - 内置校验规则（required / email / phone / number / length / regex / url / custom）
 * - 同步 / 异步校验
 * - 条件校验（when）
 * - 跨字段校验（validator 访问全部值）
 * - 触发时机过滤（trigger）
 * - resetFields / clearValidate
 * - submit（校验通过 / 失败）
 * - onValuesChange 回调
 */

import { describe, expect, it, vi } from 'vitest';
import { createFormLogic } from '../create-form-logic';
import { rules } from '../validators';

describe('createFormLogic', () => {
  it('初始化时复制 initialValues', () => {
    const logic = createFormLogic({ initialValues: { name: 'Alice', age: 30 } });
    expect(logic.getFieldValue('name')).toBe('Alice');
    expect(logic.getFieldValue('age')).toBe(30);
    expect(logic.getFieldsValue()).toEqual({ name: 'Alice', age: 30 });
  });

  it('setFieldValue 更新值并通知订阅者', () => {
    const logic = createFormLogic({ initialValues: { name: '' } });
    const listener = vi.fn();
    logic.subscribe(listener);
    logic.setFieldValue('name', 'Bob');
    expect(logic.getFieldValue('name')).toBe('Bob');
    expect(listener).toHaveBeenCalled();
  });

  it('setFieldsValue 批量更新', () => {
    const logic = createFormLogic({ initialValues: { a: 1, b: 2 } });
    logic.setFieldsValue({ a: 10, b: 20 });
    expect(logic.getFieldsValue()).toEqual({ a: 10, b: 20 });
  });

  it('onValuesChange 在值变更时触发', () => {
    const onValuesChange = vi.fn();
    const logic = createFormLogic({ initialValues: { name: '' }, onValuesChange });
    logic.setFieldValue('name', 'test');
    expect(onValuesChange).toHaveBeenCalledWith({ name: 'test' }, { name: 'test' });
  });

  // ────────── 字段注册 ──────────

  it('registerField + unregisterField', () => {
    const logic = createFormLogic();
    logic.registerField('email', [{ type: 'required' }]);
    // 注册后该字段参与校验
    expect(logic.validateField('email')).resolves.toHaveLength(1);
    logic.unregisterField('email');
    // 注销后不再校验
    expect(logic.validateField('email')).resolves.toEqual([]);
  });

  // ────────── 内置规则 ──────────

  it('required 规则校验空值', async () => {
    const logic = createFormLogic({
      initialValues: { name: '' },
      rules: { name: [rules.required('姓名必填')] },
    });
    const errors = await logic.validateField('name');
    expect(errors).toEqual(['姓名必填']);
  });

  it('required 规则放行有值', async () => {
    const logic = createFormLogic({
      initialValues: { name: 'Alice' },
      rules: { name: [rules.required()] },
    });
    const errors = await logic.validateField('name');
    expect(errors).toEqual([]);
  });

  it('email 规则校验非法邮箱', async () => {
    const logic = createFormLogic({
      initialValues: { email: 'not-an-email' },
      rules: { email: [rules.email()] },
    });
    const errors = await logic.validateField('email');
    expect(errors).toHaveLength(1);
  });

  it('email 规则放行合法邮箱', async () => {
    const logic = createFormLogic({
      initialValues: { email: 'test@example.com' },
      rules: { email: [rules.email()] },
    });
    const errors = await logic.validateField('email');
    expect(errors).toEqual([]);
  });

  it('phone 规则校验非法手机号', async () => {
    const logic = createFormLogic({
      initialValues: { phone: '12345' },
      rules: { phone: [rules.phone()] },
    });
    const errors = await logic.validateField('phone');
    expect(errors).toHaveLength(1);
  });

  it('phone 规则放行合法手机号', async () => {
    const logic = createFormLogic({
      initialValues: { phone: '13800138000' },
      rules: { phone: [rules.phone()] },
    });
    const errors = await logic.validateField('phone');
    expect(errors).toEqual([]);
  });

  it('number 规则 min/max 校验', async () => {
    const logic = createFormLogic({
      initialValues: { age: 5 },
      rules: { age: [rules.number({ min: 18, max: 100 })] },
    });
    const errors = await logic.validateField('age');
    expect(errors).toHaveLength(1);

    logic.setFieldValue('age', 50);
    const ok = await logic.validateField('age');
    expect(ok).toEqual([]);
  });

  it('length 规则 min/max 校验', async () => {
    const logic = createFormLogic({
      initialValues: { name: 'ab' },
      rules: { name: [rules.length({ min: 3, max: 10 })] },
    });
    const errors = await logic.validateField('name');
    expect(errors).toHaveLength(1);

    logic.setFieldValue('name', 'Alice');
    const ok = await logic.validateField('name');
    expect(ok).toEqual([]);
  });

  it('regex 规则正则匹配', async () => {
    const logic = createFormLogic({
      initialValues: { code: 'abc' },
      rules: { code: [rules.regex(/^\d{4}$/, '请输入4位数字')] },
    });
    const errors = await logic.validateField('code');
    expect(errors).toEqual(['请输入4位数字']);

    logic.setFieldValue('code', '1234');
    const ok = await logic.validateField('code');
    expect(ok).toEqual([]);
  });

  it('url 规则校验非法 URL', async () => {
    const logic = createFormLogic({
      initialValues: { url: 'not-a-url' },
      rules: { url: [rules.url()] },
    });
    const errors = await logic.validateField('url');
    expect(errors).toHaveLength(1);
  });

  // ────────── 自定义 / 异步校验 ──────────

  it('custom 同步校验', async () => {
    const logic = createFormLogic({
      initialValues: { name: 'admin' },
      rules: {
        name: [rules.custom((value) => (value === 'admin' ? 'admin 不可用' : true), '名称不可用')],
      },
    });
    const errors = await logic.validateField('name');
    expect(errors).toEqual(['admin 不可用']);
  });

  it('custom 异步校验', async () => {
    const logic = createFormLogic({
      initialValues: { name: 'taken' },
      rules: {
        name: [
          rules.custom(async (value) => {
            await new Promise((r) => setTimeout(r, 10));
            return value === 'taken' ? '名称已被占用' : true;
          }),
        ],
      },
    });
    const errors = await logic.validateField('name');
    expect(errors).toEqual(['名称已被占用']);
  });

  // ────────── 条件校验 ──────────

  it('when 条件校验——条件为 false 时跳过', async () => {
    const logic = createFormLogic({
      initialValues: { type: 'personal', company: '' },
      rules: {
        company: [
          {
            type: 'required',
            when: (values) => values.type === 'enterprise',
          },
        ],
      },
    });
    // type=personal → company 不校验
    let errors = await logic.validateField('company');
    expect(errors).toEqual([]);

    // 切换 type=enterprise → company 校验
    logic.setFieldValue('type', 'enterprise');
    errors = await logic.validateField('company');
    expect(errors).toHaveLength(1);
  });

  // ────────── 跨字段校验 ──────────

  it('跨字段校验——validator 可访问全部值', async () => {
    const logic = createFormLogic({
      initialValues: { password: '123', confirm: '456' },
      rules: {
        confirm: [
          {
            type: 'custom',
            validator: (_value, values) => values.password === values.confirm || '两次密码不一致',
          },
        ],
      },
    });
    const errors = await logic.validateField('confirm');
    expect(errors).toEqual(['两次密码不一致']);

    logic.setFieldValue('confirm', '123');
    const ok = await logic.validateField('confirm');
    expect(ok).toEqual([]);
  });

  // ────────── 触发时机过滤 ──────────

  it('trigger 过滤——blur 规则在 change 时不触发', async () => {
    const logic = createFormLogic({
      initialValues: { name: '' },
      rules: {
        name: [
          { type: 'required', trigger: 'blur', message: 'blur 必填' },
          { type: 'required', trigger: 'change', message: 'change 必填' },
        ],
      },
    });

    // change 触发 → 只执行 trigger=change 的规则
    const changeErrors = await logic.validateField('name', 'change');
    expect(changeErrors).toEqual(['change 必填']);

    // blur 触发 → 只执行 trigger=blur 的规则
    logic.clearValidate();
    const blurErrors = await logic.validateField('name', 'blur');
    expect(blurErrors).toEqual(['blur 必填']);

    // submit 触发 → 执行所有规则
    logic.clearValidate();
    const submitErrors = await logic.validateField('name', 'submit');
    expect(submitErrors).toHaveLength(2);
  });

  // ────────── validate（全表单） ──────────

  it('validate 校验全部字段', async () => {
    const logic = createFormLogic({
      initialValues: { name: '', email: 'bad' },
      rules: {
        name: [rules.required()],
        email: [rules.email()],
      },
    });
    const result = await logic.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.name).toHaveLength(1);
    expect(result.errors.email).toHaveLength(1);
  });

  // ────────── resetFields / clearValidate ──────────

  it('resetFields 回到 initialValues', () => {
    const logic = createFormLogic({ initialValues: { name: 'init' } });
    logic.setFieldValue('name', 'changed');
    logic.resetFields();
    expect(logic.getFieldValue('name')).toBe('init');
  });

  it('resetFields 指定字段', () => {
    const logic = createFormLogic({ initialValues: { a: 1, b: 2 } });
    logic.setFieldsValue({ a: 10, b: 20 });
    logic.resetFields(['a']);
    expect(logic.getFieldValue('a')).toBe(1);
    expect(logic.getFieldValue('b')).toBe(20);
  });

  it('clearValidate 清除错误', async () => {
    const logic = createFormLogic({
      initialValues: { name: '' },
      rules: { name: [rules.required()] },
    });
    await logic.validateField('name');
    expect(logic.getState().errors.name).toHaveLength(1);
    logic.clearValidate();
    expect(logic.getState().errors.name).toBeUndefined();
  });

  // ────────── submit ──────────

  it('submit 校验通过时调用 onSubmit', async () => {
    const onSubmit = vi.fn();
    const logic = createFormLogic({
      initialValues: { name: 'Alice' },
      rules: { name: [rules.required()] },
      onSubmit,
    });
    const result = await logic.submit();
    expect(result.valid).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Alice' });
  });

  it('submit 校验失败时调用 onSubmitFail', async () => {
    const onSubmit = vi.fn();
    const onSubmitFail = vi.fn();
    const logic = createFormLogic({
      initialValues: { name: '' },
      rules: { name: [rules.required()] },
      onSubmit,
      onSubmitFail,
    });
    const result = await logic.submit();
    expect(result.valid).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onSubmitFail).toHaveBeenCalledWith({ name: expect.any(Array) });
  });

  // ────────── 多规则合并（Form 级 + FormItem 级） ──────────

  it('Form 级 rules + FormItem 级 rules 合并', async () => {
    const logic = createFormLogic({
      initialValues: { name: '' },
      rules: { name: [rules.email()] },
    });
    // FormItem 注册时传入额外规则
    logic.registerField('name', [rules.required('必填')]);
    const errors = await logic.validateField('name');
    // required 和 email 都执行（空值 email 规则放行，仅 required 报错）
    expect(errors).toEqual(['必填']);
  });
});
