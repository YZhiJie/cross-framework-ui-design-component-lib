import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Empty from '../Empty.vue';

describe('Empty (vue)', () => {
  it('渲染默认插画', () => {
    const wrapper = mount(Empty);
    expect(wrapper.classes()).toContain('xui-empty');
    expect(wrapper.find('svg.xui-empty__svg').exists()).toBe(true);
  });

  it('description 渲染描述文案', () => {
    const wrapper = mount(Empty, { props: { description: '暂无数据' } });
    expect(wrapper.find('.xui-empty__description').text()).toBe('暂无数据');
  });

  it('未提供或空白 description 不渲染描述区', () => {
    const none = mount(Empty);
    expect(none.find('.xui-empty__description').exists()).toBe(false);

    const blank = mount(Empty, { props: { description: '   ' } });
    expect(blank.find('.xui-empty__description').exists()).toBe(false);
  });

  it('image 插槽覆盖默认插画', () => {
    const wrapper = mount(Empty, { slots: { image: '<div class="custom-img">img</div>' } });
    expect(wrapper.find('.custom-img').exists()).toBe(true);
    expect(wrapper.find('svg.xui-empty__svg').exists()).toBe(false);
  });

  it('default 插槽渲染底部动作区', () => {
    const wrapper = mount(Empty, { slots: { default: '<button>去创建</button>' } });
    expect(wrapper.find('.xui-empty__footer').exists()).toBe(true);
    expect(wrapper.text()).toContain('去创建');
  });

  it('未提供 default 插槽时不渲染动作区', () => {
    const wrapper = mount(Empty, { props: { description: '暂无数据' } });
    expect(wrapper.find('.xui-empty__footer').exists()).toBe(false);
  });
});
