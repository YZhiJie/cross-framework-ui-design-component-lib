/**
 * @xui/react 包入口测试
 *
 * 覆盖根 index.ts 的导出声明与版本常量。
 */

import { describe, expect, it } from 'vitest';
import * as XuiReact from '../index';

describe('@xui/react 入口导出', () => {
  it('导出 Button / Input / Modal 组件', () => {
    expect(typeof XuiReact.Button).toBe('function');
    expect(typeof XuiReact.Input).toBe('function');
    expect(typeof XuiReact.Modal).toBe('function');
  });

  it('导出 useLogicState 与 cn 工具', () => {
    expect(typeof XuiReact.useLogicState).toBe('function');
    expect(typeof XuiReact.cn).toBe('function');
  });

  it('REACT_VERSION 与包版本一致', () => {
    expect(XuiReact.REACT_VERSION).toBe('0.0.0');
  });
});
