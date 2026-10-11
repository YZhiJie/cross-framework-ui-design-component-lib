// focus-trap 为 DOM 辅助：本文件单独使用 jsdom 环境（shared 默认 node 环境）
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { FOCUSABLE_SELECTOR, trapFocus } from '../focus-trap';

/** 构造容器 + 可聚焦元素结构，返回容器 */
function setup(html: string): { container: HTMLElement; buttons: HTMLElement[] } {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  const buttons = Array.from(container.querySelectorAll<HTMLElement>('button'));
  return { container, buttons };
}

/** 以指定元素为当前焦点调用 trapFocus（模拟 activeElement） */
function trapFrom(container: HTMLElement, active: Element | null, shiftKey = false): boolean {
  if (active) {
    (active as HTMLElement).focus();
  } else {
    (document.activeElement as HTMLElement | null)?.blur();
  }
  const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true });
  Object.defineProperty(event, 'target', { value: active ?? container });
  return trapFocus(event, container);
}

describe('trapFocus（焦点陷阱）', () => {
  it('焦点在最后一个可聚焦元素上按 Tab → 回到第一个并接管事件', () => {
    const { container, buttons } = setup('<button>A</button><button>B</button><button>C</button>');

    const handled = trapFrom(container, buttons[2]);
    expect(handled).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
    container.remove();
  });

  it('焦点在第一个元素上按 Shift+Tab → 回到最后一个', () => {
    const { container, buttons } = setup('<button>A</button><button>B</button>');

    const handled = trapFrom(container, buttons[0], true);
    expect(handled).toBe(true);
    expect(document.activeElement).toBe(buttons[1]);
    container.remove();
  });

  it('焦点在容器外时 Tab 收进容器内第一个 / Shift+Tab 进最后一个', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    const { container, buttons } = setup('<button>A</button><button>B</button>');

    expect(trapFrom(container, outside)).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);

    expect(trapFrom(container, outside, true)).toBe(true);
    expect(document.activeElement).toBe(buttons[1]);

    outside.remove();
    container.remove();
  });

  it('焦点在中间元素上不接管（返回 false，交由浏览器默认移动）', () => {
    const { container, buttons } = setup('<button>A</button><button>B</button><button>C</button>');

    expect(trapFrom(container, buttons[1])).toBe(false);
    expect(trapFrom(container, buttons[1], true)).toBe(false);
    container.remove();
  });

  it('非 Tab 按键不介入', () => {
    const { container } = setup('<button>A</button>');
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });

    expect(trapFocus(event, container)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
    container.remove();
  });

  it('无可聚焦元素时焦点锁定容器自身（容器需 tabindex=-1）', () => {
    const { container } = setup('<span>纯文本</span>');
    container.tabIndex = -1;

    expect(trapFrom(container, null)).toBe(true);
    expect(document.activeElement).toBe(container);
    container.remove();
  });

  it('disabled 元素被排除出循环', () => {
    const { container, buttons } = setup(
      '<button>A</button><button disabled>B</button><button>C</button>',
    );

    expect(trapFrom(container, buttons[2])).toBe(true);
    // 循环目标为 A（disabled 的 B 被排除）
    expect(document.activeElement).toBe(buttons[0]);

    expect(trapFrom(container, buttons[0], true)).toBe(true);
    // Shift+Tab 回到最后一个"可聚焦"元素 C
    expect(document.activeElement).toBe(buttons[2]);
    container.remove();
  });

  it('FOCUSABLE_SELECTOR 覆盖链接 / 输入与 tabindex 元素', () => {
    const { container } = setup('<a href="#a">链接</a><input /><div tabindex="0">div</div>');
    expect(container.querySelectorAll(FOCUSABLE_SELECTOR)).toHaveLength(3);
    container.remove();
  });
});
