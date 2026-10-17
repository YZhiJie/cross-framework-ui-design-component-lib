<script setup lang="ts">
/**
 * 首页正文：安装（双框架 tab）/ 快速开始 / 24 组件总览
 * 从旧版 HomePage 移植；语言由 i18n 模块驱动（LocaleSync 已与路由同步），
 * 组件卡片链接按当前 locale 生成（zh 根路径 / en 前缀）。
 */
import { computed, ref } from 'vue';
import { useData, withBase } from 'vitepress';
import CodeBlock from '../../../src/components/CodeBlock.vue';
import type { ComponentEntry } from '../../../src/content/types';
import { componentMetas, getComponentsByCategory } from '../../../src/content/registry';
import { isZh, t } from '../../../src/i18n';
import { useUiMessages } from '../../../src/i18n/ui-messages';

const { lang } = useData();
const ui = useUiMessages();
const framework = ref<'vue' | 'react'>('vue');

// 预分组，避免模板内联 filter 丢失回调参数类型
const componentGroups = getComponentsByCategory().map((group) => ({
  ...group,
  availableList: group.components.filter((item: ComponentEntry) => item.available),
  pendingList: group.components.filter((item: ComponentEntry) => !item.available),
}));

/** 当前 locale 的组件页链接前缀（zh 根树 / en 树），withBase 补全部署 base 前缀 */
const localePrefix = computed(() => (lang.value === 'zh-CN' ? '' : '/en'));
const componentHref = (slug: string) => withBase(`${localePrefix.value}/components/${slug}`);

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
  <div class="docs-home-body">
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
          <a
            v-for="item in group.availableList"
            :key="item.slug"
            :href="componentHref(item.slug)"
            class="home-card"
          >
            <div class="home-card__title">
              {{ primaryOf(item) }}
              <span class="home-card__en">{{ secondaryOf(item) }}</span>
            </div>
            <p class="home-card__desc">{{ summaryOf(item.slug) }}</p>
          </a>
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
