/**
 * Dropdown 纯逻辑工厂
 *
 * 状态：open（开关）/ placement（收敛到四方位）/ trigger（收敛 hover|click）/ disabled
 * 交互：toggle（click 触发）/ hover 调度展开收起（跨间隙防抖）/ select（禁用项 no-op）/
 *       close（外部点击仅收起）。open 每次变化均触发 onVisibleChange。
 * 运行时禁用收起已开菜单；运行时变更 trigger 清理待执行定时器。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 方位 */
export type DropdownPlacement = 'top' | 'bottom' | 'left' | 'right';

/** 触发方式 */
export type DropdownTrigger = 'hover' | 'click';

/** 菜单项（与 core 契约保持一致；core 不依赖 icons，icon 为名称字符串） */
export type DropdownOption = {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  divided?: boolean;
  icon?: string;
};

/** Dropdown 逻辑配置（由适配层从 Props 中提取注入） */
export type DropdownLogicOptions = {
  menu?: DropdownOption[];
  trigger?: DropdownTrigger;
  placement?: DropdownPlacement;
  disabled?: boolean;
  onSelect?: (key: string, option: DropdownOption) => void;
  onVisibleChange?: (open: boolean) => void;
};

/** Dropdown 状态快照 */
export type DropdownState = {
  open: boolean;
  placement: DropdownPlacement;
  trigger: DropdownTrigger;
  disabled: boolean;
};

/** Dropdown 逻辑实例 */
export type DropdownLogicInstance = LogicInstance<DropdownLogicOptions, DropdownState> & {
  /** 触发元素点击切换（仅 trigger='click' 生效；disabled no-op） */
  toggle: () => void;
  /** 立即展开 */
  openMenu: () => void;
  /** 立即收起 */
  closeMenu: () => void;
  /** 触发元素 mouseenter：hover 触发时延迟展开 */
  handleTriggerEnter: () => void;
  /** 触发元素 mouseleave：hover 触发时延迟收起 */
  handleTriggerLeave: () => void;
  /** 菜单 mouseenter：取消待执行的收起 */
  handlePopperEnter: () => void;
  /** 菜单 mouseleave：延迟收起 */
  handlePopperLeave: () => void;
  /** 菜单项点击：禁用项 no-op；否则收起并回调 onSelect */
  select: (key: string) => void;
  /** 点击外部收起（不触发 onSelect） */
  close: () => void;
};

/** 与 core spec defaults 保持一致 */
const PLACEMENTS: DropdownPlacement[] = ['top', 'bottom', 'left', 'right'];
const TRIGGERS: DropdownTrigger[] = ['hover', 'click'];

/** hover 进入延迟（ms） */
export const HOVER_OPEN_DELAY = 100;
/** hover 离开延迟（ms）：覆盖触发器与菜单间 8px 间隙的移动耗时 */
export const HOVER_CLOSE_DELAY = 150;

function normalizePlacement(raw: DropdownPlacement | undefined): DropdownPlacement {
  return raw !== undefined && PLACEMENTS.includes(raw) ? raw : 'bottom';
}

function normalizeTrigger(raw: DropdownTrigger | undefined): DropdownTrigger {
  return raw !== undefined && TRIGGERS.includes(raw) ? raw : 'hover';
}

export function createDropdownLogic(options: DropdownLogicOptions = {}): DropdownLogicInstance {
  const state: DropdownState = {
    open: false,
    placement: normalizePlacement(options.placement),
    trigger: normalizeTrigger(options.trigger),
    disabled: options.disabled ?? false,
  };

  let menu = options.menu ?? [];
  const onSelect = options.onSelect;
  const onVisibleChange = options.onVisibleChange;

  const listeners = new Set<StateListener<DropdownState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** hover 调度定时器（open / close 共用，更新时清理） */
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;

  function clearPending() {
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
  }

  /** 收起菜单（幂等：未开 no-op），open 变化时触发 onVisibleChange */
  function collapse() {
    clearPending();
    if (!state.open) return false;
    state.open = false;
    notify();
    onVisibleChange?.(false);
    return true;
  }

  /** 展开菜单（幂等：已开 no-op），open 变化时触发 onVisibleChange */
  function expand() {
    clearPending();
    if (state.disabled || state.open) return false;
    state.open = true;
    notify();
    onVisibleChange?.(true);
    return true;
  }

  /** hover 触发专用：延迟执行展开 / 收起 */
  function scheduleOpen() {
    clearPending();
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      expand();
    }, HOVER_OPEN_DELAY);
  }

  function scheduleClose() {
    clearPending();
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      collapse();
    }, HOVER_CLOSE_DELAY);
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      const nextMenu = next.menu !== undefined ? next.menu : menu;
      const nextTrigger =
        next.trigger !== undefined ? normalizeTrigger(next.trigger) : state.trigger;
      const nextPlacement =
        next.placement !== undefined ? normalizePlacement(next.placement) : state.placement;
      const nextDisabled = next.disabled !== undefined ? next.disabled : state.disabled;

      let changed =
        nextTrigger !== state.trigger ||
        nextPlacement !== state.placement ||
        nextDisabled !== state.disabled;
      const triggerChanged = nextTrigger !== state.trigger;
      menu = nextMenu;
      state.trigger = nextTrigger;
      state.placement = nextPlacement;
      state.disabled = nextDisabled;

      // trigger / disabled 变更清理 hover 调度；运行时禁用收起已开菜单
      if (triggerChanged || nextDisabled) clearPending();
      const wasOpen = state.open;
      if (nextDisabled && state.open) state.open = false;
      if (state.open !== wasOpen) {
        changed = true;
        onVisibleChange?.(false);
      }
      if (changed) notify();
    },

    toggle() {
      if (state.disabled || state.trigger !== 'click') return;
      clearPending();
      state.open = !state.open;
      notify();
      onVisibleChange?.(state.open);
    },

    openMenu() {
      expand();
    },

    closeMenu() {
      collapse();
    },

    handleTriggerEnter() {
      if (state.disabled || state.trigger !== 'hover') return;
      if (state.open) {
        clearPending();
        return;
      }
      scheduleOpen();
    },

    handleTriggerLeave() {
      if (state.trigger !== 'hover') return;
      if (state.open) {
        scheduleClose();
        return;
      }
      clearPending();
    },

    handlePopperEnter() {
      clearPending();
    },

    handlePopperLeave() {
      if (state.trigger !== 'hover' || !state.open) return;
      scheduleClose();
    },

    select(key) {
      const option = menu.find((item) => item.key === key);
      if (!option || option.disabled || state.disabled) return;
      collapse();
      onSelect?.(key, option);
    },

    close() {
      collapse();
    },
  };
}
