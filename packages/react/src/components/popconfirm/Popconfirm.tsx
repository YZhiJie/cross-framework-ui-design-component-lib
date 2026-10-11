/**
 * Popconfirm - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * CSS 包裹定位（复用 Tooltip 模式）；点击外部收起且不触发回调。
 */

import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import type { PopconfirmProps } from '@xui/core';
import { createPopconfirmLogic } from '@xui/shared';
import type { PopconfirmLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';

/** Popconfirm 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type PopconfirmComponentProps = PopconfirmProps & {
  /** 触发元素 */
  children?: ReactNode;
  /** 确认文案内容（覆盖 content prop，对应 Vue content 插槽） */
  renderContent?: () => ReactNode;
};

export function Popconfirm(props: PopconfirmComponentProps) {
  const {
    content,
    confirmText = '确定',
    cancelText = '取消',
    placement = 'top',
    disabled = false,
    onConfirm,
    onCancel,
    children,
    renderContent,
  } = props;

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

  const rootRef = useRef<HTMLSpanElement | null>(null);
  const popperId = useId();

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
    <span ref={rootRef} className="xui-popconfirm">
      <span
        className="xui-popconfirm__trigger"
        aria-describedby={state.open ? popperId : undefined}
        onClick={() => logic.toggle()}
      >
        {children}
      </span>
      {state.open && (
        <span
          id={popperId}
          className={`xui-popconfirm__popper is-${state.placement}`}
          role="tooltip"
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
              {cancelText}
            </button>
            <button
              className="xui-button xui-button--primary xui-button--sm"
              type="button"
              onClick={() => logic.confirm()}
            >
              {confirmText}
            </button>
          </div>
          <span className="xui-popconfirm__arrow" aria-hidden="true" />
        </span>
      )}
    </span>
  );
}
