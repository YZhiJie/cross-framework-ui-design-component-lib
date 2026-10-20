/**
 * Carousel 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createCarouselLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createCarouselLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { CarouselEvents, CarouselLogic, CarouselProps, CarouselSlots } from './types';

export const carouselSpec = {
  name: 'Carousel',
  props: {
    type: {
      items: Array,
      value: Number,
      defaultValue: Number,
      autoplay: Boolean,
      interval: Number,
      loop: Boolean,
      duration: Number,
      showArrows: Boolean,
      showDots: Boolean,
      pauseOnHover: Boolean,
      skewed: Boolean,
      className: String,
      style: Object,
      onChange: Function,
    },
    defaults: {
      defaultValue: 0,
      autoplay: true,
      interval: 3000,
      loop: true,
      duration: 500,
      showArrows: true,
      showDots: true,
      pauseOnHover: true,
      skewed: false,
    },
  },
  events: {
    change: {
      description: '当前索引变更时触发（箭头 / 指示点 / 命令式 API / 自动播放）',
      payloadType: 'number',
    },
  },
  slots: {},
  useLogic: (props: CarouselProps) =>
    createCarouselLogic({
      items: props.items,
      value: props.value,
      defaultValue: props.defaultValue,
      autoplay: props.autoplay,
      interval: props.interval,
      loop: props.loop,
      duration: props.duration,
      pauseOnHover: props.pauseOnHover,
      onChange: props.onChange,
    }),
} satisfies ComponentSpec<CarouselProps, CarouselEvents, CarouselSlots, CarouselLogic>;
