<script setup lang="ts">
/**
 * 章节锚点目录（Table of Contents）
 *
 * 自动扫描当前页面内的标题元素生成固定在内容区右侧的锚点目录：
 * - 一级：h2.docs-section-title 章节标题
 * - 二级：章节内的 h3 子标题（docs-subsection-title / demo-block__title），
 *   缩进渲染、同样支持点击滚动与滚动激活
 * - 点击锚点：立即激活 + 平滑滚动到对应章节
 * - 滚动/resize 时用 getBoundingClientRect 判断激活线之上的最后一个标题
 * - 路由切换后重新扫描（nextTick）
 * - 视口宽度不足时自动隐藏（不遮挡内容）
 *
 * 不使用 IntersectionObserver：其 rootMargin 空窗期会导致章节间过渡时激活态丢失。
 */
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUiMessages } from '../i18n/ui-messages';
import { docsLocale } from '../i18n';

interface TocItem {
  id: string;
  text: string;
  /** 2 = 章节标题（h2），3 = 章节内子标题（h3） */
  level: 2 | 3;
}

const route = useRoute();
const ui = useUiMessages();
const items = ref<TocItem[]>([]);
const activeId = ref<string>('');

/** 激活线：标题顶部越过此线（距视口顶 px）即视为已进入当前章节 */
const TRIGGER_OFFSET = 100;
/** 贴底容差：smooth 滚动残差 / 弹性滚动余量，避免末项漏激活 */
const BOTTOM_TOLERANCE = 32;
let ticking = false;
/** 点击触发的 smooth 滚动锁：期间不覆盖 activeId（避免中途状态抢回激活） */
let scrollLock = false;
let scrollTimer: ReturnType<typeof setTimeout> | null = null;

/** 扫描页面内的 h2 章节与其下属 h3 子标题，按 DOM 顺序提取文本并补充 id */
const scan = () => {
  const headings = Array.from(
    document.querySelectorAll<HTMLHeadingElement>(
      'h2.docs-section-title, h3.docs-subsection-title, h3.demo-block__title',
    ),
  );
  const list: TocItem[] = [];
  let counter = 0;
  let currentH2Id = '';
  for (const heading of headings) {
    if (!heading.id) {
      heading.id = `toc-heading-${counter++}`;
    }
    const text = heading.textContent?.trim() ?? '';
    if (heading.tagName === 'H2') {
      currentH2Id = heading.id;
      list.push({ id: heading.id, text, level: 2 });
    } else if (currentH2Id) {
      // 仅收录归属于某个 h2 章节之下的 h3（避免首页等无章节页面的游离标题）
      list.push({ id: heading.id, text, level: 3 });
    }
  }
  items.value = list;
  updateActive();
};

/** 依据各标题相对视口位置确定当前激活章节 */
const updateActive = () => {
  if (items.value.length === 0) {
    activeId.value = '';
    return;
  }
  // 已贴近页面底部 → 强制激活最后一项
  // （末尾章节内容较短时，其标题顶部够不到激活线，否则永远停留在上一项）
  const reachedBottom =
    window.scrollY + window.innerHeight + BOTTOM_TOLERANCE >= document.documentElement.scrollHeight;
  if (reachedBottom) {
    activeId.value = items.value[items.value.length - 1].id;
    return;
  }
  let current = '';
  for (const item of items.value) {
    const el = document.getElementById(item.id);
    if (!el) continue;
    // 标题顶部越过激活线 → 取最后一个满足条件的（滚动到章中部仍属该章）
    if (el.getBoundingClientRect().top <= TRIGGER_OFFSET) {
      current = item.id;
    } else {
      break; // 后续标题都在激活线下方，提前结束
    }
  }
  // 页面顶部：所有标题都在激活线下方时激活首项
  if (!current) current = items.value[0].id;
  activeId.value = current;
};

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    // 点击触发的 smooth 滚动期间锁定，不被中途状态覆盖
    if (scrollLock) return;
    updateActive();
  });
};

/** 点击锚点：立即激活 + 平滑滚动（smooth 期间锁定，结束后校准一次） */
const scrollTo = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  activeId.value = id;
  scrollLock = true;
  if (scrollTimer) clearTimeout(scrollTimer);
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // smooth 滚动结束后解锁并校准（应对末项贴底：scroll 事件最后一帧可能未贴底）
  scrollTimer = setTimeout(() => {
    scrollLock = false;
    scrollTimer = null;
    updateActive();
  }, 700);
};

onMounted(() => {
  nextTick(scan);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  if (scrollTimer) clearTimeout(scrollTimer);
});

// 路由切换后重新扫描（等待页面渲染完成）
watch(
  () => route.fullPath,
  () => nextTick(scan),
);

// 语言切换后章节标题文本变化，重新扫描目录
watch(
  () => docsLocale.locale,
  () => nextTick(scan),
);
</script>

<template>
  <nav v-if="items.length > 0" class="docs-toc" aria-label="页面目录">
    <div class="docs-toc__title">{{ ui.toc.title }}</div>
    <ul class="docs-toc__list">
      <li
        v-for="item in items"
        :key="item.id"
        class="docs-toc__item"
        :class="{ 'is-active': activeId === item.id, 'is-sub': item.level === 3 }"
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

/* 二级条目：缩进 + 弱化字号，形成层级感 */
.docs-toc__item.is-sub a {
  padding-left: 26px;
  font-size: 12px;
  color: var(--docs-text-tertiary);
}

.docs-toc__item.is-sub a:hover {
  color: var(--docs-primary);
}

.docs-toc__item.is-sub.is-active a {
  color: var(--docs-primary);
  font-weight: 500;
}

/* 视口宽度不足时隐藏（避免遮挡正文） */
@media (width <= 1400px) {
  .docs-toc {
    display: none;
  }
}
</style>
