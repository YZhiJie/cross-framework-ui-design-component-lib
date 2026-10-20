<script setup lang="ts">
/**
 * Carousel 轮播图（Vue 适配层）
 *
 * 逻辑统一在 @xui-design/shared 的 createCarouselLogic：
 * - 轨道渲染 = 首尾克隆（loop 且 ≥2 张）+ 实际项，每张幻灯片按
 *   (virtual - position) * 100% 自身宽度位移，动画进行中收敛回跳归一化位；
 * - 挂载时 play()（autoplay 开启才生效），悬停 / 页面隐藏时暂停；
 * - className / style 透传根元素，几何与配色经根节点 CSS 变量可覆盖
 *   （--xui-carousel-height / --xui-carousel-slide-width / --xui-carousel-active-scale /
 *   --xui-carousel-dim-opacity）。
 */
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { createCarouselLogic } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import type { CarouselProps } from '@xui-design/core';
import { useLocaleData } from '../../hooks/use-locale';

const props = withDefaults(defineProps<Omit<CarouselProps, 'onChange'>>(), {
  value: undefined,
  defaultValue: 0,
  autoplay: true,
  interval: 3000,
  loop: true,
  duration: 500,
  showArrows: true,
  showDots: true,
  pauseOnHover: true,
  skewed: false,
});

const emit = defineEmits<{
  change: [index: number];
  'update:value': [index: number];
}>();

const locale = useLocaleData();

const logic = createCarouselLogic({
  items: props.items,
  value: props.value,
  defaultValue: props.defaultValue,
  autoplay: props.autoplay,
  interval: props.interval,
  loop: props.loop,
  duration: props.duration,
  pauseOnHover: props.pauseOnHover,
  onChange: (index) => {
    emit('change', index);
    emit('update:value', index);
  },
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

const handleVisibilityChange = () => {
  if (document.visibilityState === 'hidden') {
    logic.stop();
  } else {
    logic.play();
  }
};

onMounted(() => {
  logic.play();
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  unsubscribe();
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  logic.destroy();
});

watchEffect(() => {
  logic.updateOptions({
    items: props.items,
    value: props.value,
    autoplay: props.autoplay,
    interval: props.interval,
    loop: props.loop,
    duration: props.duration,
    pauseOnHover: props.pauseOnHover,
  });
});

type CarouselSlide = { key: string; virtual: number; item: CarouselProps['items'][number] };

/** 渲染列表：首尾克隆（loop 且 ≥2 张）+ 实际项，virtual 为轨道虚拟位 */
const slides = computed<CarouselSlide[]>(() => {
  const list: CarouselSlide[] = [];
  const source = props.items;
  if (source.length === 0) return list;
  if (props.loop && source.length >= 2) {
    list.push({
      key: `__xui_clone_head_${source[source.length - 1].key}`,
      virtual: -1,
      item: source[source.length - 1],
    });
  }
  source.forEach((item, index) => {
    list.push({ key: item.key, virtual: index, item });
  });
  if (props.loop && source.length >= 2) {
    list.push({
      key: `__xui_clone_tail_${source[0].key}`,
      virtual: source.length,
      item: source[0],
    });
  }
  return list;
});

const getSlideStyle = (virtual: number) => ({
  '--xui-carousel-tx': `${(virtual - state.value.position) * 100}%`,
  transition: state.value.animate
    ? `transform ${props.duration}ms ease, opacity ${props.duration}ms ease`
    : 'none',
});

defineExpose({
  prev: () => logic.prev(),
  next: () => logic.next(),
  goTo: (index: number) => logic.goTo(index),
  play: () => logic.play(),
  stop: () => logic.stop(),
});
</script>

<template>
  <div
    :class="[className, 'xui-carousel', { 'xui-carousel--skewed': skewed }]"
    :style="style"
    role="region"
    aria-roledescription="carousel"
    :aria-label="locale.carousel.region"
    @mouseenter="logic.setHovered(true)"
    @mouseleave="logic.setHovered(false)"
  >
    <div
      v-for="slide in slides"
      :key="slide.key"
      class="xui-carousel__slide"
      :class="{ 'is-active': slide.virtual === state.position }"
      :style="getSlideStyle(slide.virtual)"
      :aria-hidden="slide.virtual !== state.position || undefined"
    >
      <div class="xui-carousel__slide-body">
        <div class="xui-carousel__slide-clip">
          <img
            class="xui-carousel__image"
            :src="slide.item.image"
            :alt="slide.item.alt"
            draggable="false"
          />
        </div>
      </div>
    </div>
    <template v-if="showArrows && items.length > 1">
      <button
        type="button"
        class="xui-carousel__arrow xui-carousel__arrow--prev"
        :aria-label="locale.carousel.prev"
        @click="logic.prev()"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-html="icons['arrow-left']"
        />
      </button>
      <button
        type="button"
        class="xui-carousel__arrow xui-carousel__arrow--next"
        :aria-label="locale.carousel.next"
        @click="logic.next()"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-html="icons['arrow-right']"
        />
      </button>
    </template>
    <div v-if="showDots && items.length > 1" class="xui-carousel__dots">
      <button
        v-for="(item, index) in items"
        :key="item.key"
        type="button"
        class="xui-carousel__dot"
        :class="{ 'is-active': index === state.value }"
        :aria-label="locale.carousel.goTo(index + 1)"
        :aria-current="index === state.value || undefined"
        @click="logic.goTo(index)"
      />
    </div>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
