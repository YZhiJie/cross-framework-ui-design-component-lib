// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCarouselLogic } from '../create-carousel-logic';
import type { CarouselItem } from '../create-carousel-logic';

const items: CarouselItem[] = [
  { key: 'a', image: '/a.jpg' },
  { key: 'b', image: '/b.jpg' },
  { key: 'c', image: '/c.jpg' },
];

describe('createCarouselLogic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初始状态：defaultValue 越界钳制、position 与 value 一致', () => {
    const logic = createCarouselLogic({ items, defaultValue: 5 });
    expect(logic.getState()).toEqual({ value: 2, position: 2, animate: false, playing: false });
  });

  it('next 前进：animate 置真、onChange 触发、duration 后收敛', () => {
    const onChange = vi.fn();
    const logic = createCarouselLogic({ items, onChange });
    logic.next();
    expect(logic.getState().value).toBe(1);
    expect(logic.getState().position).toBe(1);
    expect(logic.getState().animate).toBe(true);
    expect(onChange).toHaveBeenCalledWith(1);
    vi.advanceTimersByTime(500);
    expect(logic.getState()).toEqual({ value: 1, position: 1, animate: false, playing: false });
  });

  it('loop 末尾环绕：瞬时指向 count 克隆位，收敛后回跳 0', () => {
    const onChange = vi.fn();
    const logic = createCarouselLogic({ items, onChange, defaultValue: 2 });
    logic.next();
    expect(onChange).toHaveBeenCalledWith(0);
    expect(logic.getState().value).toBe(0);
    expect(logic.getState().position).toBe(3);
    vi.advanceTimersByTime(500);
    expect(logic.getState().position).toBe(0);
  });

  it('prev 首位环绕：瞬时指向 -1 克隆位，收敛后回跳末位', () => {
    const logic = createCarouselLogic({ items });
    logic.prev();
    expect(logic.getState().value).toBe(2);
    expect(logic.getState().position).toBe(-1);
    vi.advanceTimersByTime(500);
    expect(logic.getState().position).toBe(2);
  });

  it('loop=false：首末位 prev/next no-op，范围内 goTo 正常', () => {
    const onChange = vi.fn();
    const logic = createCarouselLogic({ items, loop: false, onChange });
    logic.prev();
    expect(onChange).not.toHaveBeenCalled();
    logic.goTo(2);
    vi.advanceTimersByTime(500);
    logic.next();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(logic.getState().value).toBe(2);
  });

  it('动画进行中丢弃后续移动（防止克隆位越界）', () => {
    const onChange = vi.fn();
    const logic = createCarouselLogic({ items, onChange });
    logic.next();
    logic.next();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(logic.getState().position).toBe(1);
    vi.advanceTimersByTime(500);
    logic.next();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('goTo 越界钳制与同索引 no-op', () => {
    const onChange = vi.fn();
    const logic = createCarouselLogic({ items, onChange });
    logic.goTo(99);
    expect(logic.getState().value).toBe(2);
    vi.advanceTimersByTime(500);
    logic.goTo(-5);
    expect(logic.getState().value).toBe(0);
    vi.advanceTimersByTime(500);
    logic.goTo(0);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('autoplay：play/stop 控制定时器，tick 自动前进', () => {
    const logic = createCarouselLogic({ items });
    logic.play();
    expect(logic.getState().playing).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(logic.getState().value).toBe(1);
    logic.stop();
    expect(logic.getState().playing).toBe(false);
    vi.advanceTimersByTime(6000);
    expect(logic.getState().value).toBe(1);
  });

  it('pauseOnHover：悬停暂停、移出恢复；关闭后悬停不影响', () => {
    const logic = createCarouselLogic({ items });
    logic.play();
    logic.setHovered(true);
    expect(logic.getState().playing).toBe(false);
    vi.advanceTimersByTime(6000);
    expect(logic.getState().value).toBe(0);
    logic.setHovered(false);
    expect(logic.getState().playing).toBe(true);
    logic.setHovered(true);
    logic.updateOptions({ pauseOnHover: false });
    expect(logic.getState().playing).toBe(true);
  });

  it('autoplay=false 时 play no-op；updateOptions 开启后启动', () => {
    const logic = createCarouselLogic({ items, autoplay: false });
    logic.play();
    expect(logic.getState().playing).toBe(false);
    logic.updateOptions({ autoplay: true });
    expect(logic.getState().playing).toBe(true);
  });

  it('非循环自动播放到末位自动停止', () => {
    const logic = createCarouselLogic({ items, loop: false, defaultValue: 2 });
    logic.play();
    vi.advanceTimersByTime(3000);
    expect(logic.getState().playing).toBe(false);
    expect(logic.getState().value).toBe(2);
  });

  it('受控模式：内部不更新 value，仅回调 onChange，动画照常收敛', () => {
    const onChange = vi.fn();
    const logic = createCarouselLogic({ items, value: 0, onChange });
    logic.next();
    expect(onChange).toHaveBeenCalledWith(1);
    expect(logic.getState().value).toBe(0);
    expect(logic.getState().position).toBe(1);
    vi.advanceTimersByTime(500);
    expect(logic.getState().position).toBe(1);
  });

  it('受控回写回声：value 与动画目标一致时不打断切换动画', () => {
    const logic = createCarouselLogic({ items, value: 0 });
    logic.next();
    logic.updateOptions({ value: 1 });
    expect(logic.getState().value).toBe(1);
    expect(logic.getState().animate).toBe(true);
    vi.advanceTimersByTime(500);
    expect(logic.getState().animate).toBe(false);
  });

  it('受控外部跳变：立即同步 position 并收敛动画', () => {
    const logic = createCarouselLogic({ items, value: 0 });
    logic.next();
    logic.updateOptions({ value: 2 });
    expect(logic.getState().position).toBe(2);
    expect(logic.getState().animate).toBe(false);
    vi.advanceTimersByTime(500);
    expect(logic.getState().position).toBe(2);
  });

  it('items 数量变化：钳制索引、收敛动画；少于 2 张停止自动播放', () => {
    const logic = createCarouselLogic({ items, defaultValue: 2 });
    logic.play();
    logic.updateOptions({ items: items.slice(0, 1) });
    expect(logic.getState().value).toBe(0);
    expect(logic.getState().position).toBe(0);
    expect(logic.getState().playing).toBe(false);
  });

  it('interval 变更重启播放定时器', () => {
    const logic = createCarouselLogic({ items });
    logic.play();
    logic.updateOptions({ interval: 1000 });
    vi.advanceTimersByTime(1000);
    expect(logic.getState().value).toBe(1);
  });

  it('destroy 清理全部定时器', () => {
    const onChange = vi.fn();
    const logic = createCarouselLogic({ items, onChange });
    logic.next();
    logic.play();
    logic.destroy();
    vi.advanceTimersByTime(10000);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(logic.getState().playing).toBe(false);
  });
});
