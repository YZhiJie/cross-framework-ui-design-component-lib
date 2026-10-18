// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getViewport, resolveFloatingPosition } from '../resolve-floating-position';
import type { FloatingRect, FloatingViewport } from '../resolve-floating-position';

/** 构造视口坐标矩形 */
function rect(left: number, top: number, width: number, height: number): FloatingRect {
  return { left, top, width, height, right: left + width, bottom: top + height };
}

/** 1000×800 标准视口 */
const viewport: FloatingViewport = { top: 0, left: 0, right: 1000, bottom: 800 };

/** 视口中部的触发器（四周空间充足，200×40） */
const centerTrigger = rect(400, 380, 200, 40);
/** 120×60 的浮层 */
const popper = rect(0, 0, 120, 60);

describe('resolveFloatingPosition', () => {
  it('空间充足时保持首选方位，居中对齐无需 shift', () => {
    expect(resolveFloatingPosition(centerTrigger, popper, viewport, { placement: 'top' })).toEqual({
      placement: 'top',
      shift: 0,
    });
    expect(
      resolveFloatingPosition(centerTrigger, popper, viewport, { placement: 'right' }),
    ).toEqual({ placement: 'right', shift: 0 });
  });

  it('首选 top 空间不足且下方更足时翻转为 bottom', () => {
    // 触发器顶部距视口顶仅 20px，浮层需 60+8=68px
    const trigger = rect(400, 20, 200, 40);
    const result = resolveFloatingPosition(trigger, popper, viewport, { placement: 'top' });
    expect(result.placement).toBe('bottom');
  });

  it('首选 bottom 空间不足且上方更足时翻转为 top', () => {
    // 触发器底边距视口底仅 30px
    const trigger = rect(400, 730, 200, 40);
    const result = resolveFloatingPosition(trigger, popper, viewport, { placement: 'bottom' });
    expect(result.placement).toBe('top');
  });

  it('left / right 方位空间不足时水平翻转', () => {
    const triggerNearLeft = rect(20, 380, 80, 40);
    expect(
      resolveFloatingPosition(triggerNearLeft, popper, viewport, { placement: 'left' }).placement,
    ).toBe('right');

    const triggerNearRight = rect(900, 380, 80, 40);
    expect(
      resolveFloatingPosition(triggerNearRight, popper, viewport, { placement: 'right' }).placement,
    ).toBe('left');
  });

  it('top/bottom 浮层水平居中会溢出左边缘时向右 shift 到安全区', () => {
    // 触发器左边缘 10px，浮层宽 200：理想 left = 10 + (60-200)/2 = -60，应钳到 padding 8
    const trigger = rect(10, 380, 60, 40);
    const widePopper = rect(0, 0, 200, 60);
    const result = resolveFloatingPosition(trigger, widePopper, viewport, {
      placement: 'top',
      viewportPadding: 8,
    });
    expect(result.placement).toBe('top');
    expect(result.shift).toBe(68);
  });

  it('top/bottom 浮层水平居中会溢出右边缘时向左 shift', () => {
    // 触发器右边缘 990，浮层宽 200：理想 left = 990 - 100 - ... = 960，右边到 1160，钳制 maxLeft=792
    const trigger = rect(930, 380, 60, 40);
    const widePopper = rect(0, 0, 200, 60);
    const result = resolveFloatingPosition(trigger, widePopper, viewport, {
      placement: 'bottom',
      viewportPadding: 8,
    });
    expect(result.shift).toBeCloseTo(792 - (930 + (60 - 200) / 2), 5);
  });

  it('left/right 浮层垂直方向溢出时做垂直 shift', () => {
    const trigger = rect(400, 10, 120, 40);
    const tallPopper = rect(0, 0, 120, 200);
    // 理想 top = 10 + (40-200)/2 = -70，钳到 padding 8 → shift 78
    const result = resolveFloatingPosition(trigger, tallPopper, viewport, {
      placement: 'right',
      viewportPadding: 8,
    });
    expect(result.shift).toBe(78);
  });

  it('两侧空间都不足时保持首选方位（不翻转到更差的一侧）', () => {
    // 触发器与浮层均几乎占满视口高度
    const trigger = rect(100, 300, 80, 200);
    const tallPopper = rect(0, 0, 120, 400);
    const result = resolveFloatingPosition(trigger, tallPopper, viewport, { placement: 'top' });
    expect(result.placement).toBe('top');
  });

  it('自定义 gap 参与翻转空间判定', () => {
    // 上方空间恰好 70：默认 gap 8 时放不下（需 68——放得下）；gap 20 时需 80 放不下
    const trigger = rect(400, 70, 200, 40);
    expect(resolveFloatingPosition(trigger, popper, viewport, { placement: 'top' }).placement).toBe(
      'top',
    );
    expect(
      resolveFloatingPosition(trigger, popper, viewport, { placement: 'top', gap: 20 }).placement,
    ).toBe('bottom');
  });
});

describe('getViewport', () => {
  it('无 window 环境（SSR）降级为零矩形', () => {
    expect(getViewport()).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });
});
