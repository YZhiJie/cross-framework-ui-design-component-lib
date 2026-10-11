/** Avatar 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 头像尺寸 */
export type AvatarSize = 'sm' | 'md' | 'lg';

/** 头像形状 */
export type AvatarShape = 'circle' | 'square';

/** Avatar Props（Vue 与 React 共用） */
export type AvatarProps = {
  /** 头像尺寸 */
  size?: AvatarSize;
  /** 头像形状 */
  shape?: AvatarShape;
  /** 图片地址（加载失败时回退为默认图标或 default 插槽内容） */
  src?: string;
  /** 图片 alt 文案（未提供时按装饰图处理，读屏跳过） */
  alt?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 图片加载失败回调 */
  onError?: () => void;
};

/** Avatar 事件契约 */
export type AvatarEvents = {
  error: () => void;
};

/** Avatar 插槽契约 */
export type AvatarSlots = {
  /** 自定义内容（文案 / 图标；优先级低于成功的图片，高于默认图标） */
  default: Record<string, never>;
  /** 自定义占位图标（无 src / 加载失败时替换内置 user 图标，内容为任意节点） */
  icon: Record<string, never>;
};

/** Avatar 状态快照（由逻辑层暴露） */
export type AvatarState = {
  /** 当前 src 是否加载失败 */
  failed: boolean;
};

/** Avatar 逻辑实例（通用接口 + 交互方法） */
export type AvatarLogic = LogicInstance<AvatarProps, AvatarState> & {
  /** 图片加载失败处理：标记失败态并触发回调 */
  handleError: () => void;
};
