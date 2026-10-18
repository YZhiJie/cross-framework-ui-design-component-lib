/**
 * @xui-design/shared - 纯逻辑核心层
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

// 基础设施：主题运行时 API / 国际化运行时 API / 插件系统 / 虚拟滚动原语 / 浮层定位原语 / DOM 辅助
export * from './theme';
export * from './locale';
export * from './plugin';
export * from './virtual-list';
export * from './floating';
export * from './utils/focus-trap';

// 组件逻辑工厂
export * from './components/button';
export * from './components/input';
export * from './components/switch';
export * from './components/checkbox';
export * from './components/tag';
export * from './components/alert';
export * from './components/radio-group';
export * from './components/radio';
export * from './components/progress';
export * from './components/badge';
export * from './components/avatar';
export * from './components/empty';
export * from './components/select';
export * from './components/tabs';
export * from './components/message';
export * from './components/tooltip';
export * from './components/pagination';
export * from './components/date-picker';
export * from './components/table';
export * from './components/spin';
export * from './components/breadcrumb';
export * from './components/skeleton';
export * from './components/input-number';
export * from './components/popconfirm';
export * from './components/tree';
export * from './components/drawer';
export * from './components/dropdown';
export * from './components/tree-select';
export * from './components/steps';
export * from './components/modal';
export * from './components/form';
export * from './components/time-picker';
export * from './components/cascader';
export * from './components/upload';
