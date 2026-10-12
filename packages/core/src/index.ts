/**
 * @xui-design/core - 框架无关抽象层
 *
 * 定义所有组件的 Props / Events / Slots 类型契约和 ComponentSpec。
 * 被 @xui-design/vue 和 @xui-design/react 共同引用，确保双端 API 一致性。
 */

export const CORE_VERSION = '0.0.0';

// 基础类型原语 + 组件规格契约
export * from './types';
export * from './spec';

// 组件契约（类型 + 规格）
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
export * from './components/modal';
