<script setup lang="ts">
import { ref } from 'vue';
import { Carousel } from '@xui-design/vue';
import type { CarouselItem } from '@xui-design/core';
import { isZh } from '../../../i18n';

const banners: CarouselItem[] = [
  {
    key: 'mountain',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wide%20banner%20photo%20of%20a%20mountain%20lake%20at%20sunrise%2C%20mist%20over%20calm%20water%2C%20warm%20gradient%20sky%2C%20minimal%20landscape%20photography&image_size=landscape_16_9',
    alt: isZh() ? '山间日出' : 'Mountain sunrise',
  },
  {
    key: 'city',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wide%20banner%20photo%20of%20modern%20city%20skyline%20at%20dusk%2C%20blue%20hour%2C%20glowing%20skyscraper%20lights&image_size=landscape_16_9',
    alt: isZh() ? '城市夜景' : 'City skyline',
  },
  {
    key: 'beach',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wide%20banner%20photo%20of%20tropical%20beach%20with%20turquoise%20sea%2C%20aerial%20drone%20view%2C%20white%20sand&image_size=landscape_16_9',
    alt: isZh() ? '热带海岛' : 'Tropical beach',
  },
];

const current = ref(0);
</script>

<template>
  <div class="demo-column">
    <Carousel
      v-model:value="current"
      :items="banners"
      style="--xui-carousel-height: 320px; --xui-carousel-slide-width: 60%"
    />
    <span class="demo-text">
      {{ isZh() ? `当前：第 ${current + 1} 张` : `Current: slide ${current + 1}` }}
    </span>
  </div>
</template>
