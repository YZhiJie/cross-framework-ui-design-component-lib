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
});
