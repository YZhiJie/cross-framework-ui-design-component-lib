<script setup lang="ts">
/**
 * 左侧导航：介绍入口 + 按分类分组的组件清单
 * 未上线组件渲染为置灰条目，保持规划全貌可见
 * 文案随文档语言切换：中文模式主显中文名（副标英文名），英文模式反之
 */
import { useRoute } from 'vue-router';
import { getComponentsByCategory } from '../content/registry';
import { isZh, t } from '../i18n';
import { useUiMessages } from '../i18n/ui-messages';

const route = useRoute();
const ui = useUiMessages();
const groups = getComponentsByCategory();

const isActive = (slug: string) => route.name === 'component' && route.params.slug === slug;

// 组件条目的主 / 副标题按语言互换（中文名 ↔ 英文名）；模板调用即收集 locale 依赖
const primaryOf = (item: { name: string; title: string }) => (isZh() ? item.title : item.name);
const secondaryOf = (item: { name: string; title: string }) => (isZh() ? item.name : item.title);
</script>

<template>
  <aside class="docs-sidebar">
    <nav class="side-nav">
      <div class="side-nav__brand">
        <span class="side-nav__logo">XUI</span>
        <span class="side-nav__version">v0.1.0</span>
      </div>
      <div class="side-nav__groups">
        <div class="side-nav__group-title">{{ ui.nav.start }}</div>
        <RouterLink to="/" class="side-nav__link" :class="{ 'is-active': route.name === 'home' }">
          {{ ui.nav.intro }}
          <span v-if="isZh()" class="side-nav__en">Introduction</span>
        </RouterLink>
        <RouterLink
          to="/theme"
          class="side-nav__link"
          :class="{ 'is-active': route.name === 'theme' }"
        >
          {{ ui.nav.theme }}
          <span v-if="isZh()" class="side-nav__en">Theming</span>
        </RouterLink>
        <RouterLink
          to="/i18n"
          class="side-nav__link"
          :class="{ 'is-active': route.name === 'i18n' }"
        >
          {{ ui.nav.i18n }}
          <span v-if="isZh()" class="side-nav__en">i18n</span>
        </RouterLink>
        <RouterLink
          to="/floating"
          class="side-nav__link"
          :class="{ 'is-active': route.name === 'floating' }"
        >
          {{ ui.nav.floating }}
          <span v-if="isZh()" class="side-nav__en">Floating</span>
        </RouterLink>

        <template v-for="group in groups" :key="group.category.key">
          <div class="side-nav__group-title">{{ t(group.category.title) }}</div>
          <template v-for="item in group.components" :key="item.slug">
            <RouterLink
              v-if="item.available"
              :to="`/components/${item.slug}`"
              class="side-nav__link"
              :class="{ 'is-active': isActive(item.slug) }"
            >
              {{ primaryOf(item) }}
              <span class="side-nav__en">{{ secondaryOf(item) }}</span>
            </RouterLink>
            <span v-else class="side-nav__item-disabled">
              {{ primaryOf(item) }}
              <span class="side-nav__soon">{{ ui.nav.soon }}</span>
            </span>
          </template>
        </template>
      </div>
    </nav>
  </aside>
</template>
