/**
 * Modal - React 19 适配层
 *
 * 使用 ref-as-prop + useSyncExternalStore 桥接 @xui/shared 逻辑。
 * 通过 createPortal 渲染到 document.body，ESC / 遮罩点击关闭由逻辑层判断。
 * 通过 useImperativeHandle 暴露 open / close。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps } from '@xui/core';
import { createModalLogic } from '@xui/shared';
import { trapFocus as trapFocusIn } from '@xui/shared';
import { icons } from '@xui/icons';
import type { ModalLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Modal 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type ModalComponentProps = ModalProps & {
  /** 弹窗内容 */
  children?: ReactNode;
  /** 自定义标题（覆盖 title prop） */
  renderTitle?: () => ReactNode;
  /** 自定义底部操作区 */
  renderFooter?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<ModalRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface ModalRef {
  open: () => void;
  close: () => void;
}

export function Modal(props: ModalComponentProps) {
  const {
    visible,
    defaultVisible,
    title,
    width = 520,
    closable = true,
    maskClosable = true,
    closeOnEsc = true,
    okText = '确认',
    cancelText = '取消',
    trapFocus = true,
    className,
    style,
    onOpen,
    onClose,
    onOk,
    onCancel,
    children,
    renderTitle,
    renderFooter,
    ref,
  } = props;

  // 回调 latest-ref：App 每次重渲染都会新建箭头函数，若回调进入 updateOptions 的
  // effect 依赖，命令式 open() 后的任意重渲染都会用受控旧值把 visible 打回 false。
  // 因此回调统一经 callbacksRef 间接调用，updateOptions 只同步状态类 props。
  const callbacksRef = useRef({ onOpen, onClose, onOk, onCancel });
  callbacksRef.current = { onOpen, onClose, onOk, onCancel };

  // 逻辑实例只创建一次：visible 提供即受控，否则用 defaultVisible 非受控
  const logicRef = useRef<ModalLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createModalLogic({
      visible,
      defaultVisible,
      closable,
      maskClosable,
      closeOnEsc,
      onOpen: () => callbacksRef.current.onOpen?.(),
      onClose: () => callbacksRef.current.onClose?.(),
      onOk: () => callbacksRef.current.onOk?.(),
      onCancel: () => callbacksRef.current.onCancel?.(),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（visible 为受控同步，仅更新状态不触发回调）
  useEffect(() => {
    logic.updateOptions({
      visible,
      closable,
      maskClosable,
      closeOnEsc,
    });
  }, [logic, visible, closable, maskClosable, closeOnEsc]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      open: () => logic.open(),
      close: () => logic.close(),
    }),
    [logic],
  );

  // ESC 关闭监听
  useEffect(() => {
    if (!state.visible || !closeOnEsc) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') logic.handleEsc();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [state.visible, closeOnEsc, logic]);

  // 焦点管理：打开时记录此前焦点并聚焦面板，关闭时归还（焦点恢复）
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!state.visible) {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
      return;
    }
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus();
  }, [state.visible]);

  /** 面板按键：ESC 关闭 + Tab 焦点循环（trapFocus 关闭时不介入） */
  const handlePanelKeydown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      logic.handleEsc();
      return;
    }
    if (trapFocus) {
      trapFocusIn(e.nativeEvent, e.currentTarget);
    }
  };

  const handleMaskClick = () => {
    logic.handleMaskClick();
  };
  const handleOk = () => {
    logic.handleOk();
  };
  const handleCancel = () => {
    logic.handleCancel();
  };
  const handleClose = () => {
    logic.close();
  };

  const panelStyle: CSSProperties = {};
  if (width !== undefined) {
    panelStyle.width = typeof width === 'number' ? `${width}px` : width;
  }

  if (!state.visible) return null;

  return createPortal(
    <div className="xui-modal">
      <div className="xui-modal__overlay" onClick={handleMaskClick} />
      <div
        ref={panelRef}
        className={cn('xui-modal__panel', className)}
        style={{ ...panelStyle, ...(style as CSSProperties) }}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onKeyDown={handlePanelKeydown}
      >
        <div className="xui-modal__header">
          <span className="xui-modal__title">{renderTitle ? renderTitle() : (title ?? null)}</span>
          {state.closable && (
            <button
              type="button"
              className="xui-modal__close"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        <div className="xui-modal__body">{children}</div>
        {renderFooter ? (
          <div className="xui-modal__footer">{renderFooter()}</div>
        ) : (
          <div className="xui-modal__footer">
            <button
              type="button"
              className={cn('xui-button', 'xui-button--md')}
              onClick={handleCancel}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={cn('xui-button', 'xui-button--primary', 'xui-button--md')}
              onClick={handleOk}
            >
              {okText}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** 关闭图标（数据来自 @xui/icons） */
function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      dangerouslySetInnerHTML={{ __html: icons.close }}
    />
  );
}
