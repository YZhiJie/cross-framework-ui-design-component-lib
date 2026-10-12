<script setup lang="ts">
/**
 * 顶部工具栏：语言切换（中 / EN）+ 主题模式切换（明亮 / 暗黑 / 跟随系统）+ GitHub 仓库入口
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

const repoUrl = 'https://github.com/YZhiJie/cross-framework-ui-design-component-lib';
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
      <a
        :href="repoUrl"
        class="docs-topbar__github"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="isZh ? 'GitHub 仓库' : 'GitHub repository'"
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </a>
    </div>
  </header>
</template>
