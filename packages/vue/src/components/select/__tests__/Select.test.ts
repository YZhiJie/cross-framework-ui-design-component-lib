import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Select from '../Select.vue';

const OPTIONS = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai', disabled: true },
  { label: '广州', value: 'guangzhou' },
];

describe('Select (vue)', () => {
  it('未选中时渲染 placeholder', () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, placeholder: '请选择城市' } });
    expect(wrapper.find('.xui-select__placeholder').text()).toBe('请选择城市');
  });

  it('defaultValue 渲染选中项 label', () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, defaultValue: 'beijing' } });
    expect(wrapper.find('.xui-select__value').text()).toBe('北京');
  });

  it('点击 trigger 展开面板并渲染选项（ARIA）', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    const trigger = wrapper.find('.xui-select__trigger');
    expect(trigger.attributes('role')).toBe('combobox');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(3);
    expect(options[1].classes()).toContain('is-disabled');
    // 展开时高亮第一个可用项
    expect(options[0].classes()).toContain('is-active');
  });

  it('点击选项：更新选中值、收起面板、触发 change / update:value', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    await wrapper.findAll('[role="option"]')[2].trigger('click');
    expect(wrapper.find('.xui-select__value').text()).toBe('广州');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    expect(wrapper.emitted('change')).toEqual([['guangzhou']]);
    expect(wrapper.emitted('update:value')).toEqual([['guangzhou']]);
  });

  it('禁用项点击忽略（面板保持展开）', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    await wrapper.findAll('[role="option"]')[1].trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
  });

  it('clearable：选中后显示清除图标，点击触发 clear 并置空', async () => {
    const wrapper = mount(Select, {
      props: { options: OPTIONS, defaultValue: 'beijing', clearable: true },
    });
    const clear = wrapper.find('.xui-select__clear');
    expect(clear.exists()).toBe(true);
    await clear.trigger('click');
    expect(wrapper.find('.xui-select__placeholder').exists()).toBe(true);
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  it('disabled：点击不展开且标记 aria-disabled', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, disabled: true } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    expect(wrapper.find('.xui-select__trigger').attributes('aria-disabled')).toBe('true');
  });

  it('键盘：Enter 展开、ArrowDown 跳过禁用项、Enter 确认', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    const trigger = wrapper.find('.xui-select__trigger');
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'Enter' });
    // 高亮从北京跳过禁用的上海到广州
    expect(wrapper.emitted('change')).toEqual([['guangzhou']]);
  });

  it('键盘 Escape 收起面板', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    await wrapper.find('.xui-select__trigger').trigger('keydown', { key: 'Escape' });
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  });

  it('受控模式：select 仅触发回调，外部 value 同步显示', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, value: 'beijing' } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    await wrapper.findAll('[role="option"]')[2].trigger('click');
    expect(wrapper.emitted('change')).toEqual([['guangzhou']]);
    // 受控：内部值未变，显示仍是北京
    expect(wrapper.find('.xui-select__value').text()).toBe('北京');
    await wrapper.setProps({ value: 'guangzhou' });
    await nextTick();
    expect(wrapper.find('.xui-select__value').text()).toBe('广州');
  });

  it('点击组件外部收起面板', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS }, attachTo: document.body });
    await wrapper.find('.xui-select__trigger').trigger('click');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it('className / style 透传到根节点（含 CSS 变量）', () => {
    const wrapper = mount(Select, {
      props: {
        options: OPTIONS,
        className: 'my-select',
        style: { '--xui-select-max-height': '200px', margin: '4px' },
      },
    });
    expect(wrapper.classes()).toContain('my-select');
    expect(wrapper.classes()).toContain('xui-select');
    const style = wrapper.attributes('style');
    expect(style).toContain('--xui-select-max-height: 200px');
    expect(style).toContain('margin: 4px');
  });

  it('多选：tag 列表渲染，点击选项追加 tag 且面板不关闭', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, multiple: true } });
    expect(wrapper.classes()).toContain('is-multiple');

    await wrapper.find('.xui-select__trigger').trigger('click');
    await wrapper.findAll('[role="option"]')[0].trigger('click');
    await wrapper.findAll('[role="option"]')[2].trigger('click');

    const tags = wrapper.findAll('.xui-select__tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].text()).toContain('北京');
    expect(tags[1].text()).toContain('广州');
    // 面板保持展开
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    // onChange 载荷为数组（emitted 每项为参数列表）
    expect(wrapper.emitted('change')).toEqual([[['beijing']], [['beijing', 'guangzhou']]]);
  });

  it('多选：tag 删除按钮切换取消选中', async () => {
    const wrapper = mount(Select, {
      props: { options: OPTIONS, multiple: true, defaultValue: ['beijing', 'guangzhou'] },
    });
    expect(wrapper.findAll('.xui-select__tag')).toHaveLength(2);

    await wrapper.findAll('.xui-select__tag-close')[0].trigger('click');
    expect(wrapper.emitted('change')).toEqual([[['guangzhou']]]);
    expect(wrapper.findAll('.xui-select__tag')).toHaveLength(1);
  });

  it('多选 clearable：清空全部 tag', async () => {
    const wrapper = mount(Select, {
      props: { options: OPTIONS, multiple: true, defaultValue: ['beijing'], clearable: true },
    });
    await wrapper.find('.xui-select__clear').trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.findAll('.xui-select__tag')).toHaveLength(0);
  });

  it('可搜索：输入过滤选项，无匹配显示空态', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, searchable: true } });
    await wrapper.find('.xui-select__trigger').trigger('click');

    const input = wrapper.find('.xui-select__search');
    expect(input.exists()).toBe(true);
    await input.setValue('广');
    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].text()).toBe('广州');

    await input.setValue('不存在');
    expect(wrapper.find('.xui-select__empty').text()).toBe('无匹配结果');
    expect(wrapper.findAll('[role="option"]')).toHaveLength(0);

    // 点击过滤结果选中后清空搜索并收起
    await input.setValue('广');
    await wrapper.findAll('[role="option"]')[0].trigger('click');
    expect(wrapper.emitted('change')).toEqual([['guangzhou']]);
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  });

  it('虚拟模式：默认窗口渲染 + spacer 占位，滚动更新窗口', async () => {
    const bigOptions = Array.from({ length: 100 }, (_, i) => ({
      label: `选项${i + 1}`,
      value: `v${i + 1}`,
    }));
    const wrapper = mount(Select, {
      props: { options: bigOptions, virtual: true, maxHeight: 120 },
      attachTo: document.body,
    });
    await wrapper.find('.xui-select__trigger').trigger('click');

    expect(wrapper.classes()).toContain('is-virtual');
    // jsdom 视口高 0：窗口 = rawStart 0 + overscan 5 → 6 行（远小于 100）
    const bodyOptions = wrapper.findAll('[role="option"]');
    expect(bodyOptions.length).toBeLessThan(20);
    expect(wrapper.findAll('.xui-select__spacer').length).toBeGreaterThan(0);

    // 滚动到底部更新窗口
    const dropdown = wrapper.find('[role="listbox"]');
    Object.defineProperty(dropdown.element, 'scrollTop', {
      value: 3000,
      configurable: true,
      writable: true,
    });
    await dropdown.trigger('scroll');
    await new Promise((resolve) => setTimeout(resolve, 0));
    const texts = wrapper.findAll('[role="option"]').map((option) => option.text());
    expect(texts).toContain('选项100');
    wrapper.unmount();
  });

  it('clearIcon 插槽替换触发器清除与多选 tag 删除图标', () => {
    const wrapper = mount(Select, {
      props: { options: OPTIONS, multiple: true, defaultValue: ['beijing'], clearable: true },
      slots: { clearIcon: '<i class="my-clear-x">c</i>' },
    });
    expect(wrapper.find('.xui-select__clear .my-clear-x').exists()).toBe(true);
    expect(wrapper.find('.xui-select__clear svg').exists()).toBe(false);
    expect(wrapper.find('.xui-select__tag-close .my-clear-x').exists()).toBe(true);
    expect(wrapper.find('.xui-select__tag-close svg').exists()).toBe(false);
  });

  it('suffixIcon 插槽替换下拉箭头图标', () => {
    const wrapper = mount(Select, {
      props: { options: OPTIONS },
      slots: { suffixIcon: '<i class="my-arrow-x">v</i>' },
    });
    expect(wrapper.find('.xui-select__arrow .my-arrow-x').exists()).toBe(true);
    expect(wrapper.find('.xui-select__arrow svg').exists()).toBe(false);
  });

  it('视口避让：下方空间不足时根元素加 is-drop-up 向上展开', async () => {
    const original = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
      const rect = original.call(this);
      if (this.classList?.contains('xui-select')) {
        // 触发器贴近视口底部（jsdom 默认视口高 768）：下方仅剩 8px
        return { ...rect, top: 720, bottom: 760, left: 100, right: 300, width: 200, height: 40 };
      }
      if (this.classList?.contains('xui-select__dropdown')) {
        return { ...rect, top: 0, bottom: 240, left: 0, right: 200, width: 200, height: 240 };
      }
      return rect;
    };
    try {
      const wrapper = mount(Select, { props: { options: OPTIONS } });
      await wrapper.find('.xui-select__trigger').trigger('click');
      await nextTick();
      expect(wrapper.find('.xui-select').classes()).toContain('is-drop-up');
      wrapper.unmount();
    } finally {
      HTMLElement.prototype.getBoundingClientRect = original;
    }
  });
});
