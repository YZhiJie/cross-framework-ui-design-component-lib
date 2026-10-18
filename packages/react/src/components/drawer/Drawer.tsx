/**
 * Drawer - React 19 适配层
 *
 * 使用 ref-as-prop + useSyncExternalStore 桥接 @xui-design/shared 逻辑。
 * 通过 createPortal 渲染到 document.body，ESC / 遮罩点击关闭由逻辑层判断。
 * 通过 useImperativeHandle 暴露 open / close / toggle。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import type { DrawerProps } from '@xui-design/core';
import { createDrawerLogic } from '@xui-design/shared';
import { trapFocus as trapFocusIn } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import type { DrawerLogicInstance } from '@xui-design/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Drawer 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type DrawerComponentProps = DrawerProps & {
  /** 抽屉内容 */
  children?: ReactNode;
  /** 自定义标题（覆盖 title prop） */
  renderTitle?: () => ReactNode;
  /** 自定义底部操作区 */
  renderFooter?: () => ReactNode;
  /** 自定义关闭图标（默认渲染内联 SVG） */
  renderCloseIcon?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<DrawerRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface DrawerRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function Drawer(props: DrawerComponentProps) {
  const {
    visible,
    defaultVisible,
    placement = 'right',
    size = 378,
    title,
    closable = true,
    mask = true,
    maskClosable = true,
    closeOnEsc = true,
    trapFocus = true,
    className,
    style,
    onOpen,
    onClose,
    children,
    renderTitle,
    renderFooter,
    renderCloseIcon,
    ref,
  } = props;

  // 回调 latest-ref：App 每次重渲染都会新建箭头函数，若回调进入 updateOptions 的
  // effect 依赖，命令式 open() 后的任意重渲染都会用受控旧值把 visible 打回 false。
  // 因此回调统一经 callbacksRef 间接调用，updateOptions 只同步状态类 props。
  const callbacksRef = useRef({ onOpen, onClose });
  callbacksRef.current = { onOpen, onClose };

  // 逻辑实例只创建一次：visible 提供即受控，否则用 defaultVisible 非受控
  const logicRef = useRef<DrawerLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createDrawerLogic({
      visible,
      defaultVisible,
      closable,
      maskClosable,
      closeOnEsc,
      onOpen: () => callbacksRef.current.onOpen?.(),
      onClose: () => callbacksRef.current.onClose?.(),
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
      toggle: () => logic.toggle(),
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
  const handleClose = () => {
    logic.close();
  };

  // 面板尺寸：left/right 为宽度，top/bottom 为高度
  const panelStyle: CSSProperties = {};
  if (size !== undefined) {
    const sizeValue = typeof size === 'number' ? `${size}px` : size;
    if (placement === 'top' || placement === 'bottom') {
      panelStyle.height = sizeValue;
    } else {
      panelStyle.width = sizeValue;
    }
  }

  if (!state.visible) return null;

  return createPortal(
    <div className={cn('xui-drawer', `xui-drawer--${placement}`)}>
      {mask && <div className="xui-drawer__overlay" onClick={handleMaskClick} />}
      <div
        ref={panelRef}
        className={cn('xui-drawer__panel', className)}
        style={{ ...panelStyle, ...(style as CSSProperties) }}
        role="dialog"
        aria-modal={mask ? 'true' : undefined}
        tabIndex={-1}
        onKeyDown={handlePanelKeydown}
      >
        <div className="xui-drawer__header">
          <span className="xui-drawer__title">{renderTitle ? renderTitle() : (title ?? null)}</span>
          {state.closable && (
            <button
              type="button"
              className="xui-drawer__close"
              onClick={handleClose}
              aria-label="close"
            >
              {renderCloseIcon ? renderCloseIcon() : <CloseIcon />}
            </button>
          )}
        </div>
        <div className="xui-drawer__body">{children}</div>
        {renderFooter && <div className="xui-drawer__footer">{renderFooter()}</div>}
      </div>
    </div>,
    document.body,
  );
}

/** 关闭图标（数据来自 @xui-design/icons） */
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
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icons.close }}
    />
  );
}
