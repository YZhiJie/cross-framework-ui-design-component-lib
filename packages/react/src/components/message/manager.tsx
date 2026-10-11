/**
 * Message 全局单例管理器（React 适配层）
 *
 * 首次调用时惰性创建逻辑层管理器，并将 MessageHost 宿主组件挂载到 document.body。
 * 命令式 API（message.info 等）通过 getManager() 触发挂载。
 * SSR 环境跳过挂载（typeof document 守卫），仅保留逻辑层。
 */

import { createRoot } from 'react-dom/client';
import { createMessageManager } from '@xui/shared';
import type { MessageLogicInstance } from '@xui/shared';
import { MessageHost } from './MessageHost';

let manager: MessageLogicInstance | null = null;
let hostMounted = false;

/** 获取模块级单例管理器（首次调用时挂载全局容器） */
export function getManager(): MessageLogicInstance {
  if (manager === null) {
    manager = createMessageManager();
  }
  if (!hostMounted && typeof document !== 'undefined') {
    const container = document.createElement('div');
    document.body.appendChild(container);
    createRoot(container).render(<MessageHost manager={manager} />);
    hostMounted = true;
  }
  return manager;
}
