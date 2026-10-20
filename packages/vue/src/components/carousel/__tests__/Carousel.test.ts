import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Carousel from '../Carousel.vue';
import type { CarouselItem } from '@xui-design/core';

const items: CarouselItem[] = [
  { key: 'a', image: '/a.jpg', alt: 'A' },
  { key: 'b', image: '/b.jpg', alt: 'B' },
  { key: 'c', image: '/c.jpg', alt: 'C' },
];

const mountCarousel = (props: Record<string, unknown> = {}) =>
  mount(Carousel, { props: { items, autoplay: false, ...props } });

describe('Carousel (Vue)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('基础渲染：首尾克隆 + 实际项，第二张（virtual 0）为激活态', () => {
    const wrapper = mountCarousel();
    const slides = wrapper.findAll('.xui-carousel__slide');
    expect(slides).toHaveLength(5);
    expect(slides[1].classes()).toContain('is-active');
    expect(wrapper.findAll('.xui-carousel__dot')).toHaveLength(3);
    expect(wrapper.find('.xui-carousel__arrow--prev').exists()).toBe(true);
    expect(wrapper.find('.xui-carousel__arrow--next').exists()).toBe(true);
  });

  it('loop=false 不渲染克隆位；单张不渲染箭头与指示点', () => {
    const wrapper = mountCarousel({ loop: false });
    expect(wrapper.findAll('.xui-carousel__slide')).toHaveLength(3);
    const single = mountCarousel({ items: [items[0]] });
    expect(single.findAll('.xui-carousel__slide')).toHaveLength(1);
    expect(single.find('.xui-carousel__arrow').exists()).toBe(false);
    expect(single.find('.xui-carousel__dots').exists()).toBe(false);
  });

  it('点击 next 箭头：动画位瞬时指向克隆位，收敛后回跳归一化位', async () => {
    const wrapper = mountCarousel({ autoplay: false, defaultValue: 2 });
    await wrapper.find('.xui-carousel__arrow--next').trigger('click');
    let slides = wrapper.findAll('.xui-carousel__slide');
    expect(slides[4].classes()).toContain('is-active');
    expect(slides[1].classes()).not.toContain('is-active');
    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();
    slides = wrapper.findAll('.xui-carousel__slide');
    expect(slides[1].classes()).toContain('is-active');
    expect(wrapper.findAll('.xui-carousel__dot')[0].classes()).toContain('is-active');
  });

  it('点击指示点切换到指定索引并触发事件', async () => {
    const wrapper = mountCarousel();
    await wrapper.findAll('.xui-carousel__dot')[2].trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([2]);
    expect(wrapper.emitted('update:value')?.[0]).toEqual([2]);
    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-carousel__dot')[2].classes()).toContain('is-active');
  });

  it('自动播放：挂载即启动（默认 autoplay），按 interval 前进', async () => {
    const wrapper = mount(Carousel, { props: { items } });
    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-carousel__slide')[2].classes()).toContain('is-active');
  });

  it('悬停暂停自动播放，移出恢复', async () => {
    const wrapper = mountCarousel({ autoplay: true });
    await wrapper.trigger('mouseenter');
    vi.advanceTimersByTime(6000);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-carousel__dot')[0].classes()).toContain('is-active');
    await wrapper.trigger('mouseleave');
    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-carousel__dot')[1].classes()).toContain('is-active');
  });

  it('受控模式：内部不改 value，仅回传事件；props 更新后同步', async () => {
    const wrapper = mountCarousel({ value: 1 });
    expect(wrapper.findAll('.xui-carousel__dot')[1].classes()).toContain('is-active');
    await wrapper.find('.xui-carousel__arrow--next').trigger('click');
    expect(wrapper.emitted('update:value')?.[0]).toEqual([2]);
    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();
    // props 未回写：指示点仍停留在受控值
    expect(wrapper.findAll('.xui-carousel__dot')[1].classes()).toContain('is-active');
    await wrapper.setProps({ value: 2 });
    expect(wrapper.findAll('.xui-carousel__dot')[2].classes()).toContain('is-active');
  });

  it('skewed 变体与 className / style 透传根元素', () => {
    const wrapper = mountCarousel({
      skewed: true,
      className: 'my-carousel',
      style: { height: '300px' },
    });
    const root = wrapper.find('.xui-carousel');
    expect(root.classes()).toContain('xui-carousel--skewed');
    expect(root.classes()).toContain('my-carousel');
    expect(root.attributes('style')).toContain('height: 300px');
  });

  it('命令式 API：next / goTo / stop 生效', async () => {
    const wrapper = mountCarousel({ autoplay: true });
    (wrapper.vm as unknown as { stop: () => void }).stop();
    (wrapper.vm as unknown as { goTo: (index: number) => void }).goTo(2);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-carousel__dot')[2].classes()).toContain('is-active');
    vi.advanceTimersByTime(500);
    (wrapper.vm as unknown as { next: () => void }).next();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-carousel__slide')[4].classes()).toContain('is-active');
    vi.advanceTimersByTime(6000);
    await wrapper.vm.$nextTick();
    // stop 后不再自动前进（仍停在克隆位收敛后的 0）
    expect(wrapper.findAll('.xui-carousel__dot')[0].classes()).toContain('is-active');
  });

  it('空 items 不渲染幻灯片与控件', () => {
    const wrapper = mountCarousel({ items: [] });
    expect(wrapper.findAll('.xui-carousel__slide')).toHaveLength(0);
    expect(wrapper.find('.xui-carousel__arrow').exists()).toBe(false);
    expect(wrapper.find('.xui-carousel__dots').exists()).toBe(false);
  });

  it('内置中文文案（aria-label）', () => {
    const wrapper = mountCarousel();
    expect(wrapper.find('.xui-carousel__arrow--prev').attributes('aria-label')).toBe('上一张');
    expect(wrapper.find('.xui-carousel__arrow--next').attributes('aria-label')).toBe('下一张');
    expect(wrapper.findAll('.xui-carousel__dot')[0].attributes('aria-label')).toBe('第 1 张');
    expect(wrapper.find('.xui-carousel').attributes('aria-label')).toBe('轮播图');
  });
});
