import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMessageManager, messageDefaults } from '../create-message-logic';

describe('createMessageManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('open 应用默认值（type info / closable false）且 id 自增', () => {
    const manager = createMessageManager();
    manager.open({ content: '第一条' });
    manager.open({ content: '第二条', type: 'success', closable: true });

    const { items } = manager.getState();
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ id: 1, type: 'info', content: '第一条', closable: false });
    expect(items[1]).toMatchObject({ id: 2, type: 'success', content: '第二条', closable: true });
  });

  it('open 返回句柄，close 手动关闭对应消息', () => {
    const manager = createMessageManager();
    const keep = manager.open({ content: '保留' });
    const drop = manager.open({ content: '关闭我' });

    drop.close();
    expect(manager.getState().items.map((item) => item.content)).toEqual(['保留']);

    keep.close();
    expect(manager.getState().items).toEqual([]);
  });

  it('close 对不存在的 id 安全（不抛错）', () => {
    const manager = createMessageManager();
    manager.open({ content: '消息' });
    manager.close(999);
    expect(manager.getState().items).toHaveLength(1);
  });

  it('duration 默认 3000ms 自动关闭', () => {
    const manager = createMessageManager();
    manager.open({ content: '自动关闭' });

    vi.advanceTimersByTime(2999);
    expect(manager.getState().items).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(manager.getState().items).toEqual([]);
  });

  it('duration 0 表示不自动关闭', () => {
    const manager = createMessageManager();
    manager.open({ content: '持久消息', duration: 0 });

    vi.advanceTimersByTime(60_000);
    expect(manager.getState().items).toHaveLength(1);
  });

  it('重复 close 同一条消息安全（句柄与定时器均不抛错）', () => {
    const manager = createMessageManager();
    const handle = manager.open({ content: '消息' });
    handle.close();
    handle.close();
    vi.advanceTimersByTime(5000);
    expect(manager.getState().items).toEqual([]);
  });

  it('超出默认 maxCount(5) 时挤出最早一条', () => {
    const manager = createMessageManager();
    for (let i = 1; i <= 6; i += 1) {
      manager.open({ content: `消息${i}` });
    }
    const ids = manager.getState().items.map((item) => item.id);
    expect(ids).toEqual([2, 3, 4, 5, 6]);
  });

  it('创建时自定义 maxCount 生效', () => {
    const manager = createMessageManager({ maxCount: 2 });
    manager.open({ content: 'a' });
    manager.open({ content: 'b' });
    manager.open({ content: 'c' });
    expect(manager.getState().items.map((item) => item.content)).toEqual(['b', 'c']);
  });

  it('updateOptions 缩小 maxCount 时立即挤出最早的超额消息', () => {
    const manager = createMessageManager();
    manager.open({ content: 'a' });
    manager.open({ content: 'b' });
    manager.open({ content: 'c' });

    manager.updateOptions({ maxCount: 1 });
    expect(manager.getState().items.map((item) => item.content)).toEqual(['c']);
  });

  it('closeAll 清空队列，定时器一并清理', () => {
    const manager = createMessageManager();
    manager.open({ content: 'a' });
    manager.open({ content: 'b' });

    manager.closeAll();
    expect(manager.getState().items).toEqual([]);

    // 定时器已清理：时间推进不应有任何残留动作
    vi.advanceTimersByTime(10_000);
    expect(manager.getState().items).toEqual([]);
  });

  it('subscribe 通知快照，items 为独立引用', () => {
    const manager = createMessageManager();
    const snapshots: number[] = [];
    const unsubscribe = manager.subscribe((state) => {
      snapshots.push(state.items.length);
      state.items.push({ id: 999, type: 'info', content: '污染', closable: false });
    });

    manager.open({ content: '消息' });
    // 快照是浅拷贝：外部修改不影响内部状态
    expect(manager.getState().items.map((item) => item.id)).toEqual([1]);
    unsubscribe();
    manager.open({ content: '第二条' });
    expect(snapshots).toEqual([1]);
    expect(manager.getState().items).toHaveLength(2);
  });

  it('messageDefaults 契约值正确', () => {
    expect(messageDefaults).toEqual({ type: 'info', duration: 3000, closable: false, maxCount: 5 });
  });

  describe('key 更新语义', () => {
    it('同 key 再次 open 原地更新内容，不新增条目', () => {
      const manager = createMessageManager();
      manager.open({ content: '上传中 0%', key: 'upload', duration: 0 });
      manager.open({ content: '上传中 50%', key: 'upload', type: 'success', duration: 0 });

      const { items } = manager.getState();
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        id: 1,
        type: 'success',
        content: '上传中 50%',
        key: 'upload',
      });
    });

    it('不同 key 正常新增，互不影响', () => {
      const manager = createMessageManager();
      manager.open({ content: 'A', key: 'a', duration: 0 });
      manager.open({ content: 'B', key: 'b', duration: 0 });

      expect(manager.getState().items.map((item) => item.content)).toEqual(['A', 'B']);
    });

    it('更新重置计时：新 duration 生效，旧定时器被清理', () => {
      const manager = createMessageManager();
      manager.open({ content: '进度 0%', key: 'progress', duration: 1000 });
      vi.advanceTimersByTime(999);
      manager.open({ content: '进度 100%', key: 'progress', duration: 3000 });

      // 旧 1000ms 定时器已清理：999 + 任意时间后仍存活，直到新 3000ms 计满
      vi.advanceTimersByTime(2000);
      expect(manager.getState().items).toHaveLength(1);
      vi.advanceTimersByTime(1000);
      expect(manager.getState().items).toHaveLength(0);
    });

    it('更新为 duration 0 后不再自动关闭', () => {
      const manager = createMessageManager();
      manager.open({ content: '进度', key: 'p', duration: 1000 });
      manager.open({ content: '完成', key: 'p', duration: 0 });

      vi.advanceTimersByTime(60_000);
      expect(manager.getState().items).toHaveLength(1);
    });

    it('同 key 更新后句柄关闭的是更新后的那条消息', () => {
      const manager = createMessageManager();
      const first = manager.open({ content: '第一次', key: 'k', duration: 0 });
      const second = manager.open({ content: '第二次', key: 'k', duration: 0 });

      second.close();
      expect(manager.getState().items).toEqual([]);

      // 旧句柄指向同一 id，重复关闭安全
      first.close();
      expect(manager.getState().items).toEqual([]);
    });

    it('更新时未传 type / closable 保留原值', () => {
      const manager = createMessageManager();
      manager.open({ content: '原内容', type: 'warning', closable: true, key: 'k', duration: 0 });
      manager.open({ content: '新内容', key: 'k', duration: 0 });

      const { items } = manager.getState();
      expect(items[0]).toMatchObject({ type: 'warning', closable: true, content: '新内容' });
    });
  });

  describe('onClose 回调', () => {
    it('句柄手动关闭时触发', () => {
      const manager = createMessageManager();
      const onClose = vi.fn();
      const handle = manager.open({ content: '消息', onClose });

      handle.close();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('duration 自动关闭时触发', () => {
      const manager = createMessageManager();
      const onClose = vi.fn();
      manager.open({ content: '消息', duration: 1000, onClose });

      vi.advanceTimersByTime(1000);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('超出 maxCount 被挤出时触发', () => {
      const manager = createMessageManager({ maxCount: 1 });
      const firstClose = vi.fn();
      const secondClose = vi.fn();
      manager.open({ content: '第一条', onClose: firstClose });
      manager.open({ content: '第二条', onClose: secondClose });

      expect(firstClose).toHaveBeenCalledTimes(1);
      expect(secondClose).not.toHaveBeenCalled();
    });

    it('closeAll 逐条触发', () => {
      const manager = createMessageManager();
      const onCloseA = vi.fn();
      const onCloseB = vi.fn();
      manager.open({ content: 'A', onClose: onCloseA });
      manager.open({ content: 'B', onClose: onCloseB });

      manager.closeAll();
      expect(onCloseA).toHaveBeenCalledTimes(1);
      expect(onCloseB).toHaveBeenCalledTimes(1);
    });

    it('同 key 更新可替换 onClose 回调', () => {
      const manager = createMessageManager();
      const firstClose = vi.fn();
      const secondClose = vi.fn();
      manager.open({ content: '第一次', key: 'k', onClose: firstClose });
      manager.open({ content: '第二次', key: 'k', onClose: secondClose });

      manager.closeAll();
      expect(firstClose).not.toHaveBeenCalled();
      expect(secondClose).toHaveBeenCalledTimes(1);
    });
  });

  it('icon 自定义图标透传到 MessageItem；不传为 undefined', () => {
    const logic = createMessageManager();
    logic.open({ content: '自定义图标', icon: '<circle cx="1" cy="1" r="1" />' });
    expect(logic.getState().items[0].icon).toBe('<circle cx="1" cy="1" r="1" />');

    logic.open({ content: '默认图标' });
    expect(logic.getState().items[1].icon).toBeUndefined();

    // 同 key 更新：icon 未传保留旧值，传入时替换
    logic.open({ content: 'a', key: 'k', icon: '<path d="M1 1" />' });
    logic.open({ content: 'b', key: 'k' });
    expect(logic.getState().items[2].icon).toBe('<path d="M1 1" />');
    logic.closeAll();
  });
});
