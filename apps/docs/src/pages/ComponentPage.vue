<script setup lang="ts">
/**
 * 组件详情页：标题 / 特性 / 双端可交互 demo / API 表格 / 注意事项
 */
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { CATEGORIES, componentMetaMap } from '../content/registry';
import DemoBlock from '../components/DemoBlock.vue';
import ApiSection from '../components/ApiSection.vue';

const route = useRoute();

const meta = computed(() => componentMetaMap.get(String(route.params.slug ?? '')));

const categoryTitle = computed(
  () => CATEGORIES.find((category) => category.key === meta.value?.category)?.title ?? '',
);
</script>

<template>
  <div v-if="meta" class="docs-content">
    <header class="page-head">
      <h1 class="page-head__title">
        {{ meta.title }}
        <span class="page-head__en">{{ meta.name }}</span>
        <span class="doc-tag">{{ categoryTitle }}</span>
      </h1>
      <p class="page-head__summary">{{ meta.summary }}</p>
    </header>

    <section>
      <h2 class="docs-section-title">功能特性</h2>
      <ul class="docs-list">
        <li v-for="feature in meta.features" :key="feature">{{ feature }}</li>
      </ul>
      <template v-if="meta.scenarios && meta.scenarios.length > 0">
        <h3 class="docs-subsection-title">使用场景</h3>
        <ul class="docs-list">
          <li v-for="scenario in meta.scenarios" :key="scenario">{{ scenario }}</li>
        </ul>
      </template>
    </section>

    <section>
      <h2 class="docs-section-title">代码演示</h2>
      <p style="margin-bottom: 8px; color: var(--docs-text-secondary); font-size: 13px">
        每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。
      </p>
      <DemoBlock v-for="demo in meta.demos" :key="demo.id" :demo="demo" />
    </section>

    <section>
      <h2 class="docs-section-title">API 文档</h2>
      <p style="margin-bottom: 16px; color: var(--docs-text-secondary); font-size: 13px">
        API 以 <code class="inline-code">@xui-design/core</code> 的 ComponentSpec
        为唯一契约基准，双端一致。
      </p>
      <ApiSection :api="meta.api" />
    </section>

    <section v-if="meta.notes && meta.notes.length > 0">
      <h2 class="docs-section-title">注意事项</h2>
      <ul class="docs-list">
        <li v-for="note in meta.notes" :key="note">{{ note }}</li>
      </ul>
    </section>

    <section v-if="meta.a11y && meta.a11y.length > 0">
      <h2 class="docs-section-title">无障碍</h2>
      <ul class="docs-list">
        <li v-for="item in meta.a11y" :key="item">{{ item }}</li>
      </ul>
    </section>
  </div>

  <div v-else class="docs-content">
    <div class="not-found">
      <p class="not-found__title">该组件文档尚未上线</p>
      <p style="margin-top: 8px">组件已在规划清单中，文档正在陆续补充。</p>
      <RouterLink to="/" class="not-found__link">返回首页</RouterLink>
    </div>
  </div>
</template>
