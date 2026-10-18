// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import { bindViewportUpdate } from '../viewport-listener';
import { getViewport } from '../resolve-floating-position';

/** 手动驱动的 requestAnimationFrame：收集回调，flush 时逐帧执行 */
function mockRaf() {
  const frames = new Map<number, FrameRequestCallback>();
  let nextId = 1;
  const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    const id = nextId;
    nextId += 1;
    frames.set(id, cb);
    return id;
  });
  const caf = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id);
  });
  const flush = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((cb) => cb(0));
  };
  return { raf, caf, flush, frames };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bindViewportUpdate', () => {
  it('scroll（capture）触发经 rAF 合并的回调', () => {
    const { flush } = mockRaf();
    const callback = vi.fn();
    const unbind = bindViewportUpdate(callback);

    window.dispatchEvent(new Event('scroll'));
    // rAF 未 flush 前不回调
    expect(callback).not.toHaveBeenCalled();
    flush();
    expect(callback).toHaveBeenCalledTimes(1);

    unbind();
  });

  it('resize 同样触发回调', () => {
    const { flush } = mockRaf();
    const callback = vi.fn();
    const unbind = bindViewportUpdate(callback);

    window.dispatchEvent(new Event('resize'));
    flush();
    expect(callback).toHaveBeenCalledTimes(1);

    unbind();
  });

  it('同一帧内多次事件仅回调一次', () => {
    const { raf, flush } = mockRaf();
    const callback = vi.fn();
    const unbind = bindViewportUpdate(callback);

    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
    // 仅调度了一帧
    expect(raf).toHaveBeenCalledTimes(1);
    flush();
    expect(callback).toHaveBeenCalledTimes(1);

    unbind();
  });

  it('解绑后不再监听事件，且取消未执行的帧', () => {
    const { caf, flush } = mockRaf();
    const callback = vi.fn();
    const unbind = bindViewportUpdate(callback);

    window.dispatchEvent(new Event('scroll'));
    unbind();
    // 挂起的帧被取消
    expect(caf).toHaveBeenCalledTimes(1);
    flush();
    expect(callback).not.toHaveBeenCalled();

    // 解绑后新事件不再调度
    window.dispatchEvent(new Event('scroll'));
    flush();
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('getViewport（jsdom）', () => {
  it('返回 window 尺寸矩形', () => {
    expect(getViewport()).toEqual({
      top: 0,
      left: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    });
  });
});
