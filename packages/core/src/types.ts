/**
 * @xui/core - 通用类型定义
 *
 * 契约层的基础类型原语，所有组件契约与 ComponentSpec 复用。
 * 与 @xui/shared 的 LogicInstance 结构兼容（由 spec 的 satisfies 校验保证一致性）。
 */

/** 属性运行时类型构造器（供 Vue props 校验等运行时 schema 使用） */
// args 用 any[]：需与 lib 中 FunctionConstructor 的 new (...argArray: any[]) 声明兼容，
// 换成 unknown[] 会导致 Function 不再可赋值（实验已验证）
export type Constructor<T = unknown> = new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => T;

/** 支持单个构造器或构造器数组（Vue 风格的一多类型声明） */
export type PropType = Constructor | ReadonlyArray<Constructor>;

/** 取消订阅函数 */
export type Unsubscribe = () => void;

/** 状态监听器，收到的是状态快照（浅拷贝） */
export type StateListener<S> = (state: S) => void;

/** 订阅状态变更，返回取消订阅函数 */
export type Subscribe<S> = (listener: StateListener<S>) => Unsubscribe;

/**
 * 逻辑实例通用形状 —— 所有组件逻辑工厂的返回值都满足该接口
 *
 * P：配置（Props）类型；S：状态快照类型
 */
export interface LogicInstance<P extends Record<string, unknown>, S = unknown> {
  /** 订阅状态变更，返回取消订阅函数 */
  subscribe: Subscribe<S>;
  /** 获取当前状态快照（浅拷贝） */
  getState: () => S;
  /** 外部更新配置（Props 变更时由适配层调用） */
  updateOptions: (options: Partial<P>) => void;
}
