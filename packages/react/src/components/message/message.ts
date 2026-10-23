/**
 * Message 命令式 API（全局提示，React 适配层）
 *
 * message.info / success / warning / error 快捷方法 + open 完整选项 + closeAll。
 * 首次调用时自动挂载全局容器（见 manager.tsx）。
 */

import type { MessageHandle, MessageOptions } from '@xui-design/core';
import { getManager } from './manager';

/** 打开消息的快捷方法选项（type/content 由快捷方法注入） */
export type MessageShortcutOptions = Partial<Pick<MessageOptions, 'duration' | 'closable'>>;

/**
 * 打开一条消息（完整选项）
 *
 * @public 同时经 message.open 暴露，静态分析无法识别对象成员引用
 */
export function open(options: MessageOptions): MessageHandle {
  return getManager().open(options);
}

/** 全局提示命令式 API 单例 */
export const message = {
  info: (content: string, options?: MessageShortcutOptions): MessageHandle =>
    open({ ...options, type: 'info', content }),
  success: (content: string, options?: MessageShortcutOptions): MessageHandle =>
    open({ ...options, type: 'success', content }),
  warning: (content: string, options?: MessageShortcutOptions): MessageHandle =>
    open({ ...options, type: 'warning', content }),
  error: (content: string, options?: MessageShortcutOptions): MessageHandle =>
    open({ ...options, type: 'error', content }),
  open,
  closeAll: () => getManager().closeAll(),
};
