import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Alert from '../Alert.vue';

describe('Alert (vue)', () => {
  it('渲染 title / description 与 BEM 类名', () => {
    const wrapper = mount(Alert, {
      props: { title: '提示', description: '内容详情' },
    });
    expect(wrapper.classes()).toContain('xui-alert');
    expect(wrapper.classes()).toContain('xui-alert--info');
    expect(wrapper.find('.xui-alert__title').text()).toBe('提示');
    expect(wrapper.find('.xui-alert__description').text()).toBe('内容详情');
  });

  it('role="alert" 保证读屏可达', () => {
    const wrapper = mount(Alert);
    expect(wrapper.attributes('role')).toBe('alert');
  });

  it('type 类名正确', () => {
    const wrapper = mount(Alert, { props: { type: 'warning' } });
    expect(wrapper.classes()).toContain('xui-alert--warning');
  });

  it('showIcon 时渲染默认图标', () => {
    const wrapper = mount(Alert, { props: { showIcon: true } });
    expect(wrapper.find('.xui-alert__icon').exists()).toBe(true);
    expect(wrapper.find('.xui-alert__icon svg').exists()).toBe(true);
  });

  it('icon 插槽覆盖默认图标', () => {
    const wrapper = mount(Alert, {
      props: { showIcon: true },
      slots: { icon: '<b class="custom-icon">!</b>' },
    });
    expect(wrapper.find('.custom-icon').exists()).toBe(true);
  });

  it('title / default 插槽覆盖 prop 文案', () => {
    const wrapper = mount(Alert, {
      props: { title: 'prop 标题', description: 'prop 描述' },
      slots: { title: '插槽标题', default: '插槽描述' },
    });
    expect(wrapper.find('.xui-alert__title').text()).toBe('插槽标题');
    expect(wrapper.find('.xui-alert__description').text()).toBe('插槽描述');
  });

  it('closable 时点击关闭按钮触发 close 事件并隐藏', async () => {
    const wrapper = mount(Alert, { props: { closable: true, title: 'x' } });
    expect(wrapper.find('.xui-alert__close').exists()).toBe(true);
    await wrapper.find('.xui-alert__close').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.find('.xui-alert').exists()).toBe(false);
  });

  it('非 closable 时不渲染关闭按钮', () => {
    const wrapper = mount(Alert);
    expect(wrapper.find('.xui-alert__close').exists()).toBe(false);
  });

  it('className / style 透传到根节点', () => {
    const wrapper = mount(Alert, {
      props: { className: 'my-x', style: { color: 'red' } },
    });
    expect(wrapper.classes()).toContain('xui-alert');
    expect(wrapper.classes()).toContain('my-x');
    expect(wrapper.attributes('style')).toContain('color: red');
  });
});
