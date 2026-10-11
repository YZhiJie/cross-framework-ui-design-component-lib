/**
 * Message 命令式消息管理器（纯逻辑）
 *
 * 维护展示中的消息队列：
 * - open 追加一条消息（应用默认值），duration > 0 时定时自动关闭
 * - 携带 key 时同 key 再次 open 原地更新该条（不新增、重置计时）
 * - 超出 maxCount 时移除最早一条
 * - open 返回可手动关闭的句柄；close / closeAll 支持手动关闭
 * - 消息移除（自动 / 手动 / 挤出 / closeAll）时触发该条 onClose 回调
 * 通过 subscribe 通知状态变更，getState 返回不可变快照
 * （items 数组每次变更均生成新引用，适配层可直接依赖引用变化）。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 消息类型（与 @xui/core 的 MessageType 结构一致；shared 不依赖 core，本地定义） */
export type MessageType = 'info' | 'success' | 'warning' | 'error';

/** 打开消息的选项 */
export type MessageOptions = {
  /** 消息类型（默认 'info'） */
  type?: MessageType;
  /** 消息内容 */
  content: string;
  /** 自动关闭时长（ms），0 表示不自动关闭，默认 3000 */
  duration?: number;
  /** 是否显示关闭按钮（默认 false） */
  closable?: boolean;
  /** 更新键：相同 key 再次 open 时原地更新该条消息（不新增、重置计时） */
  key?: string | number;
  /** 消息关闭回调（自动关闭 / 手动关闭 / 超出 maxCount 挤出时触发） */
  onClose?: () => void;
};

/** 消息条目（渲染队列单元） */
export type MessageItem = {
  /** 唯一 id（自增） */
  id: number;
  type: MessageType;
  content: string;
  closable: boolean;
  /** 更新键（open 时携带则原样透出，用于业务侧定位） */
  key?: string | number;
};

/** 打开消息返回的句柄 */
export type MessageHandle = {
  /** 手动关闭该条消息 */
  close: () => void;
};

/** 消息管理器配置（updateOptions 支持项） */
export type MessageManagerOptions = {
  /** 同屏最大消息数，超出时移除最早一条（默认 5） */
  maxCount?: number;
};

/** 消息状态快照 */
export type MessageState = {
  /** 当前展示中的消息（新消息追加在尾部） */
  items: MessageItem[];
};

/** Message 命令式 API 默认值（契约单一来源，@xui/core 的 messageSpec 复用此定义） */
export const messageDefaults = {
  type: 'info',
  duration: 3000,
  closable: false,
  maxCount: 5,
} as const satisfies Partial<MessageOptions> & { maxCount: number };

/** Message 逻辑实例 */
export interface MessageLogicInstance extends LogicInstance<MessageManagerOptions, MessageState> {
  /** 打开一条消息，返回可关闭句柄 */
  open: (options: MessageOptions) => MessageHandle;
  /** 按 id 关闭消息 */
  close: (id: number) => void;
  /** 关闭全部消息 */
  closeAll: () => void;
}

export function createMessageManager(options: MessageManagerOptions = {}): MessageLogicInstance {
  const state: MessageState = { items: [] };

  let maxCount = options.maxCount ?? messageDefaults.maxCount;
  let nextId = 1;
  const timers = new Map<number, ReturnType<typeof setTimeout>>();
  /** 每条消息的关闭回调（与 id 对应；快照 items 保持纯数据） */
  const closeCallbacks = new Map<number, () => void>();
  const listeners = new Set<StateListener<MessageState>>();

  const notify = () => {
    const snapshot: MessageState = { items: [...state.items] };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 移除指定消息：清理定时器并触发 onClose；条目不存在时不通知 */
  const remove = (id: number) => {
    const timer = timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.delete(id);
    }
    if (!state.items.some((item) => item.id === id)) return;
    const closeCallback = closeCallbacks.get(id);
    closeCallbacks.delete(id);
    state.items = state.items.filter((item) => item.id !== id);
    closeCallback?.();
    notify();
  };

  /** 挤出最早的若干条消息，保留 keep 条（remove 内部逐条 notify） */
  const evictOverflow = (keep: number) => {
    if (state.items.length <= keep) return;
    state.items.slice(0, state.items.length - keep).forEach((item) => remove(item.id));
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ items: [...state.items] }),

    updateOptions(next) {
      let changed = false;

      if (next.maxCount !== undefined && next.maxCount !== maxCount) {
        maxCount = next.maxCount;
        changed = true;
      }

      if (state.items.length > maxCount) {
        // 缩小 maxCount：立即挤出最早的超额消息（内部已 notify）
        evictOverflow(maxCount);
        return;
      }

      if (changed) notify();
    },

    open(messageOptions) {
      const duration = messageOptions.duration ?? messageDefaults.duration;

      /** 为消息装配自动关闭定时器（duration <= 0 不装配） */
      const armTimer = (id: number) => {
        if (duration <= 0) return;
        const timer = setTimeout(() => {
          timers.delete(id);
          remove(id);
        }, duration);
        timers.set(id, timer);
      };

      // key 更新语义：同 key 已存在时原地更新（不新增、重置计时），句柄指向既有 id
      if (messageOptions.key !== undefined) {
        const existing = state.items.find((item) => item.key === messageOptions.key);
        if (existing) {
          const timer = timers.get(existing.id);
          if (timer !== undefined) {
            clearTimeout(timer);
            timers.delete(existing.id);
          }
          state.items = state.items.map((item) =>
            item.id === existing.id
              ? {
                  ...item,
                  type: messageOptions.type ?? item.type,
                  content: messageOptions.content,
                  closable: messageOptions.closable ?? item.closable,
                }
              : item,
          );
          if (messageOptions.onClose !== undefined) {
            closeCallbacks.set(existing.id, messageOptions.onClose);
          }
          notify();
          armTimer(existing.id);
          return { close: () => remove(existing.id) };
        }
      }

      const id = nextId;
      nextId += 1;

      // 先挤出超额的最早消息，保证新消息进入后不超 maxCount
      evictOverflow(maxCount - 1);

      state.items = [
        ...state.items,
        {
          id,
          type: messageOptions.type ?? messageDefaults.type,
          content: messageOptions.content,
          closable: messageOptions.closable ?? messageDefaults.closable,
          key: messageOptions.key,
        },
      ];
      if (messageOptions.onClose !== undefined) {
        closeCallbacks.set(id, messageOptions.onClose);
      }
      notify();
      armTimer(id);

      return {
        close: () => {
          remove(id);
        },
      };
    },

    close(id) {
      remove(id);
    },

    closeAll() {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      if (state.items.length === 0) return;
      // 逐条触发 onClose（与单条关闭语义一致），状态一次性清空、单次通知
      const callbacks = [...closeCallbacks.values()];
      closeCallbacks.clear();
      state.items = [];
      callbacks.forEach((callback) => callback());
      notify();
    },
  };
}
