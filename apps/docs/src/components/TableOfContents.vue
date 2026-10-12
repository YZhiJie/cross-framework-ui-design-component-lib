<script setup lang="ts">
/**
 * 章节锚点目录（Table of Contents）
 *
 * 自动扫描当前页面内的 h2.docs-section-title 元素，生成固定在内容区右侧的锚点目录：
 * - 点击锚点平滑滚动到对应章节
 * - IntersectionObserver 监听当前可见章节并高亮
 * - 路由切换后重新扫描（nextTick）
 * - 视口宽度不足时自动隐藏（不遮挡内容）
 */
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

interface TocItem {
  id: string;
  text: string;
}

const route = useRoute();
const items = ref<TocItem[]>([]);
const activeId = ref<string>('');

let observer: IntersectionObserver | null = null;

/** 扫描页面内的 h2.docs-section-title，提取文本并补充 id */
const scan = () => {
  const headings = Array.from(
    document.querySelectorAll<HTMLHeadingElement>('h2.docs-section-title'),
  );
  items.value = headings.map((heading, index) => {
    if (!heading.id) {
      heading.id = `toc-section-${index}`;
    }
    return { id: heading.id, text: heading.textContent?.trim() ?? '' };
  });

  // 重建观察器
  if (observer) {
    observer.disconnect();
  }
  if (headings.length === 0) {
    activeId.value = '';
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      // 取第一个 intersecting 的条目作为当前章节
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) {
        activeId.value = (visible.target as HTMLElement).id;
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
  );

  headings.forEach((heading) => observer!.observe(heading));
};

/** 点击锚点：平滑滚动到对应章节 */
const scrollTo = (id: string) => {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted(() => {
  nextTick(scan);
});

onUnmounted(() => {
  observer?.disconnect();
});

// 路由切换后重新扫描（等待页面渲染完成）
watch(
  () => route.fullPath,
  () => nextTick(scan),
);
</script>

<template>
  <nav v-if="items.length > 0" class="docs-toc" aria-label="页面目录">
    <div class="docs-toc__title">目录</div>
    <ul class="docs-toc__list">
      <li
        v-for="item in items"
        :key="item.id"
        class="docs-toc__item"
        :class="{ 'is-active': activeId === item.id }"
      >
        <a :href="`#${item.id}`" @click.prevent="scrollTo(item.id)">{{ item.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.docs-toc {
  position: fixed;
  top: 120px;
  right: 24px;
  width: 200px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding: 12px 0;
  font-size: 13px;
}

.docs-toc__title {
  padding: 0 12px 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--docs-text-tertiary);
}

.docs-toc__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.docs-toc__item {
  position: relative;
  padding: 0;
}

.docs-toc__item a {
  display: block;
  padding: 5px 12px;
  color: var(--docs-text-secondary);
  line-height: 1.5;
  border-left: 2px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s;
}

.docs-toc__item a:hover {
  color: var(--docs-primary);
}

.docs-toc__item.is-active a {
  color: var(--docs-primary);
  border-left-color: var(--docs-primary);
  font-weight: 500;
}

/* 视口宽度不足时隐藏（避免遮挡正文） */
@media (width <= 1400px) {
  .docs-toc {
    display: none;
  }
}
</style>
