/**
 * Popconfirm - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * CSS 包裹定位（复用 Tooltip 模式，popper 锚定 trigger 元素）；点击外部收起且不触发回调。
 * 打开时经 resolveFloatingPosition 做视口避让（翻转方位 + 交叉轴钳制）。
 */
import { useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { PopconfirmProps } from '@xui/core';
import {
  bindViewportUpdate,
  createPopconfirmLogic,
  getViewport,
  resolveFloatingPosition,
} from '@xui/shared';
import type { FloatingPlacement, PopconfirmLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';
import { cn } from '../../utils/cn';

/** Popconfirm 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type PopconfirmComponentProps = PopconfirmProps & {
  /** 触发元素 */
  children?: ReactNode;
  /** 确认文案内容（覆盖 content prop，对应 Vue content 插槽） */
  renderContent?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<PopconfirmRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface PopconfirmRef {
  /** 显示确认气泡（已展开时 no-op） */
  show: () => void;
  /** 隐藏确认气泡（不触发回调） */
  hide: () => void;
  /** 切换确认气泡展开/收起 */
  toggle: () => void;
}

export function Popconfirm(props: PopconfirmComponentProps) {
  const {
    content,
    confirmText,
    cancelText,
    placement = 'top',
    disabled = false,
    className,
    style,
    onConfirm,
    onCancel,
    children,
    renderContent,
    ref,
  } = props;

  // 未提供 confirmText / cancelText 时取全局语言包（setLocale / registerLocale 后响应式更新）
  const locale = useLocaleData();

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onConfirm, onCancel });
  callbacksRef.current = { onConfirm, onCancel };

  const logicRef = useRef<PopconfirmLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createPopconfirmLogic({
      placement,
      disabled,
      onConfirm: () => callbacksRef.current.onConfirm?.(),
      onCancel: () => callbacksRef.current.onCancel?.(),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ placement, disabled });
  }, [logic, placement, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        if (!state.open) logic.toggle();
      },
      hide: () => logic.close(),
      toggle: () => logic.toggle(),
    }),
    [logic, state.open],
  );

  const rootRef = useRef<HTMLSpanElement | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const popperRef = useRef<HTMLSpanElement | null>(null);
  const popperId = useId();
  const [resolved, setResolved] = useState<{ placement: FloatingPlacement; shift: number }>({
    placement,
    shift: 0,
  });

  // 打开期间视口避让：空间不足翻转方位 + 交叉轴钳制
  useLayoutEffect(() => {
    if (!state.open) return;
    setResolved({ placement: state.placement, shift: 0 });
    const update = () => {
      const triggerEl = triggerRef.current;
      const popperEl = popperRef.current;
      if (!triggerEl || !popperEl) return;
      const popperRect = popperEl.getBoundingClientRect();
      // 零尺寸表示未完成布局（jsdom 环境恒为 0），保持首选方位避免误翻转
      if (popperRect.width === 0 && popperRect.height === 0) return;
      setResolved(
        resolveFloatingPosition(triggerEl.getBoundingClientRect(), popperRect, getViewport(), {
          placement: state.placement,
          gap: 8,
        }),
      );
    };
    const raf = requestAnimationFrame(update);
    const unbind = bindViewportUpdate(update);
    return () => {
      cancelAnimationFrame(raf);
      unbind();
    };
  }, [state.open, state.placement]);

  // 点击外部收起（不触发回调）
  useEffect(() => {
    const handleDocMouseDown = (event: MouseEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) logic.close();
    };
    document.addEventListener('mousedown', handleDocMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleDocMouseDown);
    };
  }, [logic]);

  return (
    <span ref={rootRef} className={cn('xui-popconfirm', className)} style={style as CSSProperties}>
      <span
        ref={triggerRef}
        className="xui-popconfirm__trigger"
        aria-describedby={state.open ? popperId : undefined}
        onClick={() => logic.toggle()}
      >
        {children}
        {state.open && (
          <span
            ref={popperRef}
            id={popperId}
            className={`xui-popconfirm__popper is-${resolved.placement}`}
            style={
              (resolved.placement === 'top' || resolved.placement === 'bottom'
                ? { marginLeft: `${resolved.shift}px` }
                : { marginTop: `${resolved.shift}px` }) as CSSProperties
            }
            role="tooltip"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="xui-popconfirm__content">
              {renderContent ? renderContent() : content}
            </span>
            <div className="xui-popconfirm__actions">
              <button
                className="xui-button xui-button--sm"
                type="button"
                onClick={() => logic.cancel()}
              >
                {cancelText ?? locale.popconfirm.cancel}
              </button>
              <button
                className="xui-button xui-button--primary xui-button--sm"
                type="button"
                onClick={() => logic.confirm()}
              >
                {confirmText ?? locale.popconfirm.confirm}
              </button>
            </div>
            <span className="xui-popconfirm__arrow" aria-hidden="true" />
          </span>
        )}
      </span>
    </span>
  );
}
