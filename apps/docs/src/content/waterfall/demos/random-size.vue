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

const COUNT = 18;

/** 生成宽高完全随机的图片数据 */
function createRandomItems(): ImageItem[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const width = 200 + Math.floor(Math.random() * 440); // 200 ~ 640
    const height = 200 + Math.floor(Math.random() * 600); // 200 ~ 800
    const seed = `random-size-${Date.now()}-${i}`;
    return {
      id: i,
      url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      width,
      height,
      title: `图片 ${i + 1}`,
    };
  });
}

const items = ref<ImageItem[]>(createRandomItems());
// 按图片 id 记录加载状态，用于控制骨架屏 / 图片淡入
const loadedIds = ref<Set<number>>(new Set());

function onImageLoaded(id: number) {
  loadedIds.value = new Set(loadedIds.value).add(id);
}

function refresh() {
  loadedIds.value = new Set();
  items.value = createRandomItems();
}
</script>

<template>
  <div class="random-size-demo">
    <div class="toolbar">
      <p class="tip">💡 每张图片的宽高都在 200~800px 之间随机生成，瀑布流按最短列自动排布</p>
      <button class="refresh-btn" type="button" @click="refresh">换一批</button>
    </div>

    <Waterfall :items="items" row-key="id" :columns="3" :gutter="12">
      <template #item="{ item }">
        <div v-if="item" class="img-card">
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
          <div class="img-card__caption">
            <span>{{ (item as ImageItem).title }}</span>
            <span class="img-card__size">
              {{ (item as ImageItem).width }}×{{ (item as ImageItem).height }}
            </span>
          </div>
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<style scoped>
.random-size-demo {
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

.refresh-btn {
  flex: none;
  padding: 4px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  color: #555;
  font-size: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}
.refresh-btn:hover {
  border-color: #888;
  color: #222;
}

.img-card {
  width: 100%;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  font-size: 12px;
  color: #555;
  background: #fff;
}
.img-card__size {
  color: #aaa;
  font-size: 11px;
}
</style>
