import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Spin from '../Spin.vue';

describe('Spin (vue)', () => {
  it('独立模式：渲染指示器与 role=status，默认 is-md', () => {
    const wrapper = mount(Spin);
    const root = wrapper.find('.xui-spin');
    expect(root.exists()).toBe(true);
    expect(root.attributes('role')).toBe('status');
    expect(root.attributes('aria-live')).toBe('polite');
    expect(root.find('.xui-spin__indicator').classes()).toContain('is-md');
    expect(root.find('.xui-spin__tip').exists()).toBe(false);
  });

  it('tip 渲染在指示器下方', () => {
    const wrapper = mount(Spin, { props: { tip: '加载中' } });
    expect(wrapper.find('.xui-spin__tip').text()).toBe('加载中');
  });

  it('size sm / lg 类名生效', () => {
    expect(
      mount(Spin, { props: { size: 'sm' } })
        .find('.xui-spin__indicator')
        .classes(),
    ).toContain('is-sm');
    expect(
      mount(Spin, { props: { size: 'lg' } })
        .find('.xui-spin__indicator')
        .classes(),
    ).toContain('is-lg');
  });

  it('包裹模式：内容渲染 + 遮罩 + 内容模糊', () => {
    const wrapper = mount(Spin, {
      props: { tip: '加载中' },
      slots: { default: '<p>面板内容</p>' },
    });
    expect(wrapper.find('.xui-spin--wrapper').exists()).toBe(true);
    expect(wrapper.find('.xui-spin__content').text()).toBe('面板内容');
    expect(wrapper.find('.xui-spin__content').classes()).toContain('is-blur');
    expect(wrapper.find('.xui-spin__mask').exists()).toBe(true);
    expect(wrapper.find('.xui-spin__mask .xui-spin__tip').text()).toBe('加载中');
  });

  it('包裹模式 spinning=false：遮罩消失、内容不模糊', () => {
    const wrapper = mount(Spin, {
      props: { spinning: false },
      slots: { default: '<p>面板内容</p>' },
    });
    expect(wrapper.find('.xui-spin__mask').exists()).toBe(false);
    expect(wrapper.find('.xui-spin__content').classes()).not.toContain('is-blur');
    expect(wrapper.find('.xui-spin__content').text()).toBe('面板内容');
  });

  it('独立模式 spinning=false 不渲染', () => {
    const wrapper = mount(Spin, { props: { spinning: false } });
    expect(wrapper.find('.xui-spin').exists()).toBe(false);
  });

  it('spinning 动态切换：遮罩出现与消失', async () => {
    const wrapper = mount(Spin, { slots: { default: 'content' } });
    expect(wrapper.find('.xui-spin__mask').exists()).toBe(true);
    await wrapper.setProps({ spinning: false });
    expect(wrapper.find('.xui-spin__mask').exists()).toBe(false);
    await wrapper.setProps({ spinning: true });
    expect(wrapper.find('.xui-spin__mask').exists()).toBe(true);
  });

  it('className / style 透传到根节点', () => {
    const wrapper = mount(Spin, {
      props: { className: 'my-x', style: { color: 'red' } },
    });
    const root = wrapper.find('.xui-spin');
    expect(root.classes()).toContain('xui-spin');
    expect(root.classes()).toContain('my-x');
    expect(root.attributes('style')).toContain('color: red');
  });
});
