import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { message } from '../message';
import { getManager } from '../manager';

describe('message (vue)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    message.closeAll();
    vi.useRealTimers();
  });

  it('message.info 渲染消息条目（默认 info 类型）', async () => {
    message.info('普通提示');
    await nextTick();
    const items = document.querySelectorAll('.xui-message__item');
    expect(items).toHaveLength(1);
    expect(items[0].className).toContain('xui-message__item--info');
    expect(items[0].querySelector('.xui-message__content')?.textContent).toBe('普通提示');
    // 容器具备 aria-live 无障碍声明
    expect(document.querySelector('.xui-message')?.getAttribute('aria-live')).toBe('polite');
  });

  it('四种类型渲染对应修饰类', async () => {
    message.info('a');
    message.success('b');
    message.warning('c');
    message.error('d');
    await nextTick();
    expect(document.querySelectorAll('.xui-message__item--info')).toHaveLength(1);
    expect(document.querySelectorAll('.xui-message__item--success')).toHaveLength(1);
    expect(document.querySelectorAll('.xui-message__item--warning')).toHaveLength(1);
    expect(document.querySelectorAll('.xui-message__item--error')).toHaveLength(1);
  });

  it('默认 3 秒自动关闭', async () => {
    message.info('自动关闭');
    await nextTick();
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(1);
    vi.advanceTimersByTime(3000);
    await nextTick();
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(0);
  });

  it('duration 0 不自动关闭，句柄 close 手动关闭', async () => {
    const handle = message.info('持久消息', { duration: 0 });
    vi.advanceTimersByTime(10_000);
    await nextTick();
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(1);
    handle.close();
    await nextTick();
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(0);
  });

  it('closable 渲染关闭按钮，点击关闭', async () => {
    message.info('可关闭', { closable: true, duration: 0 });
    await nextTick();
    const close = document.querySelector<HTMLButtonElement>('.xui-message__close');
    expect(close).not.toBeNull();
    close?.click();
    await nextTick();
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(0);
  });

  it('closeAll 清空全部消息', async () => {
    message.info('a', { duration: 0 });
    message.success('b', { duration: 0 });
    await nextTick();
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(2);
    message.closeAll();
    await nextTick();
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(0);
  });

  it('超出 maxCount 挤出最早一条', async () => {
    const manager = getManager();
    manager.updateOptions({ maxCount: 2 });
    message.info('a', { duration: 0 });
    message.info('b', { duration: 0 });
    message.info('c', { duration: 0 });
    await nextTick();
    const texts = Array.from(document.querySelectorAll('.xui-message__content')).map(
      (el) => el.textContent,
    );
    expect(texts).toEqual(['b', 'c']);
    // 恢复默认，避免影响其他用例
    manager.updateOptions({ maxCount: 5 });
  });
  it('同 key 再次 open 原地更新该条（不新增）', async () => {
    message.open({ content: '上传中 0%', key: 'upload', duration: 0 });
    await nextTick();
    message.open({ content: '上传完成', key: 'upload', type: 'success', duration: 0 });
    await nextTick();
    const items = document.querySelectorAll('.xui-message__item');
    expect(items).toHaveLength(1);
    expect(items[0].querySelector('.xui-message__content')?.textContent).toBe('上传完成');
    expect(items[0].className).toContain('xui-message__item--success');
  });

  it('onClose 在消息自动关闭时触发', async () => {
    const onClose = vi.fn();
    message.open({ content: '回调', duration: 1000, onClose });
    await nextTick();
    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('icon 选项渲染自定义类型图标', async () => {
    message.open({ content: '自定义', icon: '<circle cx="1" cy="1" r="1" />' });
    await nextTick();
    const icons = document.querySelectorAll('.xui-message__icon');
    const last = icons[icons.length - 1] as SVGElement;
    expect(last.innerHTML).toContain('cx="1" cy="1" r="1"');
    message.closeAll();
  });
});
