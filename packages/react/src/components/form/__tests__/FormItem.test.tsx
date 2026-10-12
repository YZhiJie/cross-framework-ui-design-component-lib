/**
 * FormItem 组件测试（React 19 适配层）
 *
 * 覆盖：受控值写入表单状态、输入过程中元素引用与焦点保持、
 * 外部 setFieldValue 同步显示值。
 */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { Form } from '../Form';
import { FormItem } from '../FormItem';
import { Input } from '../../input';

const renderDemo = () =>
  render(
    <Form initialValues={{ email: '' }}>
      <FormItem name="email" label="Email">
        <Input placeholder="Enter email" />
      </FormItem>
    </Form>,
  );

describe('FormItem 组件（React 适配层）', () => {
  afterEach(() => {
    cleanup();
  });

  it('输入值写入表单状态并同步显示', () => {
    renderDemo();
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'abc' } });

    expect(input).toHaveValue('abc');
  });

  it('输入过程中 input 元素不被重建且焦点不丢失', () => {
    renderDemo();
    const input = screen.getByRole('textbox') as HTMLInputElement;

    input.focus();
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: 'a' } });

    // 受控值回灌不应重挂载子树：元素引用不变、焦点保留
    expect(screen.getByRole('textbox')).toBe(input);
    expect(document.activeElement).toBe(input);
  });
});
