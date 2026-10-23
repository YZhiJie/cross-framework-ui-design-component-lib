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

const PAGE_SIZE = 8;
const MAX_PAGES = 4;
let pageCounter = 0;

const breakpoints = [
  { minWidth: 0, columns: 2 },
  { minWidth: 560, columns: 3 },
  { minWidth: 880, columns: 4 },
];

// 服务端返回的图片尺寸各不相同（宽、高都随机），用于演示不等高重排
const WIDTH_POOL = [320, 400, 480, 560];

/** 模拟从服务端拉取一页不同尺寸的图片 */
function mockFetchImages(page: number): Promise<ImageItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items: ImageItem[] = Array.from({ length: PAGE_SIZE }, (_, i) => {
        const seed = (page - 1) * PAGE_SIZE + i + 1;
        const width = WIDTH_POOL[seed % WIDTH_POOL.length];
        const height = Math.round(width * (0.6 + Math.random() * 1.1));
        return {
          id: seed,
          url: `https://picsum.photos/seed/responsive-waterfall-${seed}/${width}/${height}`,
          width,
          height,
          title: `图片 ${seed}`,
        };
      });
      resolve(items);
    }, 600); // 模拟网络耗时
  });
}

const items = ref<ImageItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const columnCount = ref(breakpoints[0].columns);
// 按图片 id 记录加载状态，用于控制骨架屏 / 图片淡入
const loadedIds = ref<Set<number>>(new Set());

function onImageLoaded(id: number) {
  loadedIds.value = new Set(loadedIds.value).add(id);
}

function onLayoutChange(payload: { columnCount: number; columnHeights: number[] }) {
  columnCount.value = payload.columnCount;
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
  <div class="responsive-server-demo">
    <div class="toolbar">
      <p class="tip">
        💡 服务端分页返回不同宽高的图片，滚动触底继续加载；拖动窗口宽度观察断点自动切换列数
      </p>
      <span class="badge">当前列数 {{ columnCount }}</span>
    </div>

    <Waterfall
      :items="items"
      row-key="id"
      :breakpoints="breakpoints"
      :gutter="12"
      :height="420"
      :loading="loading"
      :finished="finished"
      @load-more="loadMore"
      @layout-change="onLayoutChange"
    >
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
.responsive-server-demo {
  position: relative;
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
