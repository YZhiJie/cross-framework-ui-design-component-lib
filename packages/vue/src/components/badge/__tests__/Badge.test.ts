import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from '../Badge.vue';

describe('Badge (vue)', () => {
  it('包裹模式：渲染内容与徽标', () => {
    const wrapper = mount(Badge, { props: { count: 5 }, slots: { default: 'inbox' } });
    expect(wrapper.find('.xui-badge').exists()).toBe(true);
    expect(wrapper.find('.xui-badge__sup').text()).toContain('5');
    expect(wrapper.text()).toContain('inbox');
  });

  it('count 未提供时不渲染徽标', () => {
    const wrapper = mount(Badge, { slots: { default: 'inbox' } });
    expect(wrapper.find('.xui-badge__sup').exists()).toBe(false);
  });

  it('count 为 0 默认隐藏，showZero 开启后显示', () => {
    const hidden = mount(Badge, { props: { count: 0 }, slots: { default: 'inbox' } });
    expect(hidden.find('.xui-badge__sup').exists()).toBe(false);

    const shown = mount(Badge, {
      props: { count: 0, showZero: true },
      slots: { default: 'inbox' },
    });
    expect(shown.find('.xui-badge__sup').text()).toContain('0');
  });

  it('count 超过 max 显示 `${max}+`', () => {
    const wrapper = mount(Badge, { props: { count: 120 }, slots: { default: 'inbox' } });
    expect(wrapper.find('.xui-badge__sup').text()).toContain('99+');
  });

  it('dot 模式渲染点状徽标（无文本、aria-hidden）', () => {
    const wrapper = mount(Badge, { props: { count: 5, dot: true }, slots: { default: 'inbox' } });
    const sup = wrapper.find('.xui-badge__sup');
    expect(sup.classes()).toContain('is-dot');
    expect(sup.attributes('aria-hidden')).toBe('true');
    expect(sup.text()).not.toContain('5');
  });

  it('独立模式渲染 standalone 徽标', () => {
    const wrapper = mount(Badge, { props: { count: 5 } });
    const sup = wrapper.find('sup');
    expect(sup.classes()).toContain('xui-badge__sup');
    expect(sup.classes()).toContain('xui-badge__sup--standalone');
  });

  it('非法 count（NaN）不渲染徽标', () => {
    const wrapper = mount(Badge, { props: { count: Number.NaN }, slots: { default: 'inbox' } });
    expect(wrapper.find('.xui-badge__sup').exists()).toBe(false);
  });

  it('className / style 透传到根节点', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, className: 'my-x', style: { color: 'red' } },
      slots: { default: 'inbox' },
    });
    const root = wrapper.find('.xui-badge');
    expect(root.classes()).toContain('xui-badge');
    expect(root.classes()).toContain('my-x');
    expect(root.attributes('style')).toContain('color: red');
  });
});
