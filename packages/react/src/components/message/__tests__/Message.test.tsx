import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent } from '@testing-library/react';
import { message } from '../message';
import { getManager } from '../manager';

describe('message (react)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    message.closeAll();
    vi.useRealTimers();
  });

  it('message.info 渲染消息条目（默认 info 类型）', () => {
    act(() => {
      message.info('普通提示');
    });
    const items = document.querySelectorAll('.xui-message__item');
    expect(items).toHaveLength(1);
    expect(items[0].className).toContain('xui-message__item--info');
    expect(items[0].querySelector('.xui-message__content')?.textContent).toBe('普通提示');
    // 容器具备 aria-live 无障碍声明
    expect(document.querySelector('.xui-message')?.getAttribute('aria-live')).toBe('polite');
  });

  it('四种类型渲染对应修饰类', () => {
    act(() => {
      message.info('a');
      message.success('b');
      message.warning('c');
      message.error('d');
    });
    expect(document.querySelectorAll('.xui-message__item--info')).toHaveLength(1);
    expect(document.querySelectorAll('.xui-message__item--success')).toHaveLength(1);
    expect(document.querySelectorAll('.xui-message__item--warning')).toHaveLength(1);
    expect(document.querySelectorAll('.xui-message__item--error')).toHaveLength(1);
  });

  it('默认 3 秒自动关闭', () => {
    act(() => {
      message.info('自动关闭');
    });
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(0);
  });

  it('duration 0 不自动关闭，句柄 close 手动关闭', () => {
    let handle: { close: () => void };
    act(() => {
      handle = message.info('持久消息', { duration: 0 });
    });
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(1);
    act(() => {
      handle.close();
    });
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(0);
  });

  it('closable 渲染关闭按钮，点击关闭', () => {
    act(() => {
      message.info('可关闭', { closable: true, duration: 0 });
    });
    const close = document.querySelector<HTMLButtonElement>('.xui-message__close');
    expect(close).not.toBeNull();
    act(() => {
      fireEvent.click(close as HTMLElement);
    });
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(0);
  });

  it('closeAll 清空全部消息', () => {
    act(() => {
      message.info('a', { duration: 0 });
      message.success('b', { duration: 0 });
    });
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(2);
    act(() => {
      message.closeAll();
    });
    expect(document.querySelectorAll('.xui-message__item')).toHaveLength(0);
  });

  it('超出 maxCount 挤出最早一条', () => {
    const manager = getManager();
    manager.updateOptions({ maxCount: 2 });
    act(() => {
      message.info('a', { duration: 0 });
      message.info('b', { duration: 0 });
      message.info('c', { duration: 0 });
    });
    const texts = Array.from(document.querySelectorAll('.xui-message__content')).map(
      (el) => el.textContent,
    );
    expect(texts).toEqual(['b', 'c']);
    // 恢复默认，避免影响其他用例
    manager.updateOptions({ maxCount: 5 });
  });
});
