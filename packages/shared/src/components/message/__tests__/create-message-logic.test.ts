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
});
