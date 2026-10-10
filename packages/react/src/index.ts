/**
 * @xui/react - React 19 适配层
 *
 * 将 @xui/shared 核心逻辑桥接到 React 状态系统。
 * - React 19+：ref-as-prop（无需 forwardRef）
 * - useSyncExternalStore：订阅逻辑层状态，保证引用稳定
 *
 * 类型契约来自 @xui/core，纯逻辑来自 @xui/shared。
 */

import './styles/components.css';

export { Button } from './components/button';
export type { ButtonComponentProps, ButtonRef } from './components/button';

export { Input } from './components/input';
export type { InputComponentProps, InputRef } from './components/input';

export { Modal } from './components/modal';
export type { ModalComponentProps, ModalRef } from './components/modal';

export { useLogicState } from './hooks/use-logic-state';
export { cn } from './utils/cn';

export const REACT_VERSION = '0.0.0';
