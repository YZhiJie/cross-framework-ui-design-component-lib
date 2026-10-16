<script setup lang="ts">
/**
 * 文档首页：项目介绍 / 特性 / 安装与快速开始 / 24 组件总览
 * 文案走 ui-messages 双语字典，组件卡片标题按语言互换主副标
 */
import { computed, ref } from 'vue';
import CodeBlock from '../components/CodeBlock.vue';
import type { ComponentEntry } from '../content/types';
import { COMPONENT_LIST, componentMetas, getComponentsByCategory } from '../content/registry';
import { isZh, t } from '../i18n';
import { useUiMessages } from '../i18n/ui-messages';

const ui = useUiMessages();
const framework = ref<'vue' | 'react'>('vue');

// 预分组，避免模板内联 filter 丢失回调参数类型
const componentGroups = getComponentsByCategory().map((group) => ({
  ...group,
  availableList: group.components.filter((item: ComponentEntry) => item.available),
  pendingList: group.components.filter((item: ComponentEntry) => !item.available),
}));
const availableCount = componentMetas.length;

const installCode = computed(() => {
  const entry = framework.value === 'vue' ? 'main.ts' : 'main.tsx';
  return `pnpm add @xui-design/${framework.value} @xui-design/styles

${ui.value.home.installCoreComment}
pnpm add @xui-design/core

${ui.value.home.installStyleComment}
# ${entry}:  import '@xui-design/styles'`;
});

// 三段拼接出 script 元素的闭合标签：SFC 解析器会按字面序列截断 script 块，
// 因此示例源码字符串里（含注释）都不能直接出现该序列
const SCRIPT_CLOSE_TAG = '<' + '/script' + '>';

const quickStartCode = computed(() =>
  framework.value === 'vue'
    ? `<script setup lang="ts">
import { Button } from '@xui-design/vue';
import '@xui-design/styles';
${SCRIPT_CLOSE_TAG}

<template>
  <Button type="primary">Hello XUI</Button>
</template>`
    : `import { Button } from '@xui-design/react';
import '@xui-design/styles';

export default function App() {
  return (
    <Button type="primary">Hello XUI</Button>
  );
}`,
);

const summaryOf = (slug: string) => {
  const meta = componentMetas.find((item) => item.slug === slug);
  return meta ? t(meta.summary) : '';
};

// 卡片主 / 副标题按语言互换（中文名 ↔ 英文名）
const primaryOf = (item: ComponentEntry) => (isZh() ? item.title : item.name);
const secondaryOf = (item: ComponentEntry) => (isZh() ? item.name : item.title);
</script>

<template>
  <div class="docs-content">
    <header class="home-hero">
      <h1 class="home-hero__title">XUI</h1>
      <p class="home-hero__desc">{{ ui.home.heroDesc }}</p>
      <div class="home-hero__badges">
        <span class="home-badge">Vue 3.5</span>
        <span class="home-badge">React 17 / 18 / 19</span>
        <span class="home-badge">TypeScript Strict</span>
        <span class="home-badge">BEM + CSS Variables</span>
        <span class="home-badge"
          >{{ availableCount }} / {{ COMPONENT_LIST.length }} {{ ui.home.onlineBadge }}</span
        >
      </div>
    </header>

    <section class="home-section">
      <h2 class="docs-section-title">{{ ui.home.featuresTitle }}</h2>
      <div class="home-features">
        <div v-for="feature in ui.home.features" :key="feature.title" class="home-feature">
          <div class="home-feature__title">{{ feature.title }}</div>
          <p class="home-feature__desc">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <section class="home-section">
      <h2 class="docs-section-title">{{ ui.home.installTitle }}</h2>
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
      <h2 class="docs-section-title">{{ ui.home.quickStartTitle }}</h2>
      <CodeBlock :code="quickStartCode" :lang="framework" />
    </section>

    <section class="home-section">
      <h2 class="docs-section-title">{{ ui.home.overviewTitle }}</h2>
      <template v-for="group in componentGroups" :key="group.category.key">
        <h3 class="docs-subsection-title">{{ t(group.category.title) }}</h3>
        <div class="home-grid">
          <RouterLink
            v-for="item in group.availableList"
            :key="item.slug"
            :to="`/components/${item.slug}`"
            class="home-card"
          >
            <div class="home-card__title">
              {{ primaryOf(item) }}
              <span class="home-card__en">{{ secondaryOf(item) }}</span>
            </div>
            <p class="home-card__desc">{{ summaryOf(item.slug) }}</p>
          </RouterLink>
          <div v-for="item in group.pendingList" :key="item.slug" class="home-card is-disabled">
            <div class="home-card__title">
              {{ primaryOf(item) }}
              <span class="home-card__en">{{ secondaryOf(item) }}</span>
              <span class="home-card__soon">{{ ui.nav.soon }}</span>
            </div>
            <p class="home-card__desc">{{ ui.home.pendingDesc }}</p>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>
