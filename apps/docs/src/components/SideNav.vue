<script setup lang="ts">
/**
 * 左侧导航：介绍入口 + 按分类分组的组件清单
 * 未上线组件渲染为置灰条目，保持规划全貌可见
 */
import { useRoute } from 'vue-router';
import { getComponentsByCategory } from '../content/registry';

const route = useRoute();
const groups = getComponentsByCategory();

const isActive = (slug: string) => route.name === 'component' && route.params.slug === slug;
</script>

<template>
  <aside class="docs-sidebar">
    <nav class="side-nav">
      <div class="side-nav__brand">
        <span class="side-nav__logo">XUI</span>
        <span class="side-nav__version">v0.1.0</span>
      </div>
      <div class="side-nav__groups">
        <div class="side-nav__group-title">开始</div>
        <RouterLink to="/" class="side-nav__link" :class="{ 'is-active': route.name === 'home' }">
          介绍
          <span class="side-nav__en">Introduction</span>
        </RouterLink>

        <template v-for="group in groups" :key="group.category.key">
          <div class="side-nav__group-title">{{ group.category.title }}</div>
          <template v-for="item in group.components" :key="item.slug">
            <RouterLink
              v-if="item.available"
              :to="`/components/${item.slug}`"
              class="side-nav__link"
              :class="{ 'is-active': isActive(item.slug) }"
            >
              {{ item.title }}
              <span class="side-nav__en">{{ item.name }}</span>
            </RouterLink>
            <span v-else class="side-nav__item-disabled">
              {{ item.title }}
              <span class="side-nav__soon">待补充</span>
            </span>
          </template>
        </template>
      </div>
    </nav>
  </aside>
</template>
