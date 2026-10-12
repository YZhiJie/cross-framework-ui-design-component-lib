import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../Button.vue';

describe('Button 组件（Vue 适配层）', () => {
  it('渲染默认类名 xui-button 与默认 type/size 修饰类', () => {
    const wrapper = mount(Button, { slots: { default: '确定' } });

    expect(wrapper.classes()).toContain('xui-button');
    expect(wrapper.classes()).toContain('xui-button--default');
    expect(wrapper.classes()).toContain('xui-button--md');
    expect(wrapper.classes()).not.toContain('is-disabled');
    expect(wrapper.classes()).not.toContain('is-loading');
    expect(wrapper.attributes('disabled')).toBeUndefined();
  });

  it('原生 type 固定为 button，避免表单内点击意外触发提交', () => {
    const wrapper = mount(Button, { slots: { default: '重置' } });
    expect(wrapper.attributes('type')).toBe('button');
  });

  it('type 传值生效', () => {
    const wrapper = mount(Button, { props: { type: 'primary' } });
    expect(wrapper.classes()).toContain('xui-button--primary');

    const dangerWrapper = mount(Button, { props: { type: 'danger' } });
    expect(dangerWrapper.classes()).toContain('xui-button--danger');

    const linkWrapper = mount(Button, { props: { type: 'link' } });
    expect(linkWrapper.classes()).toContain('xui-button--link');
  });

  it('size 传值生效', () => {
    const wrapper = mount(Button, { props: { size: 'sm' } });
    expect(wrapper.classes()).toContain('xui-button--sm');

    const lgWrapper = mount(Button, { props: { size: 'lg' } });
    expect(lgWrapper.classes()).toContain('xui-button--lg');
  });

  it('block 时渲染 is-block 类', () => {
    const wrapper = mount(Button, { props: { block: true } });
    expect(wrapper.classes()).toContain('is-block');
  });

  it('点击 emit click 事件', async () => {
    const wrapper = mount(Button);

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('click')?.[0]?.[0]).toBeInstanceOf(Event);
  });

  it('disabled 时点击不 emit click', async () => {
    const wrapper = mount(Button, { props: { disabled: true } });

    expect(wrapper.classes()).toContain('is-disabled');
    expect(wrapper.attributes('disabled')).toBeDefined();

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('loading 时显示加载态并禁用', async () => {
    const wrapper = mount(Button, { props: { loading: true } });

    expect(wrapper.classes()).toContain('is-loading');
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.find('.xui-button__loading-icon').exists()).toBe(true);
    expect(wrapper.find('.xui-button__spinner').exists()).toBe(true);
    // 内容仍渲染
    expect(wrapper.find('.xui-button__content').exists()).toBe(true);

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('loading 时可通过 loadingIcon 插槽自定义加载图标', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { loadingIcon: '<i class="custom-loading" />' },
    });

    expect(wrapper.find('.custom-loading').exists()).toBe(true);
    expect(wrapper.find('.xui-button__spinner').exists()).toBe(false);
  });

  it('loading 时 icon 插槽不渲染', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { icon: '<i class="custom-icon" />' },
    });

    expect(wrapper.find('.xui-button__icon').exists()).toBe(false);
  });

  it('非 loading 时 icon 插槽渲染在前置图标区', () => {
    const wrapper = mount(Button, {
      slots: { icon: '<i class="custom-icon" />' },
    });

    expect(wrapper.find('.xui-button__icon .custom-icon').exists()).toBe(true);
  });

  it('默认插槽内容渲染在按钮内容区', () => {
    const wrapper = mount(Button, { slots: { default: '主要操作' } });

    expect(wrapper.find('.xui-button__content').text()).toBe('主要操作');
  });

  it('className / style 透传到根元素', () => {
    const wrapper = mount(Button, {
      props: { className: 'my-x', style: { color: 'red' } },
      slots: { default: '主要操作' },
    });

    expect(wrapper.classes()).toContain('my-x');
    expect(wrapper.classes()).toContain('xui-button');
    expect(wrapper.attributes('style')).toContain('color: red');
  });
});
