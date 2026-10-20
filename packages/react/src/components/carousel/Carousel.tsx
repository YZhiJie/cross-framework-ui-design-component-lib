/**
 * Carousel 轮播图（React 适配层）
 *
 * 逻辑统一在 @xui-design/shared 的 createCarouselLogic：
 * - 轨道渲染 = 首尾克隆（loop 且 ≥2 张）+ 实际项，每张幻灯片按
 *   (virtual - position) * 100% 自身宽度位移，动画进行中收敛回跳归一化位；
 * - 挂载时 play()（autoplay 开启才生效），悬停 / 页面隐藏时暂停；
 * - className / style 透传根元素，几何与配色经根节点 CSS 变量可覆盖
 *   （--xui-carousel-height / --xui-carousel-slide-width / --xui-carousel-active-scale /
 *   --xui-carousel-dim-opacity）。
 * - onChange 经 latest-ref 模式隔离，避免回调引用更新触发 effect 重跑。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import { createCarouselLogic } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import type { CarouselProps } from '@xui-design/core';
import type { CarouselLogicInstance } from '@xui-design/shared';
import type { CSSProperties, Ref } from 'react';
import { useLogicState } from '../../hooks/use-logic-state';
import { useLocaleData } from '../../hooks/use-locale';

/** 通过 ref 暴露的命令式 API（与 Vue 适配层的 CarouselRef 对齐） */
export interface CarouselRef {
  /** 切换到上一张（非循环且在首位时 no-op；动画进行中丢弃） */
  prev: () => void;
  /** 切换到下一张（非循环且在末位时 no-op；动画进行中丢弃） */
  next: () => void;
  /** 切换到指定索引（越界钳制；动画进行中丢弃） */
  goTo: (index: number) => void;
  /** 启动自动播放（autoplay 关闭 / 只有单张 / 悬停暂停中时 no-op） */
  play: () => void;
  /** 停止自动播放 */
  stop: () => void;
}

export type CarouselComponentProps = CarouselProps & { ref?: Ref<CarouselRef> };

type CarouselSlide = { key: string; virtual: number; item: CarouselProps['items'][number] };

export function Carousel(props: CarouselComponentProps) {
  const {
    items,
    value,
    defaultValue = 0,
    autoplay = true,
    interval = 3000,
    loop = true,
    duration = 500,
    showArrows = true,
    showDots = true,
    pauseOnHover = true,
    skewed = false,
    className,
    style,
    onChange,
    ref,
  } = props;

  const callbacksRef = useRef({ onChange });
  callbacksRef.current = { onChange };

  const logicRef = useRef<CarouselLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createCarouselLogic({
      items,
      value,
      defaultValue,
      autoplay,
      interval,
      loop,
      duration,
      pauseOnHover,
      onChange: (index) => callbacksRef.current.onChange?.(index),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({
      items,
      value,
      autoplay,
      interval,
      loop,
      duration,
      pauseOnHover,
    });
  }, [logic, items, value, autoplay, interval, loop, duration, pauseOnHover]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      prev: () => logic.prev(),
      next: () => logic.next(),
      goTo: (index: number) => logic.goTo(index),
      play: () => logic.play(),
      stop: () => logic.stop(),
    }),
    [logic],
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logic.stop();
      } else {
        logic.play();
      }
    };
    logic.play();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      logic.destroy();
    };
  }, [logic]);

  const locale = useLocaleData();

  /** 渲染列表：首尾克隆（loop 且 ≥2 张）+ 实际项，virtual 为轨道虚拟位 */
  const slides: CarouselSlide[] = [];
  if (items.length > 0) {
    if (loop && items.length >= 2) {
      slides.push({
        key: `__xui_clone_head_${items[items.length - 1].key}`,
        virtual: -1,
        item: items[items.length - 1],
      });
    }
    items.forEach((item, index) => {
      slides.push({ key: item.key, virtual: index, item });
    });
    if (loop && items.length >= 2) {
      slides.push({
        key: `__xui_clone_tail_${items[0].key}`,
        virtual: items.length,
        item: items[0],
      });
    }
  }

  const getSlideStyle = (virtual: number): CSSProperties =>
    ({
      '--xui-carousel-tx': `${(virtual - state.position) * 100}%`,
      transition: state.animate
        ? `transform ${duration}ms ease, opacity ${duration}ms ease`
        : 'none',
    }) as CSSProperties;

  return (
    <div
      className={['xui-carousel', skewed ? 'xui-carousel--skewed' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      role="region"
      aria-roledescription="carousel"
      aria-label={locale.carousel.region}
      onMouseEnter={() => logic.setHovered(true)}
      onMouseLeave={() => logic.setHovered(false)}
    >
      {slides.map((slide) => (
        <div
          key={slide.key}
          className={`xui-carousel__slide${slide.virtual === state.position ? ' is-active' : ''}`}
          style={getSlideStyle(slide.virtual)}
          aria-hidden={slide.virtual !== state.position || undefined}
        >
          <div className="xui-carousel__slide-body">
            <div className="xui-carousel__slide-clip">
              <img
                className="xui-carousel__image"
                src={slide.item.image}
                alt={slide.item.alt}
                draggable={false}
              />
            </div>
          </div>
        </div>
      ))}
      {showArrows && items.length > 1 && (
        <>
          <button
            type="button"
            className="xui-carousel__arrow xui-carousel__arrow--prev"
            aria-label={locale.carousel.prev}
            onClick={() => logic.prev()}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: icons['arrow-left'] ?? '' }}
            />
          </button>
          <button
            type="button"
            className="xui-carousel__arrow xui-carousel__arrow--next"
            aria-label={locale.carousel.next}
            onClick={() => logic.next()}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: icons['arrow-right'] ?? '' }}
            />
          </button>
        </>
      )}
      {showDots && items.length > 1 && (
        <div className="xui-carousel__dots">
          {items.map((item, index) => (
            <button
              key={item.key}
              type="button"
              className={`xui-carousel__dot${index === state.value ? ' is-active' : ''}`}
              aria-label={locale.carousel.goTo(index + 1)}
              aria-current={index === state.value || undefined}
              onClick={() => logic.goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
