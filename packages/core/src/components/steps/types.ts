/** Steps 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * 契约约定：
 * - value 为当前步骤索引（0 起），提供即受控；
 * - 节点状态由索引与 value 推导：小于当前为 finish、等于为 process（可被
 *   status 覆盖，如 error）、大于为 wait；
 * - onChange 由点击非禁用步骤触发，配合 next/prev/goTo 命令式 API 使用。
 */

import type { LogicInstance } from '../../types';

/** 步骤状态 */
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

/** 步骤项（与 Steps 组件 items 元素结构一致） */
export type StepItem = {
  /** 步骤唯一标识 */
  key: string;
  /** 步骤标题 */
  title: string;
  /** 步骤描述（标题下方的辅助文案） */
  description?: string;
  /** 禁用本步骤（点击切换 no-op） */
  disabled?: boolean;
};

/** 步骤条方向 */
export type StepsDirection = 'horizontal' | 'vertical';

/** Steps Props（Vue 与 React 共用） */
export type StepsProps = {
  /** 步骤数据 */
  items: StepItem[];
  /** 受控当前步骤索引（提供即受控） */
  value?: number;
  /** 非受控初始步骤索引 */
  defaultValue?: number;
  /** 当前步骤的状态覆盖（默认 process；error 用于标记出错步骤） */
  status?: StepStatus;
  /** 布局方向 */
  direction?: StepsDirection;
  /** 附加到根节点的自定义类名 */
  className?: string;
  /** 附加到根节点的内联样式（支持 CSS 自定义属性） */
  style?: Record<string, string>;
  /** 当前步骤变更回调（契约事件；点击非禁用步骤或调用命令式 API 时触发） */
  onChange?: (index: number) => void;
};

/** Steps 事件契约 */
export type StepsEvents = {
  change: (index: number) => void;
};

/** Steps 插槽契约 */
export type StepsSlots = Record<string, never>;

/** Steps 状态快照（由逻辑层暴露） */
export type StepsState = {
  /** 当前步骤索引 */
  value: number;
  /** 布局方向（已收敛合法值） */
  direction: StepsDirection;
  /** 当前步骤状态覆盖（undefined 表示按索引推导 process） */
  status: StepStatus | undefined;
};

/** Steps 逻辑实例（通用接口 + 交互方法） */
export type StepsLogic = LogicInstance<StepsProps, StepsState> & {
  /** 点击 / 编程式切换到指定步骤（越界或禁用项 no-op；受控仅回调） */
  select: (index: number) => void;
  /** 切换到下一步 */
  next: () => void;
  /** 切换到上一步 */
  prev: () => void;
  /** 推导某步骤的展示状态 */
  getStatus: (index: number) => StepStatus;
};
