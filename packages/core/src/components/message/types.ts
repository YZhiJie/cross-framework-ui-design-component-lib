/** Message 契约类型（命令式全局提示）
 *
 * Message 不属于声明式挂载组件：对外是 `message.success('...')` 形态的命令式 API，
 * 契约层定义类型与消息管理器逻辑接口，双端适配层各自提供挂载容器。
 */

import type { LogicInstance } from '../../types';

/** 消息类型 */
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
  /** 自定义类型图标：内层 SVG 标记（与 @xui-design/icons 数据源同构，不含 <svg> 壳）；不传使用按 type 内置图标 */
  icon?: string;
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
  /** 自定义类型图标（内层 SVG 标记；不传使用按 type 内置图标） */
  icon?: string;
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

/** 消息管理器状态快照 */
export type MessageState = {
  /** 当前展示中的消息（新消息追加在尾部） */
  items: MessageItem[];
};

/** Message 事件契约（命令式 API，无声明式事件） */
export type MessageEvents = Record<string, never>;

/** Message 插槽契约（命令式 API，无插槽） */
export type MessageSlots = Record<string, never>;

/** Message 逻辑实例（通用接口 + 命令式交互） */
export type MessageLogic = LogicInstance<MessageManagerOptions, MessageState> & {
  /** 打开一条消息，返回可关闭句柄 */
  open: (options: MessageOptions) => MessageHandle;
  /** 按 id 关闭消息 */
  close: (id: number) => void;
  /** 关闭全部消息 */
  closeAll: () => void;
};
