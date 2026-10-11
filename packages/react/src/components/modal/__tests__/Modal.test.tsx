/**
 * Modal 组件测试（React 19 适配层）
 *
 * 覆盖：visible 受控/非受控显隐、createPortal 挂载 document.body、
 * 遮罩点击关闭（maskClosable）、ESC 关闭（closeOnEsc）、onOk/onCancel、
 * closable、renderTitle/renderFooter、width、ref 命令式 API（open/close）。
 *
 * 契约说明：当前 @xui/core 的 Modal onClose 回调不携带 source 载荷（无参调用），
 * ESC 配置项为 closeOnEsc，断言均按实际契约编写。
 */

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Modal } from '../index';
import type { ModalRef } from '../index';

describe('Modal 组件', () => {
  afterEach(() => {
    cleanup();
  });

  describe('显隐与挂载', () => {
    it('visible 为 false 时默认不渲染', () => {
      render(<Modal>内容</Modal>);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('visible 为 true 时经 createPortal 渲染到 document.body', () => {
      render(
        <Modal visible title="标题">
          内容
        </Modal>,
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog.closest('.xui-modal')?.parentElement).toBe(document.body);
      expect(document.body.querySelector('.xui-modal__overlay')).toBeInTheDocument();
      expect(screen.getByText('标题')).toBeInTheDocument();
      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('defaultVisible 提供非受控初始可见性', () => {
      render(<Modal defaultVisible>内容</Modal>);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('受控模式：外部变更 visible 同步显隐，且不触发 onOpen/onClose', () => {
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const { rerender } = render(
        <Modal visible={false} onOpen={onOpen} onClose={onClose}>
          内容
        </Modal>,
      );
      rerender(
        <Modal visible onOpen={onOpen} onClose={onClose}>
          内容
        </Modal>,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      rerender(
        <Modal visible={false} onOpen={onOpen} onClose={onClose}>
          内容
        </Modal>,
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onOpen).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it('width 为数字时按 px 输出，字符串原样输出', () => {
      const { rerender } = render(
        <Modal visible width={300}>
          内容
        </Modal>,
      );
      expect(screen.getByRole('dialog')).toHaveStyle({ width: '300px' });
      rerender(
        <Modal visible width="50%">
          内容
        </Modal>,
      );
      expect(screen.getByRole('dialog')).toHaveStyle({ width: '50%' });
    });

    it('width 默认 520（与 core 契约默认值一致）', () => {
      render(<Modal visible>内容</Modal>);
      expect(screen.getByRole('dialog')).toHaveStyle({ width: '520px' });
    });
  });

  describe('关闭交互', () => {
    it('点击遮罩关闭（maskClosable 默认开启）并触发 onClose', () => {
      const onClose = vi.fn();
      render(
        <Modal visible onClose={onClose}>
          内容
        </Modal>,
      );
      fireEvent.click(document.body.querySelector('.xui-modal__overlay') as Element);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('maskClosable 为 false 时点击遮罩不关闭', () => {
      const onClose = vi.fn();
      render(
        <Modal visible maskClosable={false} onClose={onClose}>
          内容
        </Modal>,
      );
      fireEvent.click(document.body.querySelector('.xui-modal__overlay') as Element);
      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('按 ESC 关闭（closeOnEsc 默认开启）并触发 onClose', () => {
      const onClose = vi.fn();
      render(
        <Modal visible onClose={onClose}>
          内容
        </Modal>,
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closeOnEsc 为 false 时按 ESC 不关闭', () => {
      const onClose = vi.fn();
      render(
        <Modal visible closeOnEsc={false} onClose={onClose}>
          内容
        </Modal>,
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('不可见时不监听 ESC', () => {
      const onClose = vi.fn();
      render(<Modal onClose={onClose}>内容</Modal>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('onClose 无参调用（当前契约不携带 source 载荷）', () => {
      const onClose = vi.fn();
      render(
        <Modal visible onClose={onClose}>
          内容
        </Modal>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'close' }));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith();
    });
  });

  describe('确认与取消', () => {
    it('点击确认触发 onOk 并自动关闭', () => {
      const onOk = vi.fn();
      const onClose = vi.fn();
      render(
        <Modal visible onOk={onOk} onClose={onClose}>
          内容
        </Modal>,
      );
      fireEvent.click(screen.getByRole('button', { name: '确认' }));
      expect(onOk).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('点击取消触发 onCancel 并自动关闭', () => {
      const onCancel = vi.fn();
      const onClose = vi.fn();
      render(
        <Modal visible onCancel={onCancel} onClose={onClose}>
          内容
        </Modal>,
      );
      fireEvent.click(screen.getByRole('button', { name: '取消' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closable 为 false 时不渲染右上角关闭按钮', () => {
      render(
        <Modal visible closable={false}>
          内容
        </Modal>,
      );
      expect(screen.queryByRole('button', { name: 'close' })).not.toBeInTheDocument();
    });
  });

  describe('自定义渲染', () => {
    it('renderTitle 覆盖 title prop', () => {
      render(
        <Modal visible title="契约标题" renderTitle={() => <b>自定义标题</b>}>
          内容
        </Modal>,
      );
      expect(screen.queryByText('契约标题')).not.toBeInTheDocument();
      expect(screen.getByText('自定义标题')).toBeInTheDocument();
    });

    it('renderFooter 覆盖默认确认/取消底部', () => {
      render(
        <Modal visible renderFooter={() => <div>自定义底部</div>}>
          内容
        </Modal>,
      );
      expect(screen.queryByRole('button', { name: '确认' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '取消' })).not.toBeInTheDocument();
      expect(screen.getByText('自定义底部')).toBeInTheDocument();
    });

    it('renderCloseIcon 自定义关闭图标，不渲染内置 svg', () => {
      render(
        <Modal visible renderCloseIcon={() => <i data-testid="custom-close">关</i>}>
          内容
        </Modal>,
      );
      const closeBtn = screen.getByRole('button', { name: 'close' });
      expect(closeBtn.querySelector('[data-testid="custom-close"]')).toBeInTheDocument();
      expect(closeBtn.querySelector('svg')).toBeNull();
    });
  });

  describe('ref 命令式 API', () => {
    it('open / close 控制非受控显隐并触发 onOpen/onClose', () => {
      const ref: { current: ModalRef | null } = { current: null };
      const onOpen = vi.fn();
      const onClose = vi.fn();
      render(
        <Modal ref={ref} onOpen={onOpen} onClose={onClose}>
          内容
        </Modal>,
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      act(() => {
        ref.current?.open();
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(onOpen).toHaveBeenCalledTimes(1);
      act(() => {
        ref.current?.close();
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
  describe('按钮文案与焦点管理', () => {
    it('默认底部按钮文案为 取消/确认，okText / cancelText 可自定义', () => {
      const { rerender } = render(<Modal visible>内容</Modal>);
      expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '确认' })).toBeInTheDocument();

      rerender(
        <Modal visible okText="好的" cancelText="关闭">
          内容
        </Modal>,
      );
      expect(screen.queryByRole('button', { name: '确认' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: '好的' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument();
    });

    it('焦点陷阱：Tab 从最后一个可聚焦元素循环回第一个', () => {
      render(<Modal visible>内容</Modal>);
      const dialog = screen.getByRole('dialog');
      const closeBtn = screen.getByRole('button', { name: 'close' });
      const okBtn = screen.getByRole('button', { name: '确认' });

      okBtn.focus();
      fireEvent.keyDown(dialog, { key: 'Tab' });
      expect(document.activeElement).toBe(closeBtn);
    });

    it('焦点陷阱：Shift+Tab 从第一个循环到最后一个', () => {
      render(<Modal visible>内容</Modal>);
      const dialog = screen.getByRole('dialog');
      const closeBtn = screen.getByRole('button', { name: 'close' });
      const okBtn = screen.getByRole('button', { name: '确认' });

      closeBtn.focus();
      fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(okBtn);
    });

    it('trapFocus=false 时不介入焦点循环', () => {
      render(
        <Modal visible trapFocus={false}>
          内容
        </Modal>,
      );
      const dialog = screen.getByRole('dialog');
      const okBtn = screen.getByRole('button', { name: '确认' });

      okBtn.focus();
      fireEvent.keyDown(dialog, { key: 'Tab' });
      expect(document.activeElement).toBe(okBtn);
    });

    it('打开时聚焦面板，关闭后焦点恢复到打开前的元素', () => {
      const { rerender } = render(
        <>
          <button id="modal-trigger">触发</button>
          <Modal visible={false}>内容</Modal>
        </>,
      );
      const trigger = document.getElementById('modal-trigger')!;
      trigger.focus();

      rerender(
        <>
          <button id="modal-trigger">触发</button>
          <Modal visible>内容</Modal>
        </>,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      rerender(
        <>
          <button id="modal-trigger">触发</button>
          <Modal visible={false}>内容</Modal>
        </>,
      );
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe('className / style 透传', () => {
    it('className / style 应用到对话框面板', () => {
      render(
        <Modal visible className="my-x" style={{ color: 'red' }}>
          内容
        </Modal>,
      );
      expect(screen.getByRole('dialog')).toHaveClass('xui-modal__panel', 'my-x');
      expect(screen.getByRole('dialog')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });
});
