/**
 * Tabs - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * ARIA tabs 模式：role="tablist"/"tab"/"tabpanel"，键盘左右箭头切换（焦点跟随）。
 * renderPanel 回调对应 Vue 作用域插槽 default（参数为当前激活项）。
 */

import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import type { TabItem, TabsProps } from '@xui-design/core';
import { createTabsLogic } from '@xui-design/shared';
import type { TabsLogicInstance } from '@xui-design/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Tabs 组件 Props（契约 Props + 插槽映射的渲染回调） */
export type TabsComponentProps = TabsProps & {
  /** 面板内容渲染回调（对应 Vue 作用域插槽 default，参数为当前激活项） */
  renderPanel?: (item: TabItem) => ReactNode;
};

export function Tabs(props: TabsComponentProps) {
  const { value, defaultValue, items, className, style, onChange, renderPanel } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const tabsId = useId();

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onChange });
  callbacksRef.current = { onChange };

  // 逻辑实例只创建一次：value 提供即受控，否则用 defaultValue 非受控
  const logicRef = useRef<TabsLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createTabsLogic({
      value,
      defaultValue,
      items,
      onChange: (v) => callbacksRef.current.onChange?.(v),
    });
  }
  const logic = logicRef.current;

  // 同步 prop 变更到逻辑层（受控模式：value 变更 → 逻辑层）
  useEffect(() => {
    logic.updateOptions({ value, items });
  }, [logic, value, items]);

  const state = useLogicState(logic.subscribe, logic.getState);

  // 键盘切换后焦点跟随到新激活 tab（roving tabindex；点击切换时 tab 已持有焦点，无副作用）
  // 属性选择器转义不依赖 CSS.escape 全局（jsdom 可能缺失），仅处理引号
  const prevValueRef = useRef<string | null>(state.value);
  useEffect(() => {
    if (state.value !== null && state.value !== prevValueRef.current) {
      rootRef.current
        ?.querySelector<HTMLButtonElement>(`[data-value="${state.value.replace(/"/g, '\\"')}"]`)
        ?.focus();
    }
    prevValueRef.current = state.value;
  }, [state.value]);

  const activeItem = items?.find((item) => item.value === state.value);

  const handleKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    logic.moveActive(event.key === 'ArrowRight' ? 1 : -1);
  };

  return (
    <div ref={rootRef} className={cn('xui-tabs', className)} style={style as CSSProperties}>
      <div className="xui-tabs__list" role="tablist" onKeyDown={handleKeydown}>
        {(items ?? []).map((item) => (
          <button
            id={`${tabsId}-tab-${item.value}`}
            key={item.value}
            type="button"
            className={cn('xui-tabs__tab', {
              'is-active': item.value === state.value,
              'is-disabled': item.disabled,
            })}
            role="tab"
            aria-selected={item.value === state.value}
            aria-disabled={item.disabled || undefined}
            aria-controls={`${tabsId}-panel-${item.value}`}
            tabIndex={item.value === state.value ? 0 : -1}
            data-value={item.value}
            onClick={() => logic.activate(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <div
          id={`${tabsId}-panel-${activeItem.value}`}
          className="xui-tabs__panel"
          role="tabpanel"
          aria-labelledby={`${tabsId}-tab-${activeItem.value}`}
        >
          {renderPanel ? renderPanel(activeItem) : activeItem.label}
        </div>
      )}
    </div>
  );
}
