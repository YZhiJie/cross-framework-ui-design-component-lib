import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Switch from '../Switch.vue';

describe('Switch (vue)', () => {
  it('渲染 role="switch" 与默认状态', () => {
    const wrapper = mount(Switch);
    expect(wrapper.attributes('role')).toBe('switch');
    expect(wrapper.attributes('aria-checked')).toBe('false');
    expect(wrapper.classes()).toContain('xui-switch');
    expect(wrapper.classes()).toContain('xui-switch--md');
  });

  it('非受控模式：点击切换并触发 change 事件', async () => {
    const wrapper = mount(Switch);
    await wrapper.trigger('click');
    expect(wrapper.attributes('aria-checked')).toBe('true');
    expect(wrapper.emitted('change')![0]).toEqual([true]);
    await wrapper.trigger('click');
    expect(wrapper.emitted('change')![1]).toEqual([false]);
  });

  it('受控模式：value 驱动选中态', async () => {
    const wrapper = mount(Switch, { props: { value: true } });
    expect(wrapper.attributes('aria-checked')).toBe('true');
    await wrapper.trigger('click');
    // 受控模式下组件不发起新值，仅通知外部
    expect(wrapper.emitted('change')![0]).toEqual([false]);
  });

  it('受控模式：外部 value 变更同步视觉状态', async () => {
    const wrapper = mount(Switch, { props: { value: false } });
    expect(wrapper.attributes('aria-checked')).toBe('false');
    await wrapper.setProps({ value: true });
    expect(wrapper.attributes('aria-checked')).toBe('true');
    await wrapper.setProps({ value: false });
    expect(wrapper.attributes('aria-checked')).toBe('false');
  });

  it('defaultValue 提供非受控初始状态', () => {
    const wrapper = mount(Switch, { props: { defaultValue: true } });
    expect(wrapper.attributes('aria-checked')).toBe('true');
  });

  it('disabled 时不触发 change 事件', async () => {
    const wrapper = mount(Switch, { props: { disabled: true } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.classes()).toContain('is-disabled');
  });

  it('loading 时切换被忽略并渲染 spinner', async () => {
    const wrapper = mount(Switch, { props: { loading: true } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.classes()).toContain('is-loading');
    expect(wrapper.find('.xui-switch__spinner').exists()).toBe(true);
  });

  it('size 类名与 modelValue 双向绑定', async () => {
    const wrapper = mount(Switch, { props: { size: 'sm', value: false } });
    expect(wrapper.classes()).toContain('xui-switch--sm');
    await wrapper.trigger('click');
    expect(wrapper.emitted('update:value')![0]).toEqual([true]);
  });

  it('className / style 透传到根元素', () => {
    const wrapper = mount(Switch, { props: { className: 'my-x', style: { color: 'red' } } });

    expect(wrapper.classes()).toContain('my-x');
    expect(wrapper.classes()).toContain('xui-switch');
    expect(wrapper.attributes('style')).toContain('color: red');
  });

  it('双态文本：checkedText / uncheckedText 常驻 DOM，CSS visibility 随状态切换', async () => {
    const wrapper = mount(Switch, {
      props: { checkedText: '开', uncheckedText: '关' },
    });
    expect(wrapper.classes()).toContain('xui-switch--has-text');
    // 两文本常驻 DOM（CSS Grid 重叠 + visibility 切换，宽度自适应较宽文本）
    const checkedEl = () => wrapper.find('.xui-switch__text--checked');
    const uncheckedEl = () => wrapper.find('.xui-switch__text--unchecked');
    expect(checkedEl().exists()).toBe(true);
    expect(uncheckedEl().exists()).toBe(true);
    expect(checkedEl().text()).toBe('开');
    expect(uncheckedEl().text()).toBe('关');
    // 文本对读屏隐藏（状态由 role="switch" + aria-checked 传达）
    expect(checkedEl().attributes('aria-hidden')).toBe('true');
    expect(uncheckedEl().attributes('aria-hidden')).toBe('true');

    // 关闭态：is-checked 类不存在 → CSS 中 --unchecked 可见、--checked 隐藏
    expect(wrapper.classes()).not.toContain('is-checked');
    await wrapper.trigger('click');
    // 开启态：is-checked 类存在 → CSS 中 --checked 可见、--unchecked 隐藏
    expect(wrapper.classes()).toContain('is-checked');
  });

  it('双态文本：超长文本提供 title 提示，空串兜底不渲染', () => {
    const wrapper = mount(Switch, {
      props: { checkedText: '', uncheckedText: '超长文本超长文本超长文本超长文本' },
    });
    // 空串 checkedText 视为未提供，仅 uncheckedText 渲染并带 title 提示
    expect(wrapper.find('.xui-switch__text--checked').exists()).toBe(false);
    const uncheckedEl = wrapper.find('.xui-switch__text--unchecked');
    expect(uncheckedEl.exists()).toBe(true);
    expect(uncheckedEl.attributes('title')).toBe('超长文本超长文本超长文本超长文本');

    // 仅提供 checkedText：开启态文本常驻 DOM（visibility 由 CSS 控制）
    const only = mount(Switch, { props: { checkedText: '开启' } });
    expect(only.classes()).toContain('xui-switch--has-text');
    expect(only.find('.xui-switch__text--checked').exists()).toBe(true);
    expect(only.find('.xui-switch__text--unchecked').exists()).toBe(false);
  });

  it('不传双态文本时保持纯开关模式（无文本节点与 has-text 类）', () => {
    const wrapper = mount(Switch);
    expect(wrapper.classes()).not.toContain('xui-switch--has-text');
    expect(wrapper.find('.xui-switch__text').exists()).toBe(false);
  });

  it('loadingIcon 插槽替换内置 spinner', () => {
    const wrapper = mount(Switch, {
      props: { loading: true },
      slots: { loadingIcon: '<i class="my-loading-x">L</i>' },
    });
    expect(wrapper.find('.xui-switch__thumb .my-loading-x').exists()).toBe(true);
    expect(wrapper.find('.xui-switch__spinner').exists()).toBe(false);
  });
});
