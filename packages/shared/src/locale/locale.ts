/**
 * 国际化运行时 API（框架无关）
 *
 * 模块级语言包注册表 + 当前语言状态，纯内存实现（不写 DOM，SSR 下同样生效）。
 * getLocaleData() 恒返回缓存引用（内置包直接复用同一引用，仅语言切换 /
 * 当前包重新注册时重建），保证 React useSyncExternalStore 快照语义。
 */

import { enUS } from './en-US';
import { zhCN } from './zh-CN';

/** 组件库语言包（按组件分组的用户可见文案） */
export type XuiLocaleData = {
  /** Modal 弹窗按钮 */
  modal: { ok: string; cancel: string };
  /** Popconfirm 气泡按钮 */
  popconfirm: { confirm: string; cancel: string };
  /** Table 表格 */
  table: {
    /** 空数据回退文案（empty 插槽 / renderEmpty 未提供时） */
    empty: string;
    /** 行选择列全选复选框 aria-label */
    selectAll: string;
    /** 行选择复选框 aria-label（index 为 0 起始行号） */
    selectRow: (index: number) => string;
  };
  /** Pagination 分页 aria-label */
  pagination: { nav: string; prev: string; next: string };
  /** DatePicker 日期选择 */
  datePicker: {
    /** 面板 aria-label */
    panel: string;
    /** 上 / 下月按钮 aria-label */
    prevMonth: string;
    nextMonth: string;
    /** 面板标题格式化（年 / 月） */
    titleFormat: (year: number, month: number) => string;
    /** 星期表头（周日起始，7 项，整体替换不做逐项合并） */
    weekdays: readonly string[];
    /** 触发器 placeholder（value 为空时） */
    placeholder: string;
    /** 面板底部确认按钮文案 */
    confirm: string;
    /** 面板底部取消按钮文案 */
    cancel: string;
  };
  /** Skeleton 骨架屏 */
  skeleton: { loading: string };
  /** Breadcrumb 面包屑 */
  breadcrumb: { nav: string };
  /** Select 选择器 */
  select: {
    /** filterable 搜索输入框 placeholder */
    searchPlaceholder: string;
    /** 搜索输入框 aria-label */
    searchAriaLabel: string;
    /** 触发器 placeholder（value 为空时） */
    triggerPlaceholder: string;
  };
  /** TimePicker 时间选择 */
  timePicker: {
    /** 面板 aria-label */
    panel: string;
    /** 触发器 placeholder（value 为空时） */
    placeholder: string;
    /** 面板底部确认按钮文案 */
    confirm: string;
    /** 面板底部取消按钮文案 */
    cancel: string;
  };
  /** Cascader 级联选择 */
  cascader: {
    /** 面板 aria-label */
    panel: string;
    /** 触发器 placeholder（value 为空时） */
    placeholder: string;
  };
  /** TreeSelect 树选择 */
  treeSelect: {
    /** 面板 aria-label */
    panel: string;
    /** 触发器 placeholder（value 为空时） */
    placeholder: string;
  };
  /** Carousel 轮播图 */
  carousel: {
    /** 区域 aria-label */
    region: string;
    /** 上一张按钮 aria-label */
    prev: string;
    /** 下一张按钮 aria-label */
    next: string;
    /** 指示点 aria-label（index 为 1 起始序号） */
    goTo: (index: number) => string;
  };
  /** TimeSlotPicker 投放时段 */
  timeSlotPicker: {
    /** 区域 aria-label */
    region: string;
    /** 未选择任何时段时的操作提示 */
    hint: string;
    /** 底部统计文案（selected 为当前粒度下选中数，total 为格子总数） */
    summary: (selected: number, total: number) => string;
    /** 图例：未选中 */
    unselected: string;
    /** 图例：已选中 */
    selected: string;
    /** 星期短名（周一为 1，7 项） */
    weekdays: readonly string[];
    /** 月份短名（1 月起始，12 项） */
    months: readonly string[];
    /** 小时标签（hour 为 0-23） */
    hour: (hour: number) => string;
    /** 完整日期标签（month / year 视图 aria-label 与 title） */
    dateLabel: (year: number, month: number, day: number) => string;
  };
};

/** registerLocale 的输入：允许只提供部分组 / 部分字段，未提供字段回退基底语言包 */
export type XuiLocaleInput = { [K in keyof XuiLocaleData]?: Partial<XuiLocaleData[K]> };

/** 语言包变更监听器（收到切换 / 重新注册后的完整语言包） */
export type LocaleListener = (data: XuiLocaleData) => void;

/** 默认语言标识（与历史硬编码文案一致，未调用 setLocale 时零行为变化） */
export const DEFAULT_LOCALE = 'zh-CN';

const packs = new Map<string, XuiLocaleData>([
  ['zh-CN', zhCN],
  ['en-US', enUS],
]);

let currentKey = DEFAULT_LOCALE;
let cache: XuiLocaleData = zhCN;

const listeners = new Set<LocaleListener>();

/** 读取当前语言标识 */
export function getLocale(): string {
  return currentKey;
}

/** 读取当前生效语言包（稳定引用） */
export function getLocaleData(): XuiLocaleData {
  return cache;
}

function notify(): void {
  listeners.forEach((listener) => listener(cache));
}

/** 订阅语言包变更，返回取消订阅函数 */
export function subscribeLocale(listener: LocaleListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 切换语言：未注册的 key 静默忽略；与当前语言相同或语言包未变化时静默返回 */
export function setLocale(key: string): void {
  const pack = packs.get(key);
  if (!pack || key === currentKey) return;
  currentKey = key;
  cache = pack;
  notify();
}

/**
 * 注册 / 覆盖语言包：以既有注册（新语言回退当前生效包）为基底做组级浅合并，
 * 未提供字段继承基底；注册当前生效语言时重建缓存并通知，否则仅更新注册表。
 * 非法入参（空 key / 非对象 partial / 非对象组）静默忽略。
 */
export function registerLocale(key: string, partial: XuiLocaleInput): void {
  if (typeof key !== 'string' || key.length === 0) return;
  if (partial === null || typeof partial !== 'object') return;

  const base = packs.get(key) ?? cache;
  const merged = { ...base } as XuiLocaleData;
  const target = merged as Record<string, unknown>;
  const source = base as Record<string, unknown>;
  const patchBag = partial as Record<string, unknown>;
  let changed = false;
  Object.keys(partial).forEach((group) => {
    const patch = patchBag[group];
    if (patch === null || typeof patch !== 'object') return;
    target[group] = { ...(source[group] as object), ...patch };
    changed = true;
  });
  // 无有效变更：不重建引用、不通知（保持稳定引用语义）
  if (!changed) return;

  packs.set(key, merged);
  if (key === currentKey) {
    cache = merged;
    notify();
  }
}
