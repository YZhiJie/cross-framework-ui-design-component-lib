<script setup lang="ts">
/**
 * 顶部工具栏：语言切换（中 / EN）+ 主题模式切换（明亮 / 暗黑 / 跟随系统）
 *
 * 控件状态分别来自 src/i18n 与 src/theme 的模块级响应式状态，切换即全站生效。
 */
import { computed } from 'vue';
import { docsLocale, setDocsLocale } from '../i18n';
import { useUiMessages } from '../i18n/ui-messages';
import { docsThemeMode, setDocsThemeMode, type DocsThemeMode } from '../theme';

const ui = useUiMessages();

const isZh = computed(() => docsLocale.locale === 'zh-CN');

const toggleLocale = () => {
  setDocsLocale(isZh.value ? 'en-US' : 'zh-CN');
};

const themeModes: { key: DocsThemeMode; labelKey: 'light' | 'dark' | 'system' }[] = [
  { key: 'light', labelKey: 'light' },
  { key: 'dark', labelKey: 'dark' },
  { key: 'system', labelKey: 'system' },
];
</script>

<template>
  <header class="docs-topbar">
    <div class="docs-topbar__controls">
      <button type="button" class="docs-topbar__lang" @click="toggleLocale">
        {{ ui.topbar.switchLang }}
      </button>
      <div class="docs-topbar__theme" role="radiogroup">
        <button
          v-for="mode in themeModes"
          :key="mode.key"
          type="button"
          class="docs-topbar__theme-item"
          :class="{ 'is-active': docsThemeMode.mode === mode.key }"
          role="radio"
          :aria-checked="docsThemeMode.mode === mode.key"
          @click="setDocsThemeMode(mode.key)"
        >
          {{ ui.topbar[mode.labelKey] }}
        </button>
      </div>
    </div>
  </header>
</template>
