/**
 * Carousel 纯逻辑工厂
 *
 * 状态：value（归一化当前索引）/ position（轨道动画位置，环绕时瞬时指向
 *       -1 或 count 的克隆虚拟位）/ animate（是否带过渡）/ playing（自动播放中）
 * 交互：prev / next / goTo（动画进行中丢弃，避免克隆位越界）/
 *       play / stop（自动播放定时器）/ setHovered（悬停暂停联动）
 * 受控模式：创建时提供 value 选项即进入受控模式，内部不自行更新 value，
 *       仅回调 onChange；updateOptions 收到与动画目标一致的 value 视为
 *       受控回写回声，不打断进行中的切换动画。
 *
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 轮播项（与 core 契约结构一致） */
export type CarouselItem = {
  key: string;
  image: string;
  alt?: string;
};

/** Carousel 逻辑配置（由适配层从 Props 中提取注入） */
export type CarouselLogicOptions = {
  items?: CarouselItem[];
  /** 受控当前索引（提供即受控） */
  value?: number;
  /** 非受控初始索引 */
  defaultValue?: number;
  autoplay?: boolean;
  interval?: number;
  loop?: boolean;
  duration?: number;
  pauseOnHover?: boolean;
  onChange?: (index: number) => void;
};

/** Carousel 状态快照 */
export type CarouselState = {
  value: number;
  position: number;
  animate: boolean;
  playing: boolean;
};

/** Carousel 逻辑实例 */
export interface CarouselLogicInstance extends LogicInstance<CarouselLogicOptions, CarouselState> {
  prev: () => void;
  next: () => void;
  goTo: (index: number) => void;
  play: () => void;
  stop: () => void;
  setHovered: (hovered: boolean) => void;
  /** 卸载时清理定时器（适配层 onUnmounted / useEffect cleanup 调用） */
  destroy: () => void;
}

const DEFAULT_INTERVAL = 3000;
const DEFAULT_DURATION = 500;

