/**
 * Select - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * ARIA combobox 模式：trigger role="combobox"，面板 role="listbox"，
 * 键盘 Enter/Space/Escape/ArrowDown/ArrowUp，点击组件外部收起面板。
 * 多选（multiple）：tag 列表展示，select 为切换语义；可搜索（searchable）：面板顶部搜索框；
 * 虚拟滚动（virtual）：固定选项行高 spacer 方案，窗口外选项不渲染。
 */

import { useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react';
import type { SelectProps } from '@xui-design/core';
import {
  bindViewportUpdate,
  createSelectLogic,
  createVirtualListLogic,
  getViewport,
  resolveFloatingPosition,
} from '@xui-design/shared';
import type { SelectLogicInstance, VirtualListLogicInstance } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';
import { cn } from '../../utils/cn';

/** Select 组件 Props（契约 Props 基础上扩展 React 专属属性） */
export type SelectComponentProps = SelectProps & {
  /** 自定义清除图标（触发器 clear 与多选 tag 的 clear 共用，默认渲染内联 SVG） */
  renderClearIcon?: () => ReactNode;
  /** 自定义下拉箭头图标（默认渲染内联 SVG） */
  renderSuffixIcon?: () => ReactNode;
  /** React 19 ref-as-prop */
  ref?: Ref<SelectRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface SelectRef {
  /** 聚焦触发器 */
  focus: () => void;
  /** 切换下拉面板展开/收起（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起下拉面板 */
  close: () => void;
}

/** 虚拟选项行高：与 CSS 变量 --xui-select-item-height 默认值对齐（虚拟模式要求行高固定） */
const ITEM_HEIGHT = 30;

export function Select(props: SelectComponentProps) {
  const {
    value,
    defaultValue,
    options,
    placeholder,
    disabled = false,
    clearable = false,
    multiple = false,
    searchable = false,
    virtual = false,
    maxHeight = 264,
    className,
    style,
    onChange,
    onClear,
    renderClearIcon,
    renderSuffixIcon,
    ref,
  } = props;

  // 触发器占位符 / 搜索框 placeholder 与 aria 取全局语言包（setLocale / registerLocale 后响应式更新）
  const locale = useLocaleData();

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const triggerId = useId();
  const listboxId = useId();

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onChange, onClear });
  callbacksRef.current = { onChange, onClear };

  // 逻辑实例只创建一次：value 提供即受控，否则用 defaultValue 非受控
  const logicRef = useRef<SelectLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createSelectLogic({
      value,
      defaultValue,
      options,
      disabled,
      clearable,
      multiple,
      searchable,
      onChange: (v) => callbacksRef.current.onChange?.(v),
      onClear: () => callbacksRef.current.onClear?.(),
    });
  }
  const logic = logicRef.current;

  // 虚拟滚动窗口计算（仅 virtual 模式消费）
  const vlRef = useRef<VirtualListLogicInstance | null>(null);
  if (vlRef.current === null) {
    vlRef.current = createVirtualListLogic({
      itemCount: 0,
      itemHeight: ITEM_HEIGHT,
      viewportHeight: 0,
    });
  }
  const vl = vlRef.current;

  // 同步 prop 变更到逻辑层（受控模式：value 变更 → 逻辑层）
  useEffect(() => {
    logic.updateOptions({ value, options, disabled, clearable, multiple, searchable });
  }, [logic, value, options, disabled, clearable, multiple, searchable]);

  const state = useLogicState(logic.subscribe, logic.getState);
  const vlState = useLogicState(vl.subscribe, vl.getState);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => triggerRef.current?.focus(),
      toggleOpen: () => logic.toggleOpen(),
      close: () => logic.close(),
    }),
    [logic],
  );

  // 视口避让：下方空间不足且上方更充足时下拉面板向上展开
  const [dropUp, setDropUp] = useState(false);
  useLayoutEffect(() => {
    if (!state.open) {
      setDropUp(false);
      return;
    }
    setDropUp(false);
    const update = () => {
      const root = rootRef.current;
      const dropdown = dropdownRef.current;
      if (!root || !dropdown) return;
      const dropdownRect = dropdown.getBoundingClientRect();
      // 零尺寸表示未完成布局（jsdom 环境恒为 0），保持向下展开避免误翻转
      if (dropdownRect.width === 0 && dropdownRect.height === 0) return;
      const { placement } = resolveFloatingPosition(
        root.getBoundingClientRect(),
        dropdownRect,
        getViewport(),
        { placement: 'bottom', gap: 4, viewportPadding: 4 },
      );
      setDropUp(placement === 'top');
    };
    const raf = requestAnimationFrame(update);
    const unbind = bindViewportUpdate(update);
    return () => {
      cancelAnimationFrame(raf);
      unbind();
    };
  }, [state.open]);

  // 虚拟模式：过滤选项数 / 视口高度同步到窗口计算
  useEffect(() => {
    if (!virtual) return;
    vl.updateOptions({
      itemCount: state.filteredOptions.length,
      viewportHeight: maxHeight,
    });
  });

  // 点击组件外部时收起面板（close 内部有未展开守卫，未打开时为 no-op）
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        logic.close();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [logic]);

  const selectedOption = options?.find((option) => option.value === state.value);

  /** 多选模式已选 tag 列表（含 options 中不存在的值，回退显示原始值） */
  const selectedTags: { value: string; label: string }[] = multiple
    ? (Array.isArray(state.value) ? state.value : []).map((item) => {
        const option = options?.find((candidate) => candidate.value === item);
        return { value: item, label: option?.label ?? item };
      })
    : [];

  /** 是否已选中（多选看数组长度，单选看非 null） */
  const hasValue = multiple ? selectedTags.length > 0 : state.value !== null;

  const filteredOptions = state.filteredOptions;
  const visibleOptions = virtual
    ? filteredOptions.slice(vlState.startIndex, vlState.endIndex + 1)
    : filteredOptions;

  const dropdownStyle: CSSProperties = {
    maxHeight: `${maxHeight}px`,
    ...(virtual ? { height: `${maxHeight}px` } : {}),
  };

  // 面板展开时聚焦搜索框（searchable 模式）
  useEffect(() => {
    if (!state.open || !searchable) return;
    dropdownRef.current?.querySelector<HTMLInputElement>('.xui-select__search')?.focus();
  }, [state.open, searchable]);

  // 搜索词变化重置虚拟滚动位置，避免过滤后 scrollTop 越界空白
  useEffect(() => {
    if (!virtual) return;
    vl.scrollTo(0);
    if (dropdownRef.current) dropdownRef.current.scrollTop = 0;
  }, [state.searchQuery, virtual, vl]);

  // 键盘高亮项滚动跟随（保持 ARIA combobox 的高亮项可见）
  useEffect(() => {
    if (!state.open || state.activeIndex === -1) return;
    document.getElementById(`${listboxId}-option-${state.activeIndex}`)?.scrollIntoView?.({
      block: 'nearest',
    });
  }, [state.open, state.activeIndex, listboxId]);

  const handleTriggerKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (state.open) logic.confirmHighlight();
        else logic.toggleOpen();
        break;
      case 'Escape':
        if (state.open) {
          event.preventDefault();
          logic.close();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (state.open) logic.moveHighlight(1);
        else logic.toggleOpen();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (state.open) logic.moveHighlight(-1);
        else logic.toggleOpen();
        break;
    }
  };

  /** 搜索框键盘导航（焦点在输入框内；Space 为正常输入字符不拦截） */
  const handleSearchKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        logic.confirmHighlight();
        break;
      case 'ArrowDown':
        event.preventDefault();
        logic.moveHighlight(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        logic.moveHighlight(-1);
        break;
      case 'Escape':
        event.preventDefault();
        logic.close();
        break;
    }
  };

  /** 判断指定值是否选中（多选 includes，单选全等） */
  const isSelected = (optionValue: string) =>
    multiple
      ? Array.isArray(state.value) && state.value.includes(optionValue)
      : state.value === optionValue;

  return (
    <div
      ref={rootRef}
      className={cn('xui-select', className, multiple && 'is-multiple', virtual && 'is-virtual', {
        'is-disabled': state.disabled,
        'is-open': state.open,
        'is-drop-up': dropUp,
      })}
      style={style as CSSProperties}
    >
      <div
        ref={triggerRef}
        id={triggerId}
        className="xui-select__trigger"
        role="combobox"
        aria-expanded={state.open}
        aria-haspopup="listbox"
        aria-controls={state.open ? listboxId : undefined}
        aria-activedescendant={
          state.open && state.activeIndex !== -1
            ? `${listboxId}-option-${state.activeIndex}`
            : undefined
        }
        aria-disabled={state.disabled || undefined}
        tabIndex={state.disabled ? -1 : 0}
        onClick={() => logic.toggleOpen()}
        onKeyDown={handleTriggerKeydown}
      >
        {multiple ? (
          <span className="xui-select__tags">
            {selectedTags.map((tag) => (
              <span key={tag.value} className="xui-select__tag">
                <span className="xui-select__tag-label">{tag.label}</span>
                <span
                  className="xui-select__tag-close"
                  role="button"
                  aria-label="remove"
                  onClick={(event) => {
                    event.stopPropagation();
                    logic.select(tag.value);
                  }}
                >
                  {renderClearIcon ? (
                    renderClearIcon()
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="10"
                      height="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: icons.clear }}
                    />
                  )}
                </span>
              </span>
            ))}
            {selectedTags.length === 0 && (
              <span className="xui-select__placeholder">
                {placeholder ?? locale.select.triggerPlaceholder}
              </span>
            )}
          </span>
        ) : selectedOption ? (
          <span className="xui-select__value">{selectedOption.label}</span>
        ) : (
          <span className="xui-select__placeholder">
            {placeholder ?? locale.select.triggerPlaceholder}
          </span>
        )}
        {clearable && hasValue && !state.disabled ? (
          <span
            className="xui-select__clear"
            role="button"
            aria-label="clear"
            onClick={(event) => {
              event.stopPropagation();
              logic.clear();
            }}
          >
            {renderClearIcon ? (
              renderClearIcon()
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: icons.clear }}
              />
            )}
          </span>
        ) : (
          <span className="xui-select__arrow" aria-hidden="true">
            {renderSuffixIcon ? (
              renderSuffixIcon()
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: icons['arrow-down'] }}
              />
            )}
          </span>
        )}
      </div>
      {state.open && (
        <ul
          ref={dropdownRef}
          id={listboxId}
          className="xui-select__dropdown"
          role="listbox"
          aria-labelledby={triggerId}
          aria-multiselectable={multiple || undefined}
          style={dropdownStyle}
          onScroll={(event) => vl.scrollTo(event.currentTarget.scrollTop)}
        >
          {searchable && (
            <li role="presentation" className="xui-select__search-item">
              <input
                className="xui-select__search"
                type="text"
                role="searchbox"
                placeholder={locale.select.searchPlaceholder}
                value={state.searchQuery}
                aria-label={locale.select.searchAriaLabel}
                onChange={(event) => logic.setSearch(event.currentTarget.value)}
                onKeyDown={handleSearchKeydown}
                onClick={(event) => event.stopPropagation()}
              />
            </li>
          )}
          {visibleOptions.length > 0 ? (
            <>
              {virtual && vlState.offsetY > 0 && (
                <li
                  className="xui-select__spacer"
                  style={{ height: `${vlState.offsetY}px` }}
                  aria-hidden="true"
                />
              )}
              {visibleOptions.map((option, index) => {
                const realIndex = virtual ? vlState.startIndex + index : index;
                return (
                  <li
                    id={`${listboxId}-option-${realIndex}`}
                    key={option.value}
                    className={cn('xui-select__option', {
                      'is-selected': isSelected(option.value),
                      'is-active': realIndex === state.activeIndex,
                      'is-disabled': option.disabled,
                    })}
                    role="option"
                    aria-selected={isSelected(option.value)}
                    aria-disabled={option.disabled || undefined}
                    onClick={() => logic.select(option.value)}
                  >
                    {option.label}
                  </li>
                );
              })}
              {virtual && vlState.fillerHeight > 0 && (
                <li
                  className="xui-select__spacer"
                  style={{ height: `${vlState.fillerHeight}px` }}
                  aria-hidden="true"
                />
              )}
            </>
          ) : (
            <li className="xui-select__empty" role="presentation">
              无匹配结果
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
