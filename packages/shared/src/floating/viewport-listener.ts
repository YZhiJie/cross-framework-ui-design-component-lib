/**
 * 视口变化订阅（scroll / resize）
 *
 * CSS 包裹定位的浮层会随文档流自动跟随触发器，但滚动 / 缩放后可用空间变化，
 * 已展开浮层的翻转 / 钳制结果需要重算。scroll 以 capture 方式监听 window，
 * 任意祖先容器内滚动都会收到；回调经 rAF 合并，一帧内最多执行一次。
 * SSR / 无 window 环境下返回空解绑函数。
 */
export function bindViewportUpdate(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let frame: number | null = null;

  const schedule = () => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(() => {
      frame = null;
      callback();
    });
  };

  // capture：滚动事件不冒泡，祖先容器的滚动只能在捕获阶段于 window 收到
  window.addEventListener('scroll', schedule, true);
  window.addEventListener('resize', schedule);

  return () => {
    window.removeEventListener('scroll', schedule, true);
    window.removeEventListener('resize', schedule);
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
      frame = null;
    }
  };
}
