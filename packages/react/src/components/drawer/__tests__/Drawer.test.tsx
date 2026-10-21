/**
 * Drawer 组件测试（React 19 适配层）
 *
 * 覆盖：visible 受控/非受控显隐、createPortal 挂载 document.body、
 * placement 四方向、size 尺寸、遮罩点击关闭（mask/maskClosable）、
 * ESC 关闭（closeOnEsc）、closable、renderTitle/renderFooter/renderCloseIcon、
 * 焦点恢复、ref 命令式 API（open/close/toggle）。
 */

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Drawer } from '../index';
import type { DrawerRef } from '../index';

describe('Drawer 组件', () => {
  afterEach(() => {
    cleanup();
  });

  describe('显隐与挂载', () => {
    it('visible 为 false 时默认不渲染', () => {
      render(<Drawer>内容</Drawer>);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('visible 为 true 时经 createPortal 渲染到 document.body', () => {
      render(
        <Drawer visible title="标题">
          内容
        </Drawer>,
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog.closest('.xui-drawer')?.parentElement).toBe(document.body);
      expect(document.body.querySelector('.xui-drawer__overlay')).toBeInTheDocument();
      expect(screen.getByText('标题')).toBeInTheDocument();
      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('defaultVisible 提供非受控初始可见性', () => {
      render(<Drawer defaultVisible>内容</Drawer>);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('受控模式：外部变更 visible 同步显隐，且不触发 onOpen/onClose', async () => {
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const { rerender } = render(
        <Drawer visible={false} onOpen={onOpen} onClose={onClose}>
          内容
        </Drawer>,
      );
      rerender(
        <Drawer visible onOpen={onOpen} onClose={onClose}>
          内容
        </Drawer>,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      rerender(
        <Drawer visible={false} onOpen={onOpen} onClose={onClose}>
          内容
        </Drawer>,
      );
      // 退场动画期间保留 DOM，播完后卸载
      expect(document.body.querySelector('.xui-drawer.is-leaving')).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(onOpen).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it('退场动画期间重新打开会取消卸载', async () => {
      const { rerender } = render(<Drawer visible>内容</Drawer>);

      rerender(<Drawer visible={false}>内容</Drawer>);
      expect(document.body.querySelector('.xui-drawer.is-leaving')).toBeInTheDocument();

      rerender(<Drawer visible>内容</Drawer>);
      expect(document.body.querySelector('.xui-drawer.is-leaving')).not.toBeInTheDocument();

      await new Promise((resolve) => setTimeout(resolve, 320));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('placement 与 size', () => {
    it('placement 渲染方向类名，默认 right', () => {
      const { rerender } = render(<Drawer visible>内容</Drawer>);
      expect(document.body.querySelector('.xui-drawer--right')).toBeInTheDocument();

      rerender(
        <Drawer visible placement="left">
          内容
        </Drawer>,
      );
      expect(document.body.querySelector('.xui-drawer--left')).toBeInTheDocument();

      rerender(
        <Drawer visible placement="top">
          内容
        </Drawer>,
      );
      expect(document.body.querySelector('.xui-drawer--top')).toBeInTheDocument();

      rerender(
        <Drawer visible placement="bottom">
          内容
        </Drawer>,
      );
      expect(document.body.querySelector('.xui-drawer--bottom')).toBeInTheDocument();
    });

    it('size 数字按 px 输出：左右方向为宽度', () => {
      render(
        <Drawer visible size={400}>
          内容
        </Drawer>,
      );
      expect(screen.getByRole('dialog')).toHaveStyle({ width: '400px' });
    });

    it('size 字符串原样输出：上下方向为高度', () => {
      render(
        <Drawer visible placement="top" size="50%">
          内容
        </Drawer>,
      );
      expect(screen.getByRole('dialog')).toHaveStyle({ height: '50%' });
    });

    it('默认 size 为 378', () => {
      render(<Drawer visible>内容</Drawer>);
      expect(screen.getByRole('dialog')).toHaveStyle({ width: '378px' });
    });
  });

  describe('关闭交互', () => {
    it('遮罩点击触发 onClose 并关闭（非受控）', async () => {
      const onClose = vi.fn();
      render(
        <Drawer defaultVisible onClose={onClose}>
          内容
        </Drawer>,
      );
      fireEvent.click(document.body.querySelector('.xui-drawer__overlay')!);
      expect(onClose).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('maskClosable=false 时遮罩点击不关闭', () => {
      const onClose = vi.fn();
      render(
        <Drawer defaultVisible maskClosable={false} onClose={onClose}>
          内容
        </Drawer>,
      );
      fireEvent.click(document.body.querySelector('.xui-drawer__overlay')!);
      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('mask=false 时不渲染遮罩，且面板不声明 aria-modal', () => {
      render(
        <Drawer defaultVisible mask={false}>
          内容
        </Drawer>,
      );
      expect(document.body.querySelector('.xui-drawer__overlay')).not.toBeInTheDocument();
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
    });

    it('ESC 触发 onClose 并关闭（document keydown）', async () => {
      const onClose = vi.fn();
      render(
        <Drawer defaultVisible onClose={onClose}>
          内容
        </Drawer>,
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('closeOnEsc=false 时 ESC 不关闭', () => {
      render(
        <Drawer defaultVisible closeOnEsc={false}>
          内容
        </Drawer>,
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('面板上按 ESC 也触发关闭', () => {
      const onClose = vi.fn();
      render(
        <Drawer defaultVisible onClose={onClose}>
          内容
        </Drawer>,
      );
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('点击关闭按钮触发 onClose', async () => {
      const onClose = vi.fn();
      render(
        <Drawer defaultVisible onClose={onClose}>
          内容
        </Drawer>,
      );
      fireEvent.click(document.body.querySelector('.xui-drawer__close')!);
      expect(onClose).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('closable=false 时不渲染关闭按钮', () => {
      render(
        <Drawer defaultVisible closable={false}>
          内容
        </Drawer>,
      );
      expect(document.body.querySelector('.xui-drawer__close')).not.toBeInTheDocument();
    });
  });

  describe('自定义渲染', () => {
    it('renderTitle 覆盖 title 属性', () => {
      render(
        <Drawer visible title="标题" renderTitle={() => <b className="custom-title">自定义</b>}>
          内容
        </Drawer>,
      );
      expect(document.body.querySelector('.custom-title')?.textContent).toBe('自定义');
      expect(document.body.querySelector('.xui-drawer__title b')).toBeInTheDocument();
    });

    it('renderFooter 提供时渲染底部操作区，未提供时不渲染', () => {
      const { rerender } = render(<Drawer visible>内容</Drawer>);
      expect(document.body.querySelector('.xui-drawer__footer')).not.toBeInTheDocument();

      rerender(
        <Drawer visible renderFooter={() => <button className="f-btn">提交</button>}>
          内容
        </Drawer>,
      );
      expect(document.body.querySelector('.xui-drawer__footer')).toBeInTheDocument();
      expect(document.body.querySelector('.f-btn')?.textContent).toBe('提交');
    });

    it('renderCloseIcon 替换内置关闭图标', () => {
      render(
        <Drawer visible renderCloseIcon={() => <i className="my-close-x">x</i>}>
          内容
        </Drawer>,
      );
      const close = document.body.querySelector('.xui-drawer__close')!;
      expect(close.querySelector('.my-close-x')).toBeInTheDocument();
      expect(close.querySelector('svg')).not.toBeInTheDocument();
    });

    it('className / style 透传到抽屉面板', () => {
      render(
        <Drawer visible className="my-x" style={{ color: 'red' }}>
          内容
        </Drawer>,
      );
      const panel = screen.getByRole('dialog');
      expect(panel.classList.contains('my-x')).toBe(true);
      expect(panel.style.color).toBe('red');
    });
  });

  describe('焦点管理', () => {
    it('打开时聚焦面板，关闭后焦点恢复到打开前的元素', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();

      const { rerender } = render(<Drawer visible>内容</Drawer>);
      expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);

      rerender(<Drawer visible={false}>内容</Drawer>);
      expect(document.activeElement).toBe(trigger);

      trigger.remove();
    });
  });

  describe('ref 命令式 API', () => {
    it('open / close / toggle 控制显隐并触发 onOpen / onClose', async () => {
      const ref = createRef<DrawerRef>();
      const onOpen = vi.fn();
      const onClose = vi.fn();
      render(
        <Drawer ref={ref} onOpen={onOpen} onClose={onClose}>
          内容
        </Drawer>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      act(() => ref.current!.open());
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      act(() => ref.current!.toggle());
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(document.body.querySelector('.xui-drawer.is-leaving')).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

      act(() => ref.current!.toggle());
      expect(onOpen).toHaveBeenCalledTimes(2);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      act(() => ref.current!.close());
      expect(onClose).toHaveBeenCalledTimes(2);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });
  });
});
