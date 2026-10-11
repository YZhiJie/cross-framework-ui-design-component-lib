/**
 * 焦点陷阱工具（纯 DOM 辅助，框架无关）
 *
 * 供 Modal 等浮层组件在打开期间将 Tab / Shift+Tab 焦点循环约束在容器内：
 * 适配层在容器 keydown 时调用 trapFocus(e, container)，本函数仅在
 * Tab 按键时介入（preventDefault 并移动焦点），其余按键不干预。
 */

/** 容器内可聚焦元素选择器（disabled 由过滤阶段排除，兼顾 attribute 与 property 禁用） */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** 判断元素当前可接收键盘焦点 */
function isFocusable(el: HTMLElement): boolean {
  if (el.hasAttribute('disabled')) return false;
  const tabIndex = el.getAttribute('tabindex');
  if (tabIndex === '-1') return false;
  // input 的 disabled 以 property 形式存在时也可能无 attribute（框架受控场景）
  if (
    (el instanceof HTMLInputElement ||
      el instanceof HTMLSelectElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLButtonElement) &&
    el.disabled
  ) {
    return false;
  }
  return true;
}

/**
 * 在容器内循环焦点（Tab 正序 / Shift+Tab 逆序）。
 *
 * - 焦点在最后一个可聚焦元素上按 Tab → 回到第一个；
 * - 在第一个元素上按 Shift+Tab → 回到最后一个；
 * - 焦点在容器外（如容器自身）→ 收进容器内；
 * - 容器内无可聚焦元素 → 焦点归还容器（容器需可聚焦，如 tabindex=-1）。
 *
 * 仅当事件为 Tab 且实际接管焦点移动时 preventDefault，返回是否接管。
 */
export function trapFocus(event: KeyboardEvent, container: HTMLElement): boolean {
  if (event.key !== 'Tab') return false;

  const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    isFocusable,
  );

  const active = document.activeElement;
  const inside = active !== null && active !== container && container.contains(active);

  // 无可聚焦元素：焦点锁定在容器自身
  if (focusables.length === 0) {
    event.preventDefault();
    container.focus();
    return true;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey) {
    if (!inside || active === first) {
      event.preventDefault();
      last.focus();
      return true;
    }
    return false;
  }

  if (!inside || active === last) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}