function normalizeCount(raw: number | undefined, fallback: number): number {
  return typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

export function createCarouselLogic(options: CarouselLogicOptions = {}): CarouselLogicInstance {
  const controlled = options.value !== undefined;

  let items = options.items ?? [];
  let onChange = options.onChange;
  let autoplay = options.autoplay ?? true;
  let interval = normalizeCount(options.interval, DEFAULT_INTERVAL);
  let loop = options.loop ?? true;
  let duration = normalizeCount(options.duration, DEFAULT_DURATION);
  let pauseOnHover = options.pauseOnHover ?? true;

  let hovered = false;
  let playTimer: ReturnType<typeof setInterval> | null = null;
  let snapTimer: ReturnType<typeof setTimeout> | null = null;
  /** 动画进行中的收敛目标（归一化索引），用于受控回写回声判定 */
  let pendingTarget = -1;

  const count = (): number => items.length;

  const wrap = (index: number): number => {
    const total = count();
    if (total === 0) return 0;
    return ((index % total) + total) % total;
  };

  const clamp = (index: number): number => {
    const total = count();
    if (total === 0) return 0;
    return Math.max(0, Math.min(total - 1, index));
  };

  const state: CarouselState = {
    value: 0,
    position: 0,
    animate: false,
    playing: false,
  };
  state.value =
    options.value !== undefined ? clamp(options.value) : clamp(options.defaultValue ?? 0);
  state.position = state.value;

  const listeners = new Set<StateListener<CarouselState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  const stopPlayTimer = () => {
    if (playTimer === null) return;
    clearInterval(playTimer);
    playTimer = null;
    if (state.playing) {
      state.playing = false;
      notify();
    }
  };

  const canAutoplay = (): boolean => autoplay && count() >= 2 && !(hovered && pauseOnHover);

  const startPlayTimer = () => {
    if (playTimer !== null || !canAutoplay()) return;
    playTimer = setInterval(tick, interval);
    state.playing = true;
    notify();
  };

  function tick(): void {
    if (!loop && state.value === count() - 1) {
      stopPlayTimer();
      return;
    }
    moveTo(state.value + 1);
  }

  const clearSnapTimer = () => {
    if (snapTimer === null) return;
    clearTimeout(snapTimer);
    snapTimer = null;
    pendingTarget = -1;
  };

  /**
   * 移动到虚拟位置（可为 -1 / count 克隆位）：
   * 动画位置立即切换并按 duration 收敛回跳到归一化索引。
   * 动画进行中（snapTimer 挂起）丢弃后续移动，避免克隆位越界。
   */
  const moveTo = (virtual: number) => {
    if (count() === 0 || snapTimer !== null) return;
    const target = wrap(virtual);
    if (target === state.value && virtual === target) return;

    if (!controlled) {
      state.value = target;
    }
    state.position = virtual;
    state.animate = true;
    notify();
    onChange?.(target);

    pendingTarget = target;
    snapTimer = setTimeout(() => {
      snapTimer = null;
      pendingTarget = -1;
      state.position = target;
      state.animate = false;
      notify();
    }, duration);
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      let changed = false;

      if (next.items !== undefined && next.items !== items) {
        const prevCount = items.length;
        items = next.items;
        if (items.length !== prevCount) {
          // 数量变化：收敛动画并钳制索引
          clearSnapTimer();
          state.value = clamp(state.value);
          state.position = state.value;
          state.animate = false;
          if (count() < 2) stopPlayTimer();
        }
        changed = true;
      }
      if (next.value !== undefined && next.value !== state.value) {
        if (snapTimer !== null && next.value === pendingTarget) {
          // 受控回写回声：与动画目标一致，仅采纳 value，不打断动画
          state.value = next.value;
        } else {
          clearSnapTimer();
          state.value = clamp(next.value);
          state.position = state.value;
          state.animate = false;
        }
        changed = true;
      }
      if (next.autoplay !== undefined && next.autoplay !== autoplay) {
        autoplay = next.autoplay;
        stopPlayTimer();
        if (autoplay) startPlayTimer();
      }
      if (next.interval !== undefined) {
        const nextInterval = normalizeCount(next.interval, DEFAULT_INTERVAL);
        if (nextInterval !== interval) {
          interval = nextInterval;
          if (playTimer !== null) {
            stopPlayTimer();
            startPlayTimer();
          }
        }
      }
      if (next.loop !== undefined && next.loop !== loop) {
        loop = next.loop;
        changed = true;
      }
      if (next.duration !== undefined) {
        const nextDuration = normalizeCount(next.duration, DEFAULT_DURATION);
        if (nextDuration !== duration) {
          duration = nextDuration;
          changed = true;
        }
      }
      if (next.pauseOnHover !== undefined && next.pauseOnHover !== pauseOnHover) {
        pauseOnHover = next.pauseOnHover;
        if (hovered) {
          stopPlayTimer();
          if (!pauseOnHover) startPlayTimer();
        }
        changed = true;
      }
      if (next.onChange !== undefined) onChange = next.onChange;

      if (changed) notify();
    },

    prev() {
      if (!loop && state.value <= 0) return;
      moveTo(state.value - 1);
    },

    next() {
      if (!loop && state.value >= count() - 1) return;
      moveTo(state.value + 1);
    },

    goTo(index) {
      if (count() === 0) return;
      moveTo(clamp(Math.round(index)));
    },

    play() {
      startPlayTimer();
    },

    stop() {
      stopPlayTimer();
    },

    setHovered(hovering) {
      hovered = hovering;
      if (!pauseOnHover) return;
      if (hovering) {
        stopPlayTimer();
      } else if (autoplay) {
        startPlayTimer();
      }
    },

    destroy() {
      stopPlayTimer();
      clearSnapTimer();
      listeners.clear();
    },
  };
}
