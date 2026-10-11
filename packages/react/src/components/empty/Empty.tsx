/**
 * Empty - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑。
 * description 归一化（空白 → null，不渲染描述区）在逻辑层完成；
 * 纯展示组件，无交互回调。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { EmptyProps } from '@xui/core';
import { createEmptyLogic } from '@xui/shared';
import type { EmptyLogicInstance } from '@xui/shared';
import { icons } from '@xui/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Empty 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type EmptyComponentProps = EmptyProps & {
  /** 底部动作区（如"去创建"按钮） */
  children?: ReactNode;
  /** 自定义插画（覆盖默认插画，React 惯用法插槽回调） */
  renderImage?: () => ReactNode;
};

export function Empty(props: EmptyComponentProps) {
  const { description, className, style, children, renderImage } = props;

  const logicRef = useRef<EmptyLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createEmptyLogic({ description });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ description });
  }, [logic, description]);

  const state = useLogicState(logic.subscribe, logic.getState);

  return (
    <div className={cn('xui-empty', className)} style={style as CSSProperties}>
      <div className="xui-empty__image" aria-hidden="true">
        {renderImage ? renderImage() : <EmptyIllustration />}
      </div>
      {state.description && <div className="xui-empty__description">{state.description}</div>}
      {children !== undefined && children !== null && (
        <div className="xui-empty__footer">{children}</div>
      )}
    </div>
  );
}

/** 默认插画（数据来自 @xui/icons，细线化以适配放大展示） */
function EmptyIllustration() {
  return (
    <svg
      className="xui-empty__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: icons.inbox }}
    />
  );
}
