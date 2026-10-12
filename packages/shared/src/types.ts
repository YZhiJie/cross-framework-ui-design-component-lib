/**
 * @xui-design/shared - 通用类型原语
 *
 * 逻辑实例的基础契约形状，@xui-design/core 与各框架适配层复用此定义。
 * @xui-design/shared 保持零框架依赖，仅含类型与纯逻辑。
 */

/** 取消订阅函数 */
export type Unsubscribe = () => void;

/** 状态监听器，收到的是状态快照（浅拷贝） */
export type StateListener<S> = (state: S) => void;

/** 订阅状态变更，返回取消订阅函数 */
export type Subscribe<S> = (listener: StateListener<S>) => Unsubscribe;

/**
 * 逻辑实例通用形状
 *
 * P：配置类型（由适配层从 Props 提取注入）
 * S：状态快照类型
 */
export interface LogicInstance<P extends Record<string, unknown>, S = unknown> {
  /** 订阅状态变更，返回取消订阅函数 */
  subscribe: Subscribe<S>;
  /** 获取当前状态快照（浅拷贝，外部修改不影响内部状态） */
  getState: () => S;
  /** 外部更新配置（Props 变更时由适配层调用） */
  updateOptions: (options: Partial<P>) => void;
}
