/** TimeSlotPicker 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * 契约约定：
 * - 以 GitHub 贡献热力图为视觉参考，每个格子代表一个可选择的投放时段；
 * - granularity 决定格子粒度：day = 24 小时、week = 7 天 × 24 小时、
 *   month = 当月日历天、year = 当年全部日期（周一开始的周列布局）；
 * - value 为选中时段的 key 数组，提供即受控；key 规则：
 *     day          h:00 ~ h:23
 *     week         w:1:00 ~ w:7:23（周一 = 1）
 *     month / year YYYY-MM-DD（月份与年份视图共享日期 key）
 * - 点击切换、按住拖拽矩形框选（锚点与当前格子构成矩形）；
 *   onChange 在每次选择变化时触发。
 */

import type { LogicInstance } from '../../types';

/** 投放时段粒度 */
export type TimeSlotGranularity = 'day' | 'week' | 'month' | 'year';

/** TimeSlotPicker Props（Vue 与 React 共用） */
export type TimeSlotPickerProps = {
  /** 时段粒度（默认 week） */
  granularity?: TimeSlotGranularity;
  /** 受控选中时段 key 数组（提供即受控） */
  value?: string[];
  /** 非受控初始选中时段 key 数组 */
  defaultValue?: string[];
  /** 月 / 年视图的参考日期（YYYY-MM-DD，默认当天） */
  referenceDate?: string;
  /** 是否显示底部统计与图例 */
  showFooter?: boolean;
  /** 禁用全部交互 */
  disabled?: boolean;
  /** 附加到根节点的自定义类名 */
  className?: string;
  /** 附加到根节点的内联样式（支持 CSS 自定义属性） */
  style?: Record<string, string>;
  /** 选中时段变更回调（契约事件） */
  onChange?: (value: string[]) => void;
};

/** TimeSlotPicker 事件契约 */
export type TimeSlotPickerEvents = {
  change: (value: string[]) => void;
};

/** TimeSlotPicker 插槽契约 */
export type TimeSlotPickerSlots = Record<string, never>;

/** 拖拽框选预览：矩形内格子与本次拖拽的统一目标状态 */
export type TimeSlotPickerPaint = {
  /** 矩形覆盖的时段 key（升序） */
  keys: string[];
  /** true 表示框选后选中，false 表示框选后取消选中 */
  selected: boolean;
};

/** TimeSlotPicker 状态快照（由逻辑层暴露） */
export type TimeSlotPickerState = {
  /** 当前选中 key 数组（去重、升序） */
  value: string[];
  /** 当前粒度下可选择的格子总数 */
  total: number;
  /** 当前粒度下可见且被选中的格子数 */
  selectedCount: number;
  /** 拖拽框选预览，未处于框选时为 null */
  paint: TimeSlotPickerPaint | null;
};

/** TimeSlotPicker 逻辑实例（通用接口 + 交互方法） */
export type TimeSlotPickerLogic = LogicInstance<TimeSlotPickerProps, TimeSlotPickerState> & {
  /** 切换单个时段 */
  toggle: (key: string) => void;
  /** 设置单个时段的选中状态 */
  setSelected: (key: string, selected: boolean) => void;
  /** 开始矩形框选（返回本次拖拽的统一目标状态） */
  beginPaint: (key: string) => boolean;
  /** 框选移动到指定时段，与锚点构成矩形并更新预览 */
  paintTo: (key: string) => void;
  /** 结束框选并提交预览结果 */
  endPaint: () => void;
  /** 清空当前全部选中项 */
  clear: () => void;
  /** 选中当前粒度下的全部时段 */
  selectAll: () => void;
};
