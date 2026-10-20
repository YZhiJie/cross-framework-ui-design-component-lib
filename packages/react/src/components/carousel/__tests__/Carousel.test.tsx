import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { Carousel } from '../Carousel';
import type { CarouselRef } from '../Carousel';
import type { CarouselItem } from '@xui-design/core';

const items: CarouselItem[] = [
  { key: 'a', image: '/a.jpg', alt: 'A' },
  { key: 'b', image: '/b.jpg', alt: 'B' },
  { key: 'c', image: '/c.jpg', alt: 'C' },
];

const renderCarousel = (props: Record<string, unknown> = {}) =>
  render(<Carousel items={items} autoplay={false} {...props} />);

describe('Carousel (React)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('基础渲染：首尾克隆 + 实际项，第二张（virtual 0）为激活态', () => {
    const { container } = renderCarousel();
    const slides = container.querySelectorAll('.xui-carousel__slide');
    expect(slides).toHaveLength(5);
    expect(slides[1].className).toContain('is-active');
    expect(container.querySelectorAll('.xui-carousel__dot')).toHaveLength(3);
    expect(container.querySelector('.xui-carousel__arrow--prev')).not.toBeNull();
    expect(container.querySelector('.xui-carousel__arrow--next')).not.toBeNull();
  });

  it('loop=false 不渲染克隆位；单张不渲染箭头与指示点', () => {
    const { container } = renderCarousel({ loop: false });
    expect(container.querySelectorAll('.xui-carousel__slide')).toHaveLength(3);
    const { container: single } = renderCarousel({ items: [items[0]] });
    expect(single.querySelectorAll('.xui-carousel__slide')).toHaveLength(1);
    expect(single.querySelector('.xui-carousel__arrow')).toBeNull();
    expect(single.querySelector('.xui-carousel__dots')).toBeNull();
  });

  it('点击 next 箭头：动画位瞬时指向克隆位，收敛后回跳归一化位', () => {
    const { container } = renderCarousel({ defaultValue: 2 });
    fireEvent.click(container.querySelector('.xui-carousel__arrow--next')!);
    let slides = container.querySelectorAll('.xui-carousel__slide');
    expect(slides[4].className).toContain('is-active');
    act(() => {
      vi.advanceTimersByTime(500);
    });
    slides = container.querySelectorAll('.xui-carousel__slide');
    expect(slides[1].className).toContain('is-active');
    expect(container.querySelectorAll('.xui-carousel__dot')[0].className).toContain('is-active');
  });

  it('点击指示点切换到指定索引并触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = renderCarousel({ onChange });
    fireEvent.click(container.querySelectorAll('.xui-carousel__dot')[2]);
    expect(onChange).toHaveBeenCalledWith(2);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(container.querySelectorAll('.xui-carousel__dot')[2].className).toContain('is-active');
  });

  it('自动播放：挂载即启动（默认 autoplay），按 interval 前进', () => {
    const { container } = render(<Carousel items={items} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(container.querySelectorAll('.xui-carousel__slide')[2].className).toContain('is-active');
  });

  it('悬停暂停自动播放，移出恢复', () => {
    const { container } = renderCarousel({ autoplay: true });
    const root = container.firstElementChild!;
    fireEvent.mouseEnter(root);
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(container.querySelectorAll('.xui-carousel__dot')[0].className).toContain('is-active');
    fireEvent.mouseLeave(root);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(container.querySelectorAll('.xui-carousel__dot')[1].className).toContain('is-active');
  });

  it('受控模式：内部不改 value，仅回调 onChange；props 更新后同步', () => {
    const { container, rerender } = renderCarousel({ value: 1 });
    expect(container.querySelectorAll('.xui-carousel__dot')[1].className).toContain('is-active');
    const onChange = vi.fn();
    rerender(<Carousel items={items} autoplay={false} value={1} onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-carousel__arrow--next')!);
    expect(onChange).toHaveBeenCalledWith(2);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    // props 未回写：指示点仍停留在受控值
    expect(container.querySelectorAll('.xui-carousel__dot')[1].className).toContain('is-active');
    rerender(<Carousel items={items} autoplay={false} value={2} />);
    expect(container.querySelectorAll('.xui-carousel__dot')[2].className).toContain('is-active');
  });

  it('skewed 变体与 className / style 透传根元素', () => {
    const { container } = renderCarousel({
      skewed: true,
      className: 'my-carousel',
      style: { height: '300px' },
    });
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('xui-carousel--skewed');
    expect(root.className).toContain('my-carousel');
    expect(root.getAttribute('style')).toContain('height: 300px');
  });

  it('命令式 API：next / goTo / stop 生效', () => {
    const ref = createRef<CarouselRef>();
    const { container } = renderCarousel({ autoplay: true, ref });
    ref.current!.stop();
    act(() => {
      ref.current!.goTo(2);
    });
    expect(container.querySelectorAll('.xui-carousel__dot')[2].className).toContain('is-active');
    act(() => {
      vi.advanceTimersByTime(500);
    });
    act(() => {
      ref.current!.next();
    });
    expect(container.querySelectorAll('.xui-carousel__slide')[4].className).toContain('is-active');
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    // stop 后不再自动前进（仍停在克隆位收敛后的 0）
    expect(container.querySelectorAll('.xui-carousel__dot')[0].className).toContain('is-active');
  });

  it('空 items 不渲染幻灯片与控件', () => {
    const { container } = renderCarousel({ items: [] });
    expect(container.querySelectorAll('.xui-carousel__slide')).toHaveLength(0);
    expect(container.querySelector('.xui-carousel__arrow')).toBeNull();
    expect(container.querySelector('.xui-carousel__dots')).toBeNull();
  });

  it('内置中文文案（aria-label）', () => {
    const { container } = renderCarousel();
    expect(container.querySelector('.xui-carousel__arrow--prev')!.getAttribute('aria-label')).toBe(
      '上一张',
    );
    expect(container.querySelector('.xui-carousel__arrow--next')!.getAttribute('aria-label')).toBe(
      '下一张',
    );
    expect(container.querySelectorAll('.xui-carousel__dot')[0].getAttribute('aria-label')).toBe(
      '第 1 张',
    );
    expect((container.firstElementChild as HTMLElement).getAttribute('aria-label')).toBe('轮播图');
  });
});
