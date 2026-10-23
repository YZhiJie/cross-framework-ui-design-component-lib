<script setup lang="ts">
import { ref } from 'vue';
import { Waterfall } from '@xui-design/vue';

type ImageItem = {
  id: number;
  url: string;
  width: number;
  height: number;
  title: string;
};

/** 生成一组宽度、高度都不同的图片数据（宽度即卡片实际宽度） */
function createItems(): ImageItem[] {
  return Array.from({ length: 20 }, (_, i) => {
    const width = 140 + Math.floor(Math.random() * 60); // 140 ~ 200
    const height = Math.round(width * (0.6 + Math.random() * 0.4)); // 高宽比 0.6 ~ 1.0
    const seed = `horizontal-waterfall-${i + 1}`;
    return {
      id: i,
      url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      width,
      height,
      title: `图片 ${i + 1}`,
    };
  });
}

const items = ref<ImageItem[]>(createItems());
// 按图片 id 记录加载状态，用于控制骨架屏 / 图片淡入
const loadedIds = ref<Set<number>>(new Set());

function onImageLoaded(id: number) {
  loadedIds.value = new Set(loadedIds.value).add(id);
}
</script>

<template>
  <div class="horizontal-demo">
    <div class="toolbar">
      <p class="tip">
        💡 卡片按最短行分配，行内自左向右排列；内容超出宽度后容器横向滚动（共 2 行）
      </p>
      <span class="badge">← 左右滚动 →</span>
    </div>

    <Waterfall
      :items="items"
      row-key="id"
      direction="horizontal"
      :rows="2"
      :gutter="12"
      :height="480"
    >
      <template #item="{ item }">
        <div v-if="item" class="img-card" :style="{ width: `${(item as ImageItem).width}px` }">
          <!-- 用 aspect-ratio 按图片真实宽高占位，避免加载前布局跳动 -->
          <div
            class="img-card__media"
            :style="{ aspectRatio: `${(item as ImageItem).width} / ${(item as ImageItem).height}` }"
          >
            <div v-if="!loadedIds.has((item as ImageItem).id)" class="img-card__skeleton" />
            <img
              :src="(item as ImageItem).url"
              :alt="(item as ImageItem).title"
              loading="lazy"
              class="img-card__image"
              :class="{ 'is-loaded': loadedIds.has((item as ImageItem).id) }"
              @load="onImageLoaded((item as ImageItem).id)"
            />
          </div>
          <div class="img-card__caption">{{ (item as ImageItem).title }}</div>
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<style scoped>
.horizontal-demo {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
}

.toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.tip {
  color: #888;
  font-size: 12px;
  margin: 0;
  line-height: 1.5;
}

.badge {
  flex: none;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f2f3f5;
  color: #666;
  font-size: 12px;
  white-space: nowrap;
}

.img-card {
  flex: none;
  border-radius: 8px;
  overflow: hidden;
  background: #f6f6f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s ease;
  cursor: pointer;
}
.img-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.img-card__media {
  position: relative;
  width: 100%;
  background: #eee;
  overflow: hidden;
}

.img-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.img-card__image.is-loaded {
  opacity: 1;
}

.img-card__skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.img-card__caption {
  padding: 6px 10px;
  font-size: 12px;
  color: #555;
  background: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
