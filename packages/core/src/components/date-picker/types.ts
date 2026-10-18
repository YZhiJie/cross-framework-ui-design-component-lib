/** DatePicker 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * 契约约定：
 * - type='date'（默认）：value 为 'YYYY-MM-DD' 字符串
 * - type='range'：value 为 [start, end] 字符串数组
 * 非法值回退 null，不引入 Date 对象契约。
 */

import type { LogicInstance } from '../../types';

/** 选择模式：date 单选日期；range 范围选择 */
export type DatePickerType = 'date' | 'range';

/** DatePicker 值：date 模式为 string，range 模式为 [string, string] */
export type DatePickerValue = string | [string, string];

/** 快捷选项 */
export type DateShortcut = {
  /** 显示文案 */
  label: string;
  /** 选中值（date 模式为 string，range 模式为 [string, string]） */
  value: DatePickerValue;
};

/** DatePicker Props（Vue 与 React 共用） */
export type DatePickerProps = {
  /** 选择模式：date 单选（默认）/ range 范围 */
  type?: DatePickerType;
  /** 受控选中值（date: 'YYYY-MM-DD'；range: [start, end]） */
  value?: DatePickerValue;
  /** 非受控初始值 */
  defaultValue?: DatePickerValue;
  /** 占位文案 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 是否显示清空按钮（仅已选中时） */
  clearable?: boolean;
  /** 快捷选项（面板底部渲染，点击直接选中） */
  shortcuts?: DateShortcut[];
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 选中值变更回调（契约事件） */
  onChange?: (value: DatePickerValue) => void;
  /** 清空回调（契约事件） */
  onClear?: () => void;
};

/** DatePicker 事件契约 */
export type DatePickerEvents = {
  change: (value: DatePickerValue) => void;
  clear: () => void;
};

/** DatePicker 插槽契约 */
export type DatePickerSlots = {
  /** 自定义清除图标（替换内置 clear，内容为任意节点） */
  clearIcon: Record<string, never>;
  /** 自定义日历图标（替换内置 calendar，内容为任意节点） */
  calendarIcon: Record<string, never>;
  /** 自定义上一月图标（替换内置 arrow-left，内容为任意节点） */
  prevIcon: Record<string, never>;
  /** 自定义下一月图标（替换内置 arrow-right，内容为任意节点） */
  nextIcon: Record<string, never>;
};

/** DatePicker 状态快照（由逻辑层暴露） */
export type DatePickerState = {
  /** 当前选中值（date: string | null；range: [string, string] | null） */
  value: DatePickerValue | null;
  /** 面板展开状态 */
  open: boolean;
  /** 面板当前展示年份 */
  viewYear: number;
  /** 面板当前展示月份（1-12） */
  viewMonth: number;
  /** range 模式：当前选择阶段（start/end），date 模式为 null */
  rangeStage: 'start' | 'end' | null;
  /** range 模式：已选中的起始值（end 未确定时暂存） */
  rangeStart: string | null;
  disabled: boolean;
};

/** DatePicker 逻辑实例（通用接口 + 交互方法） */
export type DatePickerLogic = LogicInstance<DatePickerProps, DatePickerState> & {
  /** 展开 / 收起面板（disabled 时忽略；展开时视图定位到选中值或今天） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
  /** 视图切换到上个月（跨年自动滚动） */
  prevMonth: () => void;
  /** 视图切换到下个月（跨年自动滚动） */
  nextMonth: () => void;
  /** 选中日期：date 模式直接确认；range 模式先选 start 再选 end */
  select: (date: string) => void;
  /** 选中快捷选项 */
  selectShortcut: (value: DatePickerValue) => void;
  /** 清空选中值（非受控置 null，始终触发 onClear） */
  clear: () => void;
};
