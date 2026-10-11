/**
 * Alert - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 关闭后由逻辑层隐藏（visible 状态驱动），与 Vue 端行为对齐。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { AlertProps } from '@xui/core';
import { createAlertLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { AlertLogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Alert 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type AlertComponentProps = AlertProps & {
  /** 描述内容（default 插槽，覆盖 description prop） */
  children?: ReactNode;
  /** 自定义标题（覆盖 title prop） */
  renderTitle?: () => ReactNode;
  /** 自定义类型图标（覆盖默认图标，showIcon 开启时生效） */
  renderIcon?: () => ReactNode;
};

export function Alert(props: AlertComponentProps) {
  const {
    type = 'info',
    title,
    description,
    closable = false,
    showIcon = false,
    className,
    style,
    onClose,
    children,
    renderTitle,
    renderIcon,
  } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onClose });
  callbacksRef.current = { onClose };

  const logicRef = useRef<AlertLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createAlertLogic({
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

  const showTitle = renderTitle !== undefined || title !== undefined;
  const showDescription =
    (children !== undefined && children !== null) || description !== undefined;

  return (
    <div
      className={cn('xui-alert', `xui-alert--${type}`, className)}
      style={style as CSSProperties}
      role="alert"
    >
      {showIcon && (
        <div className="xui-alert__icon" aria-hidden="true">
          {renderIcon ? renderIcon() : <AlertIcon type={type} />}
        </div>
      )}
      <div className="xui-alert__content">
        {showTitle && <div className="xui-alert__title">{renderTitle ? renderTitle() : title}</div>}
        {showDescription && <div className="xui-alert__description">{children ?? description}</div>}
      </div>
      {state.closable && (
        <button
          type="button"
          className="xui-alert__close"
          aria-label="close"
          onClick={() => logic.handleClose()}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            dangerouslySetInnerHTML={{ __html: icons.close }}
          />
        </button>
      )}
    </div>
  );
}

/** 类型图标（数据来自 @xui/icons，图标名与 type 同名） */
function AlertIcon({ type }: { type: NonNullable<AlertProps['type']> }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: icons[type] }}
    />
  );
}
