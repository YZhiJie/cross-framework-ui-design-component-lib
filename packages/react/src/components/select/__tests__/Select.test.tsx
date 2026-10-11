import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Select } from '../Select';

const OPTIONS = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai', disabled: true },
  { label: '广州', value: 'guangzhou' },
];

describe('Select (react)', () => {
  it('未选中时渲染 placeholder', () => {
    const { container } = render(<Select options={OPTIONS} placeholder="请选择城市" />);
    expect(container.querySelector('.xui-select__placeholder')?.textContent).toBe('请选择城市');
  });

  it('defaultValue 渲染选中项 label', () => {
    const { container } = render(<Select options={OPTIONS} defaultValue="beijing" />);
    expect(container.querySelector('.xui-select__value')?.textContent).toBe('北京');
  });

  it('点击 trigger 展开面板（ARIA）', () => {
    const { container } = render(<Select options={OPTIONS} />);
    const trigger = container.querySelector('.xui-select__trigger') as HTMLElement;
    fireEvent.click(trigger);
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
    const options = container.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(3);
    expect(options[1].className).toContain('is-disabled');
    // 展开时高亮第一个可用项
    expect(options[0].className).toContain('is-active');
  });

  it('点击选项：更新选中值、收起面板、触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={OPTIONS} onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    fireEvent.click(container.querySelectorAll('[role="option"]')[2]);
    expect(container.querySelector('.xui-select__value')?.textContent).toBe('广州');
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(onChange).toHaveBeenCalledWith('guangzhou');
  });

  it('禁用项点击忽略（面板保持展开）', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={OPTIONS} onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    fireEvent.click(container.querySelectorAll('[role="option"]')[1]);
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
  });

  it('clearable 清空并触发 onClear', () => {
    const onClear = vi.fn();
    const { container } = render(
      <Select options={OPTIONS} defaultValue="beijing" clearable onClear={onClear} />,
    );
    fireEvent.click(container.querySelector('.xui-select__clear') as HTMLElement);
    expect(container.querySelector('.xui-select__placeholder')).not.toBeNull();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('disabled 点击不展开且标记 aria-disabled', () => {
    const { container } = render(<Select options={OPTIONS} disabled />);
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(container.querySelector('.xui-select__trigger')?.getAttribute('aria-disabled')).toBe(
      'true',
    );
  });

  it('键盘：Enter 展开、ArrowDown 跳过禁用项、Enter 确认', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={OPTIONS} onChange={onChange} />);
    const trigger = container.querySelector('.xui-select__trigger') as HTMLElement;
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    // 高亮从北京跳过禁用的上海到广州
    expect(onChange).toHaveBeenCalledWith('guangzhou');
  });

  it('键盘 Escape 收起面板', () => {
    const { container } = render(<Select options={OPTIONS} />);
    const trigger = container.querySelector('.xui-select__trigger') as HTMLElement;
    fireEvent.click(trigger);
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it('受控模式：点击仅回调，外部 value 更新后显示跟随', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <Select options={OPTIONS} value="beijing" onChange={onChange} />,
    );
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    fireEvent.click(container.querySelectorAll('[role="option"]')[2]);
    expect(onChange).toHaveBeenCalledWith('guangzhou');
    // 受控：内部值未变，显示仍是北京
    expect(container.querySelector('.xui-select__value')?.textContent).toBe('北京');
    rerender(<Select options={OPTIONS} value="guangzhou" onChange={onChange} />);
    expect(container.querySelector('.xui-select__value')?.textContent).toBe('广州');
  });

  it('点击外部收起面板', () => {
    const { container } = render(<Select options={OPTIONS} />);
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
    fireEvent.mouseDown(document.body);
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it('className / style 透传到根节点（含 CSS 变量）', () => {
    const { container } = render(
      <Select
        options={OPTIONS}
        className="my-select"
        style={{ '--xui-select-max-height': '200px', margin: '4px' }}
      />,
    );
    const root = container.querySelector('.xui-select') as HTMLElement;
    expect(root.classList.contains('my-select')).toBe(true);
    expect(root.style.getPropertyValue('--xui-select-max-height')).toBe('200px');
    expect(root.style.margin).toBe('4px');
  });

  it('多选：tag 列表渲染，点击选项追加 tag 且面板不关闭', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={OPTIONS} multiple onChange={onChange} />);
    const root = container.querySelector('.xui-select') as HTMLElement;
    expect(root.classList.contains('is-multiple')).toBe(true);

    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    fireEvent.click(container.querySelectorAll('[role="option"]')[0]);
    fireEvent.click(container.querySelectorAll('[role="option"]')[2]);

    const tags = container.querySelectorAll('.xui-select__tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].textContent).toContain('北京');
    expect(tags[1].textContent).toContain('广州');
    // 面板保持展开，onChange 载荷为数组
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
    expect(onChange).toHaveBeenNthCalledWith(1, ['beijing']);
    expect(onChange).toHaveBeenNthCalledWith(2, ['beijing', 'guangzhou']);
  });

  it('多选：tag 删除按钮切换取消选中', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Select
        options={OPTIONS}
        multiple
        defaultValue={['beijing', 'guangzhou']}
        onChange={onChange}
      />,
    );
    expect(container.querySelectorAll('.xui-select__tag')).toHaveLength(2);

    fireEvent.click(container.querySelectorAll('.xui-select__tag-close')[0]);
    expect(onChange).toHaveBeenCalledWith(['guangzhou']);
    expect(container.querySelectorAll('.xui-select__tag')).toHaveLength(1);
  });

  it('多选 clearable：清空全部 tag', () => {
    const onClear = vi.fn();
    const { container } = render(
      <Select options={OPTIONS} multiple defaultValue={['beijing']} clearable onClear={onClear} />,
    );
    fireEvent.click(container.querySelector('.xui-select__clear') as HTMLElement);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll('.xui-select__tag')).toHaveLength(0);
  });

  it('renderClearIcon 自定义清除图标（触发器与 tag 的 clear 共用）', () => {
    const { container } = render(
      <Select
        options={OPTIONS}
        multiple
        defaultValue={['beijing']}
        clearable
        renderClearIcon={() => <i className="custom-clear" />}
      />,
    );
    // 触发器 clear
    expect(container.querySelector('.xui-select__clear .custom-clear')).not.toBeNull();
    // 多选 tag 的 clear
    expect(container.querySelector('.xui-select__tag-close .custom-clear')).not.toBeNull();
    expect(container.querySelector('.xui-select__clear svg')).toBeNull();
    expect(container.querySelector('.xui-select__tag-close svg')).toBeNull();
  });

  it('renderSuffixIcon 自定义下拉箭头，不渲染内置 svg', () => {
    const { container } = render(
      <Select options={OPTIONS} renderSuffixIcon={() => <i className="custom-arrow" />} />,
    );
    expect(container.querySelector('.xui-select__arrow .custom-arrow')).not.toBeNull();
    expect(container.querySelector('.xui-select__arrow svg')).toBeNull();
  });

  it('可搜索：输入过滤选项，无匹配显示空态', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={OPTIONS} searchable onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);

    const input = container.querySelector('.xui-select__search') as HTMLInputElement;
    expect(input).not.toBeNull();
    fireEvent.change(input, { target: { value: '广' } });
    const options = container.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe('广州');

    fireEvent.change(input, { target: { value: '不存在' } });
    expect(container.querySelector('.xui-select__empty')?.textContent).toBe('无匹配结果');
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(0);

    // 点击过滤结果选中后清空搜索并收起
    fireEvent.change(input, { target: { value: '广' } });
    fireEvent.click(container.querySelectorAll('[role="option"]')[0]);
    expect(onChange).toHaveBeenCalledWith('guangzhou');
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it('虚拟模式：默认窗口渲染 + spacer 占位，滚动更新窗口', () => {
    const bigOptions = Array.from({ length: 100 }, (_, i) => ({
      label: `选项${i + 1}`,
      value: `v${i + 1}`,
    }));
    const { container } = render(<Select options={bigOptions} virtual maxHeight={120} />);
    const root = container.querySelector('.xui-select') as HTMLElement;
    fireEvent.click(root.querySelector('.xui-select__trigger') as HTMLElement);

    expect(root.classList.contains('is-virtual')).toBe(true);
    // jsdom 视口高 0：窗口 = rawStart 0 + overscan 5 → 6 行（远小于 100）
    const bodyOptions = container.querySelectorAll('[role="option"]');
    expect(bodyOptions.length).toBeLessThan(20);
    expect(container.querySelectorAll('.xui-select__spacer').length).toBeGreaterThan(0);

    // 滚动到底部更新窗口
    const dropdown = container.querySelector('[role="listbox"]') as HTMLElement;
    Object.defineProperty(dropdown, 'scrollTop', {
      value: 3000,
      configurable: true,
      writable: true,
    });
    fireEvent.scroll(dropdown);
    const texts = Array.from(container.querySelectorAll('[role="option"]')).map(
      (option) => option.textContent,
    );
    expect(texts).toContain('选项100');
  });

  it('视口避让：下方空间不足时根元素加 is-drop-up 向上展开', async () => {
    const original = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
      const rect = original.call(this);
      if (this.classList?.contains('xui-select')) {
        // 触发器贴近视口底部（jsdom 默认视口高 768）：下方仅剩 8px
        return {
          ...rect,
          top: 720,
          bottom: 760,
          left: 100,
          right: 300,
          width: 200,
          height: 40,
        } as DOMRect;
      }
      if (this.classList?.contains('xui-select__dropdown')) {
        return {
          ...rect,
          top: 0,
          bottom: 240,
          left: 0,
          right: 200,
          width: 200,
          height: 240,
        } as DOMRect;
      }
      return rect;
    };
    try {
      const { container } = render(<Select options={OPTIONS} />);
      fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
      await waitFor(() => {
        expect(container.querySelector('.xui-select')?.classList.contains('is-drop-up')).toBe(true);
      });
    } finally {
      HTMLElement.prototype.getBoundingClientRect = original;
    }
  });
});
