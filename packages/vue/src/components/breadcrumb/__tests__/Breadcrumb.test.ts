import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Breadcrumb from '../Breadcrumb.vue';

const ITEMS = [{ label: '首页', href: '/home' }, { label: '列表' }, { label: '详情' }];

describe('Breadcrumb (vue)', () => {
  it('nav + ol 结构渲染 items，默认分隔符 /', () => {
    const wrapper = mount(Breadcrumb, { props: { items: ITEMS } });
    expect(wrapper.find('nav').attributes('aria-label')).toBe('面包屑');
    const items = wrapper.findAll('.xui-breadcrumb__item');
    expect(items).toHaveLength(3);
    const separators = wrapper.findAll('.xui-breadcrumb__separator');
    expect(separators).toHaveLength(2);
    expect(separators[0].text()).toBe('/');
    expect(separators[0].attributes('aria-hidden')).toBe('true');
  });

  it('末项 is-active + aria-current=page，且无分隔符', () => {
    const wrapper = mount(Breadcrumb, { props: { items: ITEMS } });
    const items = wrapper.findAll('.xui-breadcrumb__item');
    expect(items[2].classes()).toContain('is-active');
    expect(items[2].find('.xui-breadcrumb__label').attributes('aria-current')).toBe('page');
    expect(items[2].find('.xui-breadcrumb__separator').exists()).toBe(false);
  });

  it('href 项渲染 <a>，无 href 中间项渲染可点击 label', () => {
    const wrapper = mount(Breadcrumb, { props: { items: ITEMS } });
    const items = wrapper.findAll('.xui-breadcrumb__item');
    expect(items[0].find('a').attributes('href')).toBe('/home');
    expect(items[1].find('a').exists()).toBe(false);
    expect(items[1].find('.xui-breadcrumb__label').exists()).toBe(true);
  });

  it('点击中间可导航项触发 itemClick（携带 item 与 index）', async () => {
    const wrapper = mount(Breadcrumb, { props: { items: ITEMS } });
    await wrapper.findAll('.xui-breadcrumb__item')[0].find('a').trigger('click');
    const emitted = wrapper.emitted('itemClick');
    expect(emitted).toHaveLength(1);
    expect(emitted?.[0]).toEqual([ITEMS[0], 0]);
  });

  it('点击末项不触发 itemClick', async () => {
    const wrapper = mount(Breadcrumb, { props: { items: ITEMS } });
    await wrapper
      .findAll('.xui-breadcrumb__item')[2]
      .find('.xui-breadcrumb__label')
      .trigger('click');
    expect(wrapper.emitted('itemClick')).toBeUndefined();
  });

  it('disabled 项 is-disabled 且点击不触发', async () => {
    const items = [{ label: 'A', href: '/a' }, { label: 'B', disabled: true }, { label: 'C' }];
    const wrapper = mount(Breadcrumb, { props: { items } });
    const item = wrapper.findAll('.xui-breadcrumb__item')[1];
    expect(item.classes()).toContain('is-disabled');
    await item.find('.xui-breadcrumb__label').trigger('click');
    expect(wrapper.emitted('itemClick')).toBeUndefined();
  });

  it('separator 自定义生效', () => {
    const wrapper = mount(Breadcrumb, { props: { items: ITEMS, separator: '>' } });
    expect(wrapper.findAll('.xui-breadcrumb__separator')[0].text()).toBe('>');
  });

  it('default 插槽覆盖 items 渲染', () => {
    const wrapper = mount(Breadcrumb, {
      props: { items: ITEMS },
      slots: { default: '<span>自定义内容</span>' },
    });
    expect(wrapper.find('nav').text()).toBe('自定义内容');
    expect(wrapper.findAll('.xui-breadcrumb__item')).toHaveLength(0);
  });

  it('className / style 透传到根节点', () => {
    const wrapper = mount(Breadcrumb, {
      props: { items: ITEMS, className: 'my-x', style: { color: 'red' } },
    });
    const nav = wrapper.find('nav');
    expect(nav.classes()).toContain('my-x');
    expect(nav.attributes('style')).toContain('color: red');
  });
});
