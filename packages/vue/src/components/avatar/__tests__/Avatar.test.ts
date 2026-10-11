import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Avatar from '../Avatar.vue';

describe('Avatar (vue)', () => {
  it('默认渲染图标与尺寸/形状类名', () => {
    const wrapper = mount(Avatar);
    expect(wrapper.classes()).toContain('xui-avatar');
    expect(wrapper.classes()).toContain('xui-avatar--md');
    expect(wrapper.classes()).toContain('xui-avatar--circle');
    expect(wrapper.find('svg.xui-avatar__icon').exists()).toBe(true);
  });

  it('default 插槽渲染自定义内容', () => {
    const wrapper = mount(Avatar, { slots: { default: 'X' } });
    expect(wrapper.find('.xui-avatar__inner').text()).toBe('X');
    expect(wrapper.find('svg.xui-avatar__icon').exists()).toBe(false);
  });

  it('src 渲染图片与 alt', () => {
    const wrapper = mount(Avatar, { props: { src: 'a.png', alt: '头像' } });
    const img = wrapper.find('img.xui-avatar__img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('a.png');
    expect(img.attributes('alt')).toBe('头像');
  });

  it('图片加载失败回退默认图标并触发 error 事件', async () => {
    const wrapper = mount(Avatar, { props: { src: 'broken.png' } });
    await wrapper.find('img').trigger('error');
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.find('svg.xui-avatar__icon').exists()).toBe(true);
    expect(wrapper.emitted('error')).toHaveLength(1);
  });

  it('失败后更换 src 重置失败态（新图可重试）', async () => {
    const wrapper = mount(Avatar, { props: { src: 'broken.png' } });
    await wrapper.find('img').trigger('error');
    expect(wrapper.find('img').exists()).toBe(false);

    await wrapper.setProps({ src: 'fixed.png' });
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('img').attributes('src')).toBe('fixed.png');
  });

  it('square 形状与尺寸类名', () => {
    const wrapper = mount(Avatar, { props: { size: 'lg', shape: 'square' } });
    expect(wrapper.classes()).toContain('xui-avatar--lg');
    expect(wrapper.classes()).toContain('xui-avatar--square');
  });
});
