import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Dropdown from '../Dropdown.vue';
import type { DropdownOption } from '@xui-design/core';

vi.useFakeTimers();

const menu: DropdownOption[] = [
  { key: 'copy', label: '复制', icon: 'user' },
  { key: 'cut', label: '剪切', disabled: true },
  { key: 'del', label: '删除', danger: true, divided: true, icon: 'unknown-icon' },
];

describe('Dropdown (vue)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('渲染触发元素与 BEM 类名', () => {
    const wrapper = mount(Dropdown, {
      props: { menu, trigger: 'click' },
      slots: { default: '<button type="button">操作</button>' },
    });
    expect(wrapper.classes()).toContain('xui-dropdown');
    expect(wrapper.find('.xui-dropdown__trigger').exists()).toBe(true);
    expect(wrapper.find('.xui-dropdown__trigger').text()).toContain('操作');
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(false);
  });

  it('click 触发：点击打开菜单并渲染菜单项', async () => {
    const wrapper = mount(Dropdown, { props: { menu, trigger: 'click' } });
    await wrapper.find('.xui-dropdown__trigger').trigger('click');
    const items = wrapper.findAll('.xui-dropdown__item');
    expect(items).toHaveLength(3);
    expect(items[0].text()).toBe('复制');
    expect(items[0].classes()).not.toContain('is-danger');
    expect(items[1].classes()).toContain('is-disabled');
    expect(items[2].classes()).toContain('is-danger');
    expect(items[2].classes()).toContain('is-divided');
  });

  it('点击菜单项触发 select（key / option 载荷）并收起菜单', async () => {
    const wrapper = mount(Dropdown, { props: { menu, trigger: 'click' } });
    await wrapper.find('.xui-dropdown__trigger').trigger('click');
    await wrapper.findAll('.xui-dropdown__item')[0].trigger('click');

    const emitted = wrapper.emitted('select');
    expect(emitted).toHaveLength(1);
    expect(emitted![0][0]).toBe('copy');
    expect((emitted![0][1] as DropdownOption).label).toBe('复制');
    expect(wrapper.emitted('visibleChange')).toEqual([[true], [false]]);
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(false);
  });

  it('禁用菜单项点击无效（不收起、不回调）', async () => {
    const wrapper = mount(Dropdown, { props: { menu, trigger: 'click' } });
    await wrapper.find('.xui-dropdown__trigger').trigger('click');
    await wrapper.findAll('.xui-dropdown__item')[1].trigger('click');

    expect(wrapper.emitted('select')).toBeUndefined();
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(true);
  });

  it('disabled 组件点击触发无效', async () => {
    const wrapper = mount(Dropdown, { props: { menu, trigger: 'click', disabled: true } });
    await wrapper.find('.xui-dropdown__trigger').trigger('click');
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(false);
    expect(wrapper.find('.xui-dropdown__trigger').classes()).toContain('is-disabled');
  });

  it('hover 触发：mouseenter 延迟打开，mouseleave 延迟收起', async () => {
    const wrapper = mount(Dropdown, { props: { menu } });
    await wrapper.find('.xui-dropdown__trigger').trigger('mouseenter');
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(false);

    vi.advanceTimersByTime(100);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(true);

    await wrapper.find('.xui-dropdown__trigger').trigger('mouseleave');
    vi.advanceTimersByTime(150);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(false);
  });

  it('Esc 收起菜单（不触发 select）', async () => {
    const wrapper = mount(Dropdown, { props: { menu, trigger: 'click' } });
    await wrapper.find('.xui-dropdown__trigger').trigger('click');
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(false);
    expect(wrapper.emitted('select')).toBeUndefined();
  });

  it('点击外部收起菜单', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, trigger: 'click' },
      attachTo: document.body,
    });
    await wrapper.find('.xui-dropdown__trigger').trigger('click');
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(true);

    document.body.dispatchEvent(new Event('mousedown', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(false);
    wrapper.unmount();
  });

  it('ref 命令式 show / hide / toggle', async () => {
    const wrapper = mount(Dropdown, { props: { menu, trigger: 'click' } });

    (wrapper.vm as unknown as { show: () => void }).show();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(true);

    (wrapper.vm as unknown as { hide: () => void }).hide();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(false);

    (wrapper.vm as unknown as { toggle: () => void }).toggle();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-dropdown__menu').exists()).toBe(true);
  });

  it('渲染已知图标、忽略未知图标', async () => {
    const wrapper = mount(Dropdown, { props: { menu, trigger: 'click' } });
    await wrapper.find('.xui-dropdown__trigger').trigger('click');
    const items = wrapper.findAll('.xui-dropdown__item');
    expect(items[0].find('.xui-dropdown__item-icon').exists()).toBe(true);
    expect(items[2].find('.xui-dropdown__item-icon').exists()).toBe(false);
  });
});
