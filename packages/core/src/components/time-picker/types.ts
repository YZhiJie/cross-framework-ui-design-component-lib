/** TimePicker 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * 契约约定：value 为 'HH:mm:ss' 格式字符串（零依赖、序列化友好），
 * 非法值回退 null，不引入 Date 对象契约。
 */

import type { LogicInstance } from '../../types';

/** 时间格式：'HH:mm:ss' 显示时分秒，'HH:mm' 仅显示时分 */
export type TimeFormat = 'HH:mm:ss' | 'HH:mm';

/** TimePicker Props（Vue 与 React 共用） */
export type TimePickerProps = {
  /** 受控选中时间（'HH:mm:ss'，提供即受控） */
  value?: string;
  /** 非受控初始时间（'HH:mm:ss'） */
  defaultValue?: string;
  /** 占位文案 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 是否显示清空按钮（仅已选中时） */
  clearable?: boolean;
  /** 显示格式（默认 'HH:mm:ss'；'HH:mm' 不渲染秒列） */
  format?: TimeFormat;
  /** 小时步长（默认 1，范围 1-23） */
  hourStep?: number;
  /** 分钟步长（默认 1，范围 1-59） */
  minuteStep?: number;
  /** 秒步长（默认 1，范围 1-59） */
  secondStep?: number;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 选中值变更回调（契约事件） */
  onChange?: (value: string) => void;
  /** 清空回调（契约事件） */
  onClear?: () => void;
};

/** TimePicker 事件契约 */
export type TimePickerEvents = {
  change: (value: string) => void;
  clear: () => void;
};

/** TimePicker 插槽契约 */
export type TimePickerSlots = {
  /** 自定义清除图标（替换内置 clear，内容为任意节点） */
  clearIcon: Record<string, never>;
  /** 自定义时钟图标（替换内置 clock，内容为任意节点） */
  clockIcon: Record<string, never>;
};

/** TimePicker 状态快照（由逻辑层暴露） */
export type TimePickerState = {
  /** 当前选中时间（'HH:mm:ss'，null 表示未选中；非法输入回退 null） */
  value: string | null;
  /** 面板展开状态 */
  open: boolean;
  disabled: boolean;
};

/** TimePicker 逻辑实例（通用接口 + 交互方法） */
export type TimePickerLogic = LogicInstance<TimePickerProps, TimePickerState> & {
  /** 展开 / 收起面板（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
  /** 选中时间：非法值忽略；非受控更新 value；受控仅回调；选中后收起面板 */
  select: (hour: number, minute: number, second: number) => void;
  /** 清空选中值（非受控置 null，始终触发 onClear） */
  clear: () => void;
};
