/**
 * Dropdown - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * CSS 包裹定位（复用 Popconfirm 模式，menu 锚定 trigger 元素）；hover / click 双触发方式，
 * 菜单项点击后收起并回调；点击外部 / Esc 仅收起不回调。
 * 打开时经 resolveFloatingPosition 做视口避让（翻转方位 + 交叉轴钳制）。
 */
import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { DropdownOption, DropdownProps } from '@xui-design/core';
import {
  bindViewportUpdate,
  createDropdownLogic,
  getViewport,
  resolveFloatingPosition,
} from '@xui-design/shared';
import type { DropdownLogicInstance, FloatingPlacement } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Dropdown 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type DropdownComponentProps = DropdownProps & {
  /** 触发元素 */
  children?: ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<DropdownRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface DropdownRef {
  /** 展开菜单（已展开时 no-op） */
  show: () => void;
  /** 收起菜单（不触发 onSelect） */
  hide: () => void;
  /** 切换菜单展开 / 收起 */
  toggle: () => void;
}

/** 图标名 → 内层 SVG 标记（未知名忽略不渲染） */
function iconMarkup(name: string | undefined): string | undefined {
  if (!name) return undefined;
  return (icons as Record<string, string>)[name];
}

export function Dropdown(props: DropdownComponentProps) {
  const {
    menu,
    trigger = 'hover',
    placement = 'bottom',
    disabled = false,
    className,
    style,
    onSelect,
    onVisibleChange,
    children,
    ref,
  } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onSelect, onVisibleChange });
  callbacksRef.current = { onSelect, onVisibleChange };

  const logicRef = useRef<DropdownLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createDropdownLogic({
      menu,
      trigger,
      placement,
      disabled,
      onSelect: (key, option) => callbacksRef.current.onSelect?.(key, option),
      onVisibleChange: (open) => callbacksRef.current.onVisibleChange?.(open),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ menu, trigger, placement, disabled });
  }, [logic, menu, trigger, placement, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      show: () => logic.openMenu(),
      hide: () => logic.closeMenu(),
      toggle: () => (state.open ? logic.closeMenu() : logic.openMenu()),
    }),
    [logic, state.open],
  );

  const rootRef = useRef<HTMLSpanElement | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const popperRef = useRef<HTMLUListElement | null>(null);
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

  // 点击外部收起（不触发回调）；Esc 收起（不触发回调）
  useEffect(() => {
    const handleDocMouseDown = (event: MouseEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) logic.close();
    };
    const handleDocKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') logic.closeMenu();
    };
    document.addEventListener('mousedown', handleDocMouseDown);
    document.addEventListener('keydown', handleDocKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDocMouseDown);
      document.removeEventListener('keydown', handleDocKeyDown);
    };
  }, [logic]);

  return (
    <span ref={rootRef} className={cn('xui-dropdown', className)} style={style as CSSProperties}>
      <span
        ref={triggerRef}
        className={cn('xui-dropdown__trigger', { 'is-disabled': state.disabled })}
        aria-haspopup={state.open ? 'menu' : undefined}
        onClick={() => logic.toggle()}
        onMouseEnter={() => logic.handleTriggerEnter()}
        onMouseLeave={() => logic.handleTriggerLeave()}
      >
        {children}
        {state.open && (
          <ul
            ref={popperRef}
            className={`xui-dropdown__menu is-${resolved.placement}`}
            style={
              (resolved.placement === 'top' || resolved.placement === 'bottom'
                ? { marginLeft: `${resolved.shift}px` }
                : { marginTop: `${resolved.shift}px` }) as CSSProperties
            }
            role="menu"
            onMouseEnter={() => logic.handlePopperEnter()}
            onMouseLeave={() => logic.handlePopperLeave()}
            onClick={(event) => event.stopPropagation()}
          >
            {menu.map((item: DropdownOption) => {
              const markup = iconMarkup(item.icon);
              return (
                <li
                  key={item.key}
                  className={cn('xui-dropdown__item', {
                    'is-disabled': item.disabled,
                    'is-danger': item.danger,
                    'is-divided': item.divided,
                  })}
                  role="menuitem"
                  aria-disabled={item.disabled || undefined}
                  onClick={() => logic.select(item.key)}
                >
                  {markup && (
                    <svg
                      className="xui-dropdown__item-icon"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: markup }}
                    />
                  )}
                  <span className="xui-dropdown__item-label">{item.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </span>
    </span>
  );
}
