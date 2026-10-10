/**
 * @xui/shared - 纯逻辑核心层
 *
 * 框架无关的组件逻辑工厂函数，不依赖任何框架运行时。
 * 所有状态管理通过闭包 + subscribe 模式实现。
 */

export const SHARED_VERSION = '0.0.0';

export function isXuiShared(): true {
  return true;
}

// 通用类型原语
export * from './types';

// 组件逻辑工厂
export * from './components/button';
export * from './components/input';
export * from './components/modal';
