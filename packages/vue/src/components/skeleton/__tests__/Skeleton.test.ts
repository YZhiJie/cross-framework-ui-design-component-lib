import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Skeleton from '../Skeleton.vue';

describe('Skeleton (vue)', () => {
  it('默认渲染骨架：3 行 + role=status', () => {
    const wrapper = mount(Skeleton);
    const root = wrapper.find('.xui-skeleton');
    expect(root.exists()).toBe(true);
    expect(root.attributes('role')).toBe('status');
    expect(root.attributes('aria-label')).toBe('加载中');
    expect(wrapper.findAll('.xui-skeleton__row')).toHaveLength(3);
    expect(wrapper.find('.xui-skeleton__avatar').exists()).toBe(false);
  });

  it('avatar=true 渲染头像占位', () => {
    const wrapper = mount(Skeleton, { props: { avatar: true } });
    expect(wrapper.find('.xui-skeleton__avatar').exists()).toBe(true);
  });

  it('rows 自定义行数，末行 is-last', () => {
    const wrapper = mount(Skeleton, { props: { rows: 5 } });
    const rows = wrapper.findAll('.xui-skeleton__row');
    expect(rows).toHaveLength(5);
    expect(rows[4].classes()).toContain('is-last');
    expect(rows[0].classes()).not.toContain('is-last');
  });

  it('rows 非法值回退 3 行', () => {
    const wrapper = mount(Skeleton, { props: { rows: 0 } });
    expect(wrapper.findAll('.xui-skeleton__row')).toHaveLength(3);
  });

  it('loading=false 渲染 default 插槽真实内容', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: false },
      slots: { default: '<p>真实内容</p>' },
    });
    expect(wrapper.find('.xui-skeleton').exists()).toBe(false);
    expect(wrapper.text()).toBe('真实内容');
  });

  it('loading 动态切换：骨架与真实内容互换', async () => {
    const wrapper = mount(Skeleton, { slots: { default: '<p>真实内容</p>' } });
    expect(wrapper.find('.xui-skeleton').exists()).toBe(true);
    await wrapper.setProps({ loading: false });
    expect(wrapper.find('.xui-skeleton').exists()).toBe(false);
    expect(wrapper.text()).toBe('真实内容');
    await wrapper.setProps({ loading: true });
    expect(wrapper.find('.xui-skeleton').exists()).toBe(true);
  });

  it('骨架占位元素 aria-hidden', () => {
    const wrapper = mount(Skeleton, { props: { avatar: true } });
    expect(wrapper.find('.xui-skeleton__avatar').attributes('aria-hidden')).toBe('true');
    expect(wrapper.find('.xui-skeleton__rows').attributes('aria-hidden')).toBe('true');
  });

  it('className / style 透传到根节点', () => {
    const wrapper = mount(Skeleton, {
      props: { className: 'my-x', style: { color: 'red' } },
    });
    const root = wrapper.find('.xui-skeleton');
    expect(root.classes()).toContain('xui-skeleton');
    expect(root.classes()).toContain('my-x');
    expect(root.attributes('style')).toContain('color: red');
  });
});
