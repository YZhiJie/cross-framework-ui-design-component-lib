<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Waterfall } from '@xui-design/vue';

type ImageItem = {
  id: number;
  url: string;
  width: number;
  height: number;
  title: string;
};

const PAGE_SIZE = 10;
const MAX_PAGES = 4;
let pageCounter = 0;

/** 模拟从服务端拉取一页图片 */
function mockFetchImages(page: number): Promise<ImageItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items: ImageItem[] = Array.from({ length: PAGE_SIZE }, (_, i) => {
        const w = 400;
        const h = 200 + Math.floor(Math.random() * 300); // 随机高度，产生瀑布流错落
        const seed = page * PAGE_SIZE + i + 1;
        return {
          id: seed,
          // picsum.photos 支持 seed，保证同一张图在多次渲染时稳定显示
          url: `https://picsum.photos/seed/waterfall-${seed}/${w}/${h}`,
          width: w,
          height: h,
          title: `图片 ${seed}`,
        };
      });
      resolve(items);
    }, 700); // 模拟网络耗时
  });
}

const items = ref<ImageItem[]>([]);
const loading = ref(false);
const finished = ref(false);
// 按图片 id 记录加载状态，用于控制骨架屏 / 图片淡入
const loadedIds = ref<Set<number>>(new Set());

function onImageLoaded(id: number) {
  loadedIds.value = new Set(loadedIds.value).add(id);
}

async function loadMore() {
  if (loading.value || finished.value) return;
  loading.value = true;
  try {
    pageCounter += 1;
    const newItems = await mockFetchImages(pageCounter);
    items.value = [...items.value, ...newItems];
    if (pageCounter >= MAX_PAGES) finished.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadMore();
});
</script>

<template>
  <div class="server-demo">
    <p class="tip">
      💡 滚动容器触底会触发 loadMore，从"服务端"拉取下一批图片；图片加载完成后瀑布流自动重排
    </p>

    <Waterfall
      :items="items"
      row-key="id"
      :columns="3"
      :gutter="12"
      :height="420"
      :loading="loading"
      :finished="finished"
      @load-more="loadMore"
    >
      <template #item="{ item }">
        <div v-if="item" class="img-card">
          <!-- 用 aspect-ratio 按图片真实宽高占位，避免加载前布局跳动 -->
          <div
            class="img-card__media"
            :style="{ aspectRatio: `${(item as ImageItem).width} / ${(item as ImageItem).height}` }"
          >
            <!-- 加载前的 shimmer 占位 -->
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

      <template #empty>
        <div class="empty-state">加载中...</div>
      </template>
    </Waterfall>

    <div class="footer-state" v-if="finished">已加载全部 {{ MAX_PAGES * PAGE_SIZE }} 张图片</div>
    <div class="footer-state loading-indicator" v-else-if="loading">
      <span class="spinner" /> 加载中...
    </div>
  </div>
</template>

<style scoped>
.server-demo {
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
}

.tip {
  color: #888;
  font-size: 12px;
  margin: 0 0 12px 0;
  line-height: 1.5;
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
/* 加载前的 shimmer 骨架屏 */
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

.empty-state {
  padding: 32px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.footer-state {
  text-align: center;
  padding: 10px 0 4px;
  font-size: 12px;
  color: #aaa;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #ddd;
  border-top-color: #888;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
