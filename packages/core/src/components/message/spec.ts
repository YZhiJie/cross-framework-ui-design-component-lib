/**
 * Message 组件规格（命令式 API）
 *
 * Message 为命令式全局提示，不产生声明式 Props/Events/Slots。
 * 契约基准：本 spec（类型与默认值）+ @xui/shared 的 createMessageManager。
 * 双端适配层各自实现挂载容器并导出 message 单例（info/success/warning/error/open/closeAll）。
 */

import { createMessageManager, messageDefaults } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { MessageEvents, MessageLogic, MessageSlots } from './types';

/** Message 命令式 API 的默认值契约（单一来源：@xui/shared，管理器按此应用默认值） */
export { messageDefaults };

export const messageSpec = {
  name: 'Message',
  props: {
    type: {},
    defaults: {},
  },
  events: {},
  slots: {},
  useLogic: () => createMessageManager(),
} satisfies ComponentSpec<Record<string, never>, MessageEvents, MessageSlots, MessageLogic>;
