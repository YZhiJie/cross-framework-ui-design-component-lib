/**
 * RadioGroup 组上下文（React Context）
 *
 * Radio 通过 useContext 获取所在组的选中值 / 禁用状态 / 选中方法，
 * 组内原生 input 共用同一 name 以获得浏览器原生互斥与方向键导航。
 * Vue 端等价实现在 packages/vue/src/components/radio-group/context.ts。
 */

import { createContext } from 'react';

/** 组上下文值 */
export interface RadioGroupContextValue {
  /** 同组原生 input 共用的 name */
  name: string;
  /** 当前选中值（null 表示未选中） */
  groupValue: string | null;
  /** 组禁用状态 */
  groupDisabled: boolean;
  /** 选中指定值（转发 RadioGroup 逻辑层 select） */
  select: (value: string) => void;
}

/** Radio 无所在组时 useContext 返回 null（组外渲染仅作兜底） */
export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
