/**
 * RadioGroup 组上下文（Vue 端 provide/inject）
 *
 * Radio 通过 inject 获取所在组的选中值 / 禁用状态 / 选中方法，
 * 组内原生 input 共用同一 name 以获得浏览器原生互斥与方向键导航。
 * React 端等价实现在 packages/react/src/components/radio-group/context.ts。
 */

import type { ComputedRef, InjectionKey } from 'vue';

/** 组上下文值 */
export interface RadioGroupContextValue {
  /** 同组原生 input 共用的 name */
  name: string;
  /** 当前选中值（null 表示未选中） */
  groupValue: ComputedRef<string | null>;
  /** 组禁用状态 */
  groupDisabled: ComputedRef<boolean>;
  /** 选中指定值（转发 RadioGroup 逻辑层 select） */
  select: (value: string) => void;
}

/** provide/inject 键 */
export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContextValue> = Symbol('xui-radio-group');

let uid = 0;

/** 生成组内原生 input 共用的 name（实例级唯一） */
export function createRadioGroupName(): string {
  uid += 1;
  return `xui-radio-group-${uid}`;
}
