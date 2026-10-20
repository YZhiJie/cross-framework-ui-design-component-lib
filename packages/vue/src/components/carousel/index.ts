export type { CarouselProps } from '@xui-design/core';

export { default as Carousel } from './Carousel.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 CarouselRef 对齐） */
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
