/**
 * cn 工具函数测试
 *
 * 覆盖 string/number、对象、数组（递归展开）、假值跳过等分支。
 */

import { describe, expect, it } from 'vitest';
import { cn } from '../cn';

describe('cn className 拼接', () => {
  it('拼接字符串与数字', () => {
    expect(cn('a', 1, 'b')).toBe('a 1 b');
  });

  it('对象键值为真时取键名', () => {
    expect(cn('base', { 'is-active': true, 'is-hidden': false })).toBe('base is-active');
  });

  it('数组递归展开', () => {
    expect(cn('a', ['b', { c: true }, ['d']])).toBe('a b c d');
  });

  it('跳过 false / null / undefined 等假值', () => {
    expect(cn('a', false, null, undefined, '', 0, 'b')).toBe('a b');
  });

  it('无有效输入时返回空字符串', () => {
    expect(cn()).toBe('');
  });
});
