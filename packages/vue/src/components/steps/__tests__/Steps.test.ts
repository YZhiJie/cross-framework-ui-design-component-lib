import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Steps from '../Steps.vue';
import type { StepItem } from '@xui-design/core';

const items: StepItem[] = [
  { key: 'a', title: '第一步', description: '填写信息' },
  { key: 'b', title: '第二步', disabled: true },
  { key: 'c', title: '第三步' },
  { key: 'd', title: '第四步' },
];

describe('Steps (vue)', () => {
  it('渲染步骤标题与 BEM 类名，默认水平方向', () => {
    const wrapper = mount(Steps, { props: { items } });
    expect(wrapper.classes()).toContain('xui-steps');
    expect(wrapper.classes()).toContain('is-horizontal');
    expect(wrapper.findAll('.xui-steps__title').map((n) => n.text())).toEqual(
      items.map((i) => i.title),
    );
  });

  it('描述与索引渲染', () => {
    const wrapper = mount(Steps, { props: { items } });
    expect(wrapper.find('.xui-steps__description').text()).toBe('填写信息');
    expect(wrapper.findAll('.xui-steps__index').map((n) => n.text())).toEqual(['1', '2', '3', '4']);
  });

  it('状态推导：finish 对勾 / process 高亮 / wait 数字', () => {
    const wrapper = mount(Steps, { props: { items, defaultValue: 2 } });
    const nodes = wrapper.findAll('.xui-steps__item');
    expect(nodes[0].classes()).toContain('is-finish');
    expect(nodes[1].classes()).toContain('is-finish');
    expect(nodes[2].classes()).toContain('is-process');
    expect(nodes[2].classes()).toContain('is-current');
    expect(nodes[3].classes()).toContain('is-wait');
  });

  it('status 覆盖当前步骤状态（error 渲染叉图标）', () => {
    const wrapper = mount(Steps, { props: { items, defaultValue: 1, status: 'error' } });
    expect(wrapper.findAll('.xui-steps__item')[1].classes()).toContain('is-error');
  });

  it('点击步骤触发 change 与 update:value', async () => {
    const wrapper = mount(Steps, { props: { items } });
    await wrapper.findAll('.xui-steps__item')[2].trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([2]);
    expect(wrapper.emitted('update:value')?.[0]).toEqual([2]);
    expect(wrapper.findAll('.xui-steps__item')[2].classes()).toContain('is-current');
  });

  it('禁用步骤点击 no-op', async () => {
    const wrapper = mount(Steps, { props: { items } });
    await wrapper.findAll('.xui-steps__item')[1].trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('受控 value 变更同步高亮', async () => {
    const wrapper = mount(Steps, { props: { items, value: 0 } });
    expect(wrapper.findAll('.xui-steps__item')[0].classes()).toContain('is-current');
    await wrapper.setProps({ value: 2 });
    expect(wrapper.findAll('.xui-steps__item')[2].classes()).toContain('is-current');
  });

  it('direction 垂直布局类名', () => {
    const wrapper = mount(Steps, { props: { items, direction: 'vertical' } });
    expect(wrapper.classes()).toContain('is-vertical');
  });

  it('暴露 next / prev / goTo 命令式 API', async () => {
    const wrapper = mount(Steps, { props: { items } });
    wrapper.vm.next(); // 目标 1 禁用 no-op
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-steps__item')[1].classes()).not.toContain('is-current');
    wrapper.vm.goTo(2);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-steps__item')[2].classes()).toContain('is-current');
    wrapper.vm.prev();
    await wrapper.vm.$nextTick();
    // prev 目标 1 禁用 no-op，仍停留在 2
    expect(wrapper.findAll('.xui-steps__item')[2].classes()).toContain('is-current');
  });
});
