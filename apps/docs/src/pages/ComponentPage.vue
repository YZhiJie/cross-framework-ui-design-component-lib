<script setup lang="ts">
/**
 * 组件详情页：标题 / 特性 / 双端可交互 demo / API 表格 / 注意事项
 * 全部内容字段为 LText 双语结构，经 t() 按当前语言取值（模板内调用即响应式）
 */
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { CATEGORIES, componentMetaMap } from '../content/registry';
import DemoBlock from '../components/DemoBlock.vue';
import ApiSection from '../components/ApiSection.vue';
import { isZh, t } from '../i18n';
import { useUiMessages } from '../i18n/ui-messages';

const route = useRoute();
const ui = useUiMessages();

const meta = computed(() => componentMetaMap.get(String(route.params.slug ?? '')));

const categoryTitle = computed(() => {
  const category = CATEGORIES.find((item) => item.key === meta.value?.category);
  return category ? t(category.title) : '';
});
</script>

<template>
  <div v-if="meta" class="docs-content">
    <header class="page-head">
      <h1 class="page-head__title">
        {{ isZh() ? meta.title : meta.name }}
        <span class="page-head__en">{{ isZh() ? meta.name : meta.title }}</span>
        <span class="doc-tag">{{ categoryTitle }}</span>
      </h1>
      <p class="page-head__summary">{{ t(meta.summary) }}</p>
    </header>

    <section>
      <h2 class="docs-section-title">{{ ui.component.features }}</h2>
      <ul class="docs-list">
        <li v-for="feature in meta.features" :key="feature['zh-CN']">{{ t(feature) }}</li>
      </ul>
      <template v-if="meta.scenarios && meta.scenarios.length > 0">
        <h3 class="docs-subsection-title">{{ ui.component.scenarios }}</h3>
        <ul class="docs-list">
          <li v-for="scenario in meta.scenarios" :key="scenario['zh-CN']">{{ t(scenario) }}</li>
        </ul>
      </template>
    </section>

    <section>
      <h2 class="docs-section-title">{{ ui.component.demos }}</h2>
      <p style="margin-bottom: 8px; color: var(--docs-text-secondary); font-size: 13px">
        {{ ui.component.demosHint }}
      </p>
      <DemoBlock v-for="demo in meta.demos" :key="demo.id" :demo="demo" />
    </section>

    <section>
      <h2 class="docs-section-title">{{ ui.component.api }}</h2>
      <p style="margin-bottom: 16px; color: var(--docs-text-secondary); font-size: 13px">
        <code class="inline-code">@xui-design/core</code> ComponentSpec ·
        {{ isZh() ? '唯一契约基准，双端一致' : 'single contract, identical on both frameworks' }}
      </p>
      <ApiSection :api="meta.api" />
    </section>

    <section v-if="meta.notes && meta.notes.length > 0">
      <h2 class="docs-section-title">{{ ui.component.notes }}</h2>
      <ul class="docs-list">
        <li v-for="note in meta.notes" :key="note['zh-CN']">{{ t(note) }}</li>
      </ul>
    </section>

    <section v-if="meta.a11y && meta.a11y.length > 0">
      <h2 class="docs-section-title">{{ ui.component.a11y }}</h2>
      <ul class="docs-list">
        <li v-for="item in meta.a11y" :key="item['zh-CN']">{{ t(item) }}</li>
      </ul>
    </section>
  </div>

  <div v-else class="docs-content">
    <div class="not-found">
      <p class="not-found__title">{{ ui.component.notFoundTitle }}</p>
      <p style="margin-top: 8px">{{ ui.component.notFoundDesc }}</p>
      <RouterLink to="/" class="not-found__link">{{ ui.component.backHome }}</RouterLink>
    </div>
  </div>
</template>
