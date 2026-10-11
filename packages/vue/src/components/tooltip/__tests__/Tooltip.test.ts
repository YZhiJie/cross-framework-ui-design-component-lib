import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tooltip from '../Tooltip.vue';

/** 按 class 桩接 getBoundingClientRect，模拟触发器贴近视口顶部、浮层 120×60 */
function stubRects() {
  const original = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
    const rect = original.call(this);
    if (this.classList?.contains('xui-tooltip__trigger')) {
      return { ...rect, top: 10, bottom: 50, left: 100, right: 200, width: 100, height: 40 };
    }
    if (this.classList?.contains('xui-tooltip__popper')) {
      return { ...rect, top: 0, bottom: 60, left: 0, right: 120, width: 120, height: 60 };
    }
    return rect;
  };
  return () => {
    HTMLElement.prototype.getBoundingClientRect = original;
  };
}

describe('Tooltip (vue)', () => {
  it('默认不渲染提示框，hover 显示 content，leave 收起', async () => {
    const wrapper = mount(Tooltip, { props: { content: '提示文字' }, slots: { default: '目标' } });
    expect(wrapper.find('.xui-tooltip__popper').exists()).toBe(false);
    expect(wrapper.text()).toContain('目标');

    await wrapper.trigger('mouseenter');
    const popper = wrapper.find('.xui-tooltip__popper');
    expect(popper.exists()).toBe(true);
    expect(popper.text()).toContain('提示文字');
    expect(popper.classes()).toContain('is-top');
    expect(popper.attributes('role')).toBe('tooltip');

    await wrapper.trigger('mouseleave');
    expect(wrapper.find('.xui-tooltip__popper').exists()).toBe(false);
  });

  it('placement 映射到 popper 方位类名', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'x', placement: 'right' },
      slots: { default: '目标' },
    });
    await wrapper.trigger('mouseenter');
    expect(wrapper.find('.xui-tooltip__popper').classes()).toContain('is-right');
  });

  it('trigger="focus" 时通过 focusin / focusout 控制', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'x', trigger: 'focus' },
      slots: { default: '目标' },
    });
    await wrapper.trigger('mouseenter');
    expect(wrapper.find('.xui-tooltip__popper').exists()).toBe(false);

    await wrapper.trigger('focusin');
    expect(wrapper.find('.xui-tooltip__popper').exists()).toBe(true);

    await wrapper.trigger('focusout');
    expect(wrapper.find('.xui-tooltip__popper').exists()).toBe(false);
  });

  it('disabled 时不响应 hover，运行时禁用会收起', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'x', disabled: true },
      slots: { default: '目标' },
    });
    await wrapper.trigger('mouseenter');
    expect(wrapper.find('.xui-tooltip__popper').exists()).toBe(false);

    await wrapper.setProps({ disabled: false });
    await wrapper.trigger('mouseenter');
    expect(wrapper.find('.xui-tooltip__popper').exists()).toBe(true);

    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('.xui-tooltip__popper').exists()).toBe(false);
  });

  it('content 插槽优先于 content prop', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'prop 内容' },
      slots: { default: '目标', content: '<strong>插槽内容</strong>' },
    });
    await wrapper.trigger('mouseenter');
    expect(wrapper.find('.xui-tooltip__popper').text()).toContain('插槽内容');
    expect(wrapper.find('.xui-tooltip__popper').text()).not.toContain('prop 内容');
  });

  it('className / style 透传到根元素', () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'x', className: 'my-x', style: { color: 'red' } },
      slots: { default: '目标' },
    });
    expect(wrapper.classes()).toContain('my-x');
    expect(wrapper.classes()).toContain('xui-tooltip');
    expect(wrapper.attributes('style')).toContain('color: red');
  });

  it('气泡渲染在 trigger 内部（flex/grid stretch 下定位基准不偏移）', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'x' },
      slots: { default: '目标' },
    });
    await wrapper.trigger('mouseenter');
    // popper 必须是 trigger 的后代：trigger 始终贴合触发器，包裹根即使被拉伸也不影响锚定
    expect(wrapper.find('.xui-tooltip__trigger > .xui-tooltip__popper').exists()).toBe(true);
    expect(wrapper.find('.xui-tooltip > .xui-tooltip__popper').exists()).toBe(false);
  });

  it('视口避让：首选 top 空间不足时翻转为 bottom', async () => {
    const restore = stubRects();
    try {
      const wrapper = mount(Tooltip, {
        props: { content: 'x', placement: 'top' },
        slots: { default: '目标' },
      });
      await wrapper.trigger('mouseenter');
      await nextTick();
      expect(wrapper.find('.xui-tooltip__popper').classes()).toContain('is-bottom');
      wrapper.unmount();
    } finally {
      restore();
    }
  });
});
