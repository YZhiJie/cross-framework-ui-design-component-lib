/**
 * 插件系统 —— 类型定义
 *
 * XuiPlugin 提供组件逻辑实例级别的标准扩展点与生命周期钩子：
 * - install：实例创建时安装一次，可注入自定义方法（渲染扩展 / 功能扩展）
 * - onStateChange：状态变更钩子（新增事件监听无需改核心代码）
 * - beforeUpdateOptions / afterUpdateOptions：配置更新前后钩子（可拦截修改配置）
 * - destroy：实例销毁钩子（释放插件自身资源）
 *
 * 插件通过 applyPlugins 包装逻辑工厂产物生效，组件核心代码零改动；
 * 无插件时组件行为与原逻辑实例完全一致（向后兼容）。
 */

import type { LogicInstance, Unsubscribe } from '../types';

/** 插件安装上下文（install 钩子入参） */
export interface PluginInstallContext<
  P extends Record<string, unknown>,
  S = unknown,
  T extends LogicInstance<P, S> = LogicInstance<P, S>,
> {
  /** 原始逻辑实例（可读取状态 / 调用方法 / 订阅，不可替换） */
  logic: T;
  /** 向增强实例注入自定义方法（与既有方法同名时插件方法优先） */
  setMethod: (name: string, fn: (...args: never[]) => unknown) => void;
  /** 订阅状态变更（等价 logic.subscribe，语义化入口） */
  onStateChange: (listener: (state: S) => void) => Unsubscribe;
}

/**
 * 组件插件（P：组件逻辑配置类型；S：状态快照类型）
 *
 * 生命周期顺序：install（创建时一次）→ onStateChange / beforeUpdateOptions / afterUpdateOptions（运行期多次）→ destroy（销毁时一次）。
 */
export interface XuiPlugin<
  P extends Record<string, unknown>,
  S = unknown,
  T extends LogicInstance<P, S> = LogicInstance<P, S>,
> {
  /** 插件名（同一实例安装时按名去重） */
  name: string;
  /** 安装钩子：逻辑实例创建后调用一次 */
  install?: (ctx: PluginInstallContext<P, S, T>) => void;
  /** 状态变更钩子：每次状态通知后调用（参数为最新快照） */
  onStateChange?: (state: S) => void;
  /** 配置更新前钩子：返回新对象可替换本次更新的配置（返回 undefined 表示不干预） */
  beforeUpdateOptions?: (options: Partial<P>) => Partial<P> | void;
  /** 配置更新后钩子：在核心逻辑应用配置完成后调用 */
  afterUpdateOptions?: (options: Partial<P>) => void;
  /** 销毁钩子：调用增强实例的 dispose 时触发（释放插件资源） */
  destroy?: () => void;
}
