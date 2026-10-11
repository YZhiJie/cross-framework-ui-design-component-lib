/**
 * Tag - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 关闭后由逻辑层隐藏（visible 状态驱动），与 Vue 端行为对齐。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { TagProps } from '@xui/core';
import { createTagLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { TagLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Tag 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type TagComponentProps = TagProps & {
  /** 标签内容 */
  children?: ReactNode;
};

export function Tag(props: TagComponentProps) {
  const {
    type = 'default',
    size = 'md',
    closable = false,
    className,
    style,
    onClose,
    children,
  } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onClose });
  callbacksRef.current = { onClose };

  const logicRef = useRef<TagLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createTagLogic({
      closable,
      onClose: () => callbacksRef.current.onClose?.(),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层
  useEffect(() => {
    logic.updateOptions({ closable });
  }, [logic, closable]);

  const state = useLogicState(logic.subscribe, logic.getState);

  if (!state.visible) return null;

  return (
    <span
      className={cn('xui-tag', `xui-tag--${type}`, `xui-tag--${size}`, className)}
      style={style as CSSProperties}
    >
      {children}
      {state.closable && (
        <button
          type="button"
          className="xui-tag__close"
          aria-label="close"
          onClick={() => logic.handleClose()}
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            dangerouslySetInnerHTML={{ __html: icons.close }}
          />
        </button>
      )}
    </span>
  );
}
