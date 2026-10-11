/**
 * @xui/react - React 19 适配层
 *
 * 将 @xui/shared 核心逻辑桥接到 React 状态系统。
 * - React 19+：ref-as-prop（无需 forwardRef）
 * - useSyncExternalStore：订阅逻辑层状态，保证引用稳定
 *
 * 类型契约来自 @xui/core，纯逻辑来自 @xui/shared。
 * 样式由 @xui/styles 统一提供（组件样式单一来源），导入 '@xui/styles' 即可获得全部样式。
 */

export { Switch } from './components/switch';
export type { SwitchComponentProps, SwitchRef } from './components/switch';

export { Checkbox } from './components/checkbox';
export type { CheckboxComponentProps, CheckboxRef } from './components/checkbox';

export { Tag } from './components/tag';
export type { TagComponentProps } from './components/tag';

export { Alert } from './components/alert';
export type { AlertComponentProps } from './components/alert';

export { RadioGroup } from './components/radio-group';
export { Radio } from './components/radio';
export { Progress } from './components/progress';
export { Badge } from './components/badge';
export { Avatar } from './components/avatar';
export { Empty } from './components/empty';
export { Button } from './components/button';
export type { RadioGroupComponentProps } from './components/radio-group';
export type { RadioComponentProps } from './components/radio';
export type { ProgressComponentProps } from './components/progress';
export type { BadgeComponentProps } from './components/badge';
export type { AvatarComponentProps } from './components/avatar';
export type { EmptyComponentProps } from './components/empty';
export type { ButtonComponentProps, ButtonRef } from './components/button';

export { Input } from './components/input';
export type { InputComponentProps, InputRef } from './components/input';

export { Modal } from './components/modal';
export type { ModalComponentProps, ModalRef } from './components/modal';

export { useLogicState } from './hooks/use-logic-state';
export { cn } from './utils/cn';

export const REACT_VERSION = '0.0.0';
