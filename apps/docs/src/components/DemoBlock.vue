<script setup lang="ts">
/**
 * 单个 demo 展示块
 *
 * - Vue / React 双 tab：同一 demo 双端真实组件实时挂载，源码随 tab 联动
 * - 预览区常驻，代码区可折叠
 * - React demo 经 createRoot 挂载到独立容器，切走 / 卸载时 unmount
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import type { Root } from 'react-dom/client';
import type { DemoDefinition } from '../content/types';
import { mountReactDemo } from './react-mount';
import CodeBlock from './CodeBlock.vue';
import { t } from '../i18n';
import { useUiMessages } from '../i18n/ui-messages';

const props = defineProps<{ demo: DemoDefinition }>();

const ui = useUiMessages();

const framework = ref<'vue' | 'react'>('vue');
const showCode = ref(true);
const reactHost = ref<HTMLElement | null>(null);
let reactRoot: Root | null = null;

const unmountReact = () => {
  reactRoot?.unmount();
  reactRoot = null;
};

watch(framework, async (value) => {
  if (value === 'react') {
    // 等待 v-if 的容器渲染完成后再挂载
    await nextTick();
    if (reactHost.value !== null && reactRoot === null) {
      reactRoot = mountReactDemo(reactHost.value, props.demo.reactComponent);
    }
  } else {
    unmountReact();
  }
});

onBeforeUnmount(unmountReact);
</script>

<template>
  <section class="demo-block">
    <div class="demo-block__header">
      <h3 class="demo-block__title">{{ t(demo.title) }}</h3>
      <div class="demo-block__tabs" role="tablist">
        <button
          type="button"
          class="demo-block__tab"
          :class="{ 'is-active': framework === 'vue' }"
          role="tab"
          :aria-selected="framework === 'vue'"
          @click="framework = 'vue'"
        >
          Vue
        </button>
        <button
          type="button"
          class="demo-block__tab"
          :class="{ 'is-active': framework === 'react' }"
          role="tab"
          :aria-selected="framework === 'react'"
          @click="framework = 'react'"
        >
          React
        </button>
      </div>
    </div>
    <p v-if="demo.description" class="demo-block__desc">{{ t(demo.description) }}</p>
    <div class="demo-block__stage">
      <component :is="demo.vueComponent" v-if="framework === 'vue'" />
      <div v-else ref="reactHost" class="demo-block__react-host" />
    </div>
    <div class="demo-block__footer">
      <button type="button" class="demo-block__toggle" @click="showCode = !showCode">
        {{ showCode ? ui.demo.hideCode : ui.demo.showCode }}
      </button>
    </div>
    <div v-show="showCode" class="demo-block__code">
      <CodeBlock
        :code="framework === 'vue' ? demo.vueSource : demo.reactSource"
        :lang="framework"
      />
    </div>
  </section>
</template>
