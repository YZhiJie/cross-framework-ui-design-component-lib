import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Popconfirm from '../Popconfirm.vue';

describe('Popconfirm (vue)', () => {
  it('默认不渲染气泡，点击触发元素展开', async () => {
    const wrapper = mount(Popconfirm, {
      slots: { default: '<button type="button">删除</button>' },
    });
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(false);
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(true);
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(false);
  });

  it('content 文案 + 确认 / 取消按钮渲染', async () => {
    const wrapper = mount(Popconfirm, {
      props: { content: '确认删除该条数据？' },
      slots: { default: '<button type="button">删除</button>' },
    });
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    expect(wrapper.find('.xui-popconfirm__content').text()).toBe('确认删除该条数据？');
    const buttons = wrapper.findAll('.xui-popconfirm__actions button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].text()).toBe('取消');
    expect(buttons[1].text()).toBe('确定');
    expect(buttons[1].classes()).toContain('xui-button--primary');
  });

  it('#content 插槽覆盖 content prop', async () => {
    const wrapper = mount(Popconfirm, {
      props: { content: '默认文案' },
      slots: {
        default: '<button type="button">删除</button>',
        content: '<em>自定义内容</em>',
      },
    });
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    expect(wrapper.find('.xui-popconfirm__content').text()).toBe('自定义内容');
  });

  it('确定按钮：收起 + confirm 事件', async () => {
    const wrapper = mount(Popconfirm, {
      slots: { default: '<button type="button">删除</button>' },
    });
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    await wrapper.findAll('.xui-popconfirm__actions button')[1].trigger('click');
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(false);
    expect(wrapper.emitted('confirm')).toHaveLength(1);
    expect(wrapper.emitted('cancel')).toBeUndefined();
  });

  it('取消按钮：收起 + cancel 事件', async () => {
    const wrapper = mount(Popconfirm, {
      slots: { default: '<button type="button">删除</button>' },
    });
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    await wrapper.findAll('.xui-popconfirm__actions button')[0].trigger('click');
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(false);
    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(wrapper.emitted('confirm')).toBeUndefined();
  });

  it('placement 类名生效', async () => {
    const wrapper = mount(Popconfirm, {
      props: { placement: 'bottom' },
      slots: { default: '<button type="button">删除</button>' },
    });
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    expect(wrapper.find('.xui-popconfirm__popper').classes()).toContain('is-bottom');
  });

  it('disabled 时点击不展开；运行时禁用收起已开气泡', async () => {
    const wrapper = mount(Popconfirm, {
      slots: { default: '<button type="button">删除</button>' },
    });
    await wrapper.setProps({ disabled: true });
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(false);
    await wrapper.setProps({ disabled: false });
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(true);
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(false);
  });

  it('confirmText / cancelText 自定义', async () => {
    const wrapper = mount(Popconfirm, {
      props: { confirmText: 'OK', cancelText: 'No' },
      slots: { default: '<button type="button">删除</button>' },
    });
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    const buttons = wrapper.findAll('.xui-popconfirm__actions button');
    expect(buttons[0].text()).toBe('No');
    expect(buttons[1].text()).toBe('OK');
  });

  it('点击外部收起且不触发回调', async () => {
    const wrapper = mount(Popconfirm, {
      slots: { default: '<button type="button">删除</button>' },
    });
    await wrapper.find('.xui-popconfirm__trigger').trigger('click');
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(true);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-popconfirm__popper').exists()).toBe(false);
    expect(wrapper.emitted('confirm')).toBeUndefined();
    expect(wrapper.emitted('cancel')).toBeUndefined();
    wrapper.unmount();
  });
});
