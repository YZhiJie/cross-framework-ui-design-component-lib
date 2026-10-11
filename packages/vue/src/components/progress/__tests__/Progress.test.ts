import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Progress from '../Progress.vue';

describe('Progress (vue)', () => {
  it('渲染 line 进度条与百分比文本', () => {
    const wrapper = mount(Progress, { props: { percent: 30 } });
    expect(wrapper.classes()).toContain('xui-progress');
    expect(wrapper.classes()).toContain('xui-progress--line');
    expect(wrapper.attributes('role')).toBe('progressbar');
    expect(wrapper.attributes('aria-valuenow')).toBe('30');
    expect(wrapper.text()).toContain('30%');
    expect(wrapper.find('.xui-progress__bar').attributes('style')).toContain('width: 30%');
  });

  it('percent 越界收敛到 [0, 100]', () => {
    const high = mount(Progress, { props: { percent: 150 } });
    expect(high.attributes('aria-valuenow')).toBe('100');
    expect(high.text()).toContain('100%');

    const low = mount(Progress, { props: { percent: -10 } });
    expect(low.attributes('aria-valuenow')).toBe('0');
  });

  it('percent 非有限数值按 0 处理', () => {
    const wrapper = mount(Progress, { props: { percent: Number.NaN } });
    expect(wrapper.attributes('aria-valuenow')).toBe('0');
  });

  it('percent 达到 100 派生 success 状态类', () => {
    const wrapper = mount(Progress, { props: { percent: 100 } });
    expect(wrapper.classes()).toContain('is-success');
  });

  it('显式 status 优先于派生', () => {
    const wrapper = mount(Progress, { props: { percent: 100, status: 'error' } });
    expect(wrapper.classes()).toContain('is-error');
  });

  it('showText false 不渲染文本', () => {
    const wrapper = mount(Progress, { props: { percent: 30, showText: false } });
    expect(wrapper.find('.xui-progress__text').exists()).toBe(false);
  });

  it('circle 类型渲染 SVG 圆环', () => {
    const wrapper = mount(Progress, { props: { percent: 40, type: 'circle' } });
    expect(wrapper.classes()).toContain('xui-progress--circle');
    expect(wrapper.find('svg.xui-progress__svg').exists()).toBe(true);
    const bar = wrapper.find('circle.xui-progress__bar');
    expect(bar.exists()).toBe(true);
    expect(bar.attributes('stroke-dasharray')).toBeDefined();
    expect(Number(bar.attributes('stroke-dashoffset'))).toBeGreaterThan(0);
  });

  it('className / style 透传到根节点', () => {
    const wrapper = mount(Progress, {
      props: { percent: 30, className: 'my-x', style: { color: 'red' } },
    });
    expect(wrapper.classes()).toContain('xui-progress');
    expect(wrapper.classes()).toContain('my-x');
    expect(wrapper.attributes('style')).toContain('color: red');
  });
});
