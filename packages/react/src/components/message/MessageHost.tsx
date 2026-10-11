/**
 * Message - React 19 适配层（命令式全局提示）
 *
 * MessageHost 为全局宿主组件：由 manager.tsx 挂载到 document.body，
 * 订阅单例管理器状态并渲染消息队列（不作为公共组件导出）。
 */

import { icons } from '@xui/icons';
import type { MessageLogicInstance, MessageState } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** MessageHost 宿主组件 Props */
export interface MessageHostProps {
  manager: MessageLogicInstance;
}

/** 消息类型图标映射（数据来自 @xui/icons，与 Vue 端一致） */
const TYPE_ICONS: Record<string, string> = {
  info: icons.info,
  success: icons.success,
  warning: icons.warning,
  error: icons.error,
};

export function MessageHost({ manager }: MessageHostProps) {
  const state: MessageState = useLogicState(manager.subscribe, manager.getState);

  return (
    <div className="xui-message" aria-live="polite">
      {state.items.map((item) => (
        <div key={item.id} className={cn('xui-message__item', `xui-message__item--${item.type}`)}>
          <svg
            className="xui-message__icon"
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: item.icon ?? TYPE_ICONS[item.type] }}
          />
          <span className="xui-message__content">{item.content}</span>
          {item.closable && (
            <button
              type="button"
              className="xui-message__close"
              aria-label="close"
              onClick={() => manager.close(item.id)}
            >
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: icons.close }}
              />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
