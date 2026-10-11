import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Tag from '../Tag.vue';

describe('Tag (vue)', () => {
  it('渲染内容与 BEM 类名', () => {
    const wrapper = mount(Tag, { slots: { default: '标签' } });
    expect(wrapper.classes()).toContain('xui-tag');
    expect(wrapper.classes()).toContain('xui-tag--default');
    expect(wrapper.classes()).toContain('xui-tag--md');
    expect(wrapper.text()).toContain('标签');
  });

  it('type / size 类名正确', () => {
    const wrapper = mount(Tag, { props: { type: 'success', size: 'sm' } });
    expect(wrapper.classes()).toContain('xui-tag--success');
    expect(wrapper.classes()).toContain('xui-tag--sm');
  });

  it('closable 时渲染关闭按钮', () => {
    const wrapper = mount(Tag, { props: { closable: true } });
    expect(wrapper.find('.xui-tag__close').exists()).toBe(true);
  });

  it('点击关闭按钮触发 close 事件并隐藏标签', async () => {
    const wrapper = mount(Tag, { props: { closable: true }, slots: { default: 'x' } });
    await wrapper.find('.xui-tag__close').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.find('.xui-tag').exists()).toBe(false);
  });

  it('非 closable 时不渲染关闭按钮，无 close 事件', async () => {
    const wrapper = mount(Tag);
    expect(wrapper.find('.xui-tag__close').exists()).toBe(false);
    await wrapper.trigger('click');
    expect(wrapper.emitted('close')).toBeUndefined();
  });

  it('className / style 透传到根节点', () => {
    const wrapper = mount(Tag, {
      props: { className: 'my-x', style: { color: 'red' } },
      slots: { default: '标签' },
    });
    expect(wrapper.classes()).toContain('xui-tag');
    expect(wrapper.classes()).toContain('my-x');
    expect(wrapper.attributes('style')).toContain('color: red');
  });

  it('closeIcon 插槽替换内置关闭图标', () => {
    const wrapper = mount(Tag, {
      props: { closable: true },
      slots: { closeIcon: '<i class="my-close-x">x</i>' },
    });
    expect(wrapper.find('.xui-tag__close .my-close-x').exists()).toBe(true);
    expect(wrapper.find('.xui-tag__close svg').exists()).toBe(false);
  });
});
