/**
 * @xui/core - ComponentSpec 组件规格契约
 *
 * ComponentSpec 描述一个组件的完整契约（props schema + events + slots + useLogic），
 * 是 Vue 适配层与 React 适配层的"共享合同"。
 * useLogic 指向 @xui/shared 的逻辑工厂，双端通过相同的规格驱动状态。
 */

import type { PropType, Subscribe } from './types';

/** Props 运行时定义：类型映射 + 默认值 + 可选校验器 */
export interface PropsDefinition<P extends Record<string, unknown>> {
  /** 每个 prop 的运行时类型（构造器或构造器数组） */
  type: { [K in keyof P]: PropType };
  /** 默认值 */
  defaults: Partial<P>;
  /** 校验器：返回错误信息数组，空数组表示合法 */
  validator?: (props: P) => string[];
}

/** 单个事件定义 */
export interface EventDefinition {
  /** 事件说明 */
  description: string;
  /** 载荷的 TS 类型引用名（文档用途） */
  payloadType?: string;
}

/** 事件定义映射：事件名 -> 定义 */
export type EventsDefinition<E extends Record<string, unknown>> = {
  [K in keyof E]-?: EventDefinition;
};

/** 单个插槽定义 */
export interface SlotDefinition {
  /** 插槽说明 */
  description?: string;
  /** 作用域插槽参数类型 */
  props?: Record<string, unknown>;
  /** 默认内容 */
  fallback?: string;
}

/** 插槽定义映射：插槽名 -> 定义 */
export type SlotsDefinition<S extends Record<string, unknown>> = {
  [K in keyof S]-?: SlotDefinition;
};

/**
 * 逻辑实例最小形状约束
 *
 * 具体状态类型由各组件的 Logic 类型绑定（如 ButtonLogic），
 * subscribe/getState 以 unknown 为界保证协变兼容。
 */
export type LogicLike<P extends Record<string, unknown>> = {
  subscribe: Subscribe<unknown>;
  getState: () => unknown;
  updateOptions: (options: Partial<P>) => void;
};

/**
 * 组件规格 —— Vue 与 React 适配层的共享合同
 *
 * P：Props 类型；E：Events 类型；S：Slots 类型；L：逻辑实例类型
 */
export interface ComponentSpec<
  P extends Record<string, unknown>,
  E extends Record<string, unknown>,
  S extends Record<string, unknown>,
  L extends LogicLike<P>,
> {
  /** 组件名，Vue 和 React 保持一致 */
  name: string;
  /** Props 定义（运行时 schema + 编译时 TS 类型） */
  props: PropsDefinition<P>;
  /** 事件定义 */
  events: EventsDefinition<E>;
  /** 插槽定义 */
  slots: SlotsDefinition<S>;
  /** 核心 hook 工厂（指向 @xui/shared 的逻辑工厂） */
  useLogic: (options: P) => L;
}
