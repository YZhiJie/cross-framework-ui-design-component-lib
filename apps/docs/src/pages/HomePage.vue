<script setup lang="ts">
/**
 * 文档首页：项目介绍 / 特性 / 安装与快速开始 / 24 组件总览
 */
import { computed, ref } from 'vue';
import CodeBlock from '../components/CodeBlock.vue';
import type { ComponentEntry } from '../content/types';
import { COMPONENT_LIST, componentMetas, getComponentsByCategory } from '../content/registry';

const framework = ref<'vue' | 'react'>('vue');

// 预分组，避免模板内联 filter 丢失回调参数类型
const componentGroups = getComponentsByCategory().map((group) => ({
  ...group,
  availableList: group.components.filter((item: ComponentEntry) => item.available),
  pendingList: group.components.filter((item: ComponentEntry) => !item.available),
}));
const availableCount = componentMetas.length;

const features = [
  {
    title: '单一契约 @xui/core',
    desc: 'ComponentSpec 是双端唯一合同，Props / Events / Slots 由契约层定义，适配层不得新增分歧。',
  },
  {
    title: 'Vue / React 双端同构',
    desc: '同名组件、同 API 口径：Vue 事件 ↔ React 回调、Vue 插槽 ↔ React renderXxx 一一映射。',
  },
  {
    title: '样式单一来源',
    desc: '@xui/styles 统一输出 BEM 类名与 CSS 变量主题，双端零样式漂移。',
  },
  {
    title: '核心逻辑单份实现',
    desc: '@xui/shared 承载状态与交互逻辑，双端只做薄适配；TypeScript 严格模式全量类型贯通。',
  },
];

const installCode = computed(() =>
  framework.value === 'vue'
    ? `pnpm add @xui/vue

# 如需直接引用契约类型（TableColumn 等），再安装类型包
pnpm add @xui/core

# 应用入口引入一次样式
# main.ts:  import '@xui/styles'`
    : `pnpm add @xui/react

# 如需直接引用契约类型（TableColumn 等），再安装类型包
pnpm add @xui/core

# 应用入口引入一次样式
# main.tsx: import '@xui/styles'`,
);

// 三段拼接出 script 元素的闭合标签：SFC 解析器会按字面序列截断 script 块，
// 因此示例源码字符串里（含注释）都不能直接出现该序列
const SCRIPT_CLOSE_TAG = '<' + '/script' + '>';

const quickStartCode = computed(() =>
  framework.value === 'vue'
    ? `<script setup lang="ts">
import { Button } from '@xui/vue';
import '@xui/styles';
${SCRIPT_CLOSE_TAG}

<template>
  <Button type="primary">Hello XUI</Button>
</template>`
    : `import { Button } from '@xui/react';
import '@xui/styles';

export default function App() {
  return (
    <Button type="primary">Hello XUI</Button>
  );
}`,
);

const summaryOf = (slug: string) =>
  componentMetas.find((meta) => meta.slug === slug)?.summary ?? '';
</script>

<template>
  <div class="docs-content">
    <header class="home-hero">
      <h1 class="home-hero__title">XUI</h1>
      <p class="home-hero__desc">一套核心契约，Vue 3 与 React 19 双端同构的通用组件库</p>
      <div class="home-hero__badges">
        <span class="home-badge">Vue 3.5</span>
        <span class="home-badge">React 17 / 18 / 19</span>
        <span class="home-badge">TypeScript 严格模式</span>
        <span class="home-badge">BEM + CSS Variables</span>
        <span class="home-badge"
          >{{ availableCount }} / {{ COMPONENT_LIST.length }} 组件文档已上线</span
        >
      </div>
    </header>

    <section class="home-section">
      <h2 class="docs-section-title">特性</h2>
      <div class="home-features">
        <div v-for="feature in features" :key="feature.title" class="home-feature">
          <div class="home-feature__title">{{ feature.title }}</div>
          <p class="home-feature__desc">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <section class="home-section">
      <h2 class="docs-section-title">安装</h2>
      <div class="demo-block__tabs" style="margin: 16px 0 12px">
        <button
          type="button"
          class="demo-block__tab"
          :class="{ 'is-active': framework === 'vue' }"
          @click="framework = 'vue'"
        >
          Vue
        </button>
        <button
          type="button"
          class="demo-block__tab"
          :class="{ 'is-active': framework === 'react' }"
          @click="framework = 'react'"
        >
          React
        </button>
      </div>
      <CodeBlock :code="installCode" lang="bash" />
    </section>

    <section class="home-section">
      <h2 class="docs-section-title">快速开始</h2>
      <CodeBlock :code="quickStartCode" :lang="framework" />
    </section>

    <section class="home-section">
      <h2 class="docs-section-title">组件总览</h2>
      <template v-for="group in componentGroups" :key="group.category.key">
        <h3 class="docs-subsection-title">{{ group.category.title }}</h3>
        <div class="home-grid">
          <RouterLink
            v-for="item in group.availableList"
            :key="item.slug"
            :to="`/components/${item.slug}`"
            class="home-card"
          >
            <div class="home-card__title">
              {{ item.title }}
              <span class="home-card__en">{{ item.name }}</span>
            </div>
            <p class="home-card__desc">{{ summaryOf(item.slug) }}</p>
          </RouterLink>
          <div v-for="item in group.pendingList" :key="item.slug" class="home-card is-disabled">
            <div class="home-card__title">
              {{ item.title }}
              <span class="home-card__en">{{ item.name }}</span>
              <span class="home-card__soon">待补充</span>
            </div>
            <p class="home-card__desc">文档建设中</p>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>
