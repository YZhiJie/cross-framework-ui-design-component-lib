/**
 * Avatar - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * 内容优先级：成功的图片 > children 自定义内容 > 默认图标；
 * 图片加载失败时进入失败态（逻辑层管理），换新 src 自动重置重试。
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { AvatarProps } from '@xui/core';
import { createAvatarLogic } from '@xui/shared';
import type { AvatarLogicInstance } from '@xui/shared';
import { icons } from '@xui/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Avatar 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type AvatarComponentProps = AvatarProps & {
  /** 自定义内容（文案 / 图标；优先级低于成功的图片，高于默认图标） */
  children?: ReactNode;
};

export function Avatar(props: AvatarComponentProps) {
  const { size = 'md', shape = 'circle', src, alt, className, style, onError, children } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onError });
  callbacksRef.current = { onError };

  const logicRef = useRef<AvatarLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createAvatarLogic({
      src,
      onError: () => callbacksRef.current.onError?.(),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ src });
  }, [logic, src]);

  const state = useLogicState(logic.subscribe, logic.getState);

  return (
    <span
      className={cn('xui-avatar', `xui-avatar--${size}`, `xui-avatar--${shape}`, className)}
      style={style as CSSProperties}
    >
      {src && !state.failed ? (
        <img
          className="xui-avatar__img"
          src={src}
          alt={alt ?? ''}
          onError={() => logic.handleError()}
        />
      ) : children !== undefined && children !== null ? (
        <span className="xui-avatar__inner">{children}</span>
      ) : (
        <AvatarIcon />
      )}
    </span>
  );
}

/** 默认头像图标（数据来自 @xui/icons） */
function AvatarIcon() {
  return (
    <svg
      className="xui-avatar__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icons.user }}
    />
  );
}
