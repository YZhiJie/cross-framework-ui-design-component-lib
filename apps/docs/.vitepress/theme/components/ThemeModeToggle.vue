<script setup lang="ts">
/**
 * 三态主题切换（明亮 / 暗黑 / 跟随系统）
 *
 * - 与 VitePress 主题体系对接：isDark（VueUse useDark，storage 为
 *   vitepress-theme-appearance: auto | light | dark）负责 <html> 的 dark 类，
 *   供默认主题样式消费
 * - 与组件库主题体系对接：setTheme 写入 <html data-theme>，demo 组件消费的
 *   --xui-color-* 语义 token 同步切换
 * - system 模式监听 matchMedia 变化实时跟随；持久化复用 VP 的 storage key，
 *   首屏由内联脚本同步 dark 类与 data-theme，无闪烁
 */
import { onMounted, onUnmounted, ref } from 'vue';
import { useData } from 'vitepress';
import { setTheme } from '@xui-design/vue';
import { useUiMessages } from '../../../src/i18n/ui-messages';

type Mode = 'light' | 'dark' | 'system';

const APPEARANCE_KEY = 'vitepress-theme-appearance';
const STORAGE_TO_MODE: Record<string, Mode> = { light: 'light', dark: 'dark', auto: 'system' };
const MODE_ORDER: Mode[] = ['light', 'dark', 'system'];

const { isDark } = useData();
const ui = useUiMessages();

// SSR / 水化阶段不读取 localStorage，挂载后再校准选中态，避免水化不匹配
const mode = ref<Mode>('system');
const ready = ref(false);

const readMode = (): Mode => {
  try {
    const saved = localStorage.getItem(APPEARANCE_KEY);
    return (saved && STORAGE_TO_MODE[saved]) || 'system';
  } catch {
    return 'system';
  }
};

const apply = (next: Mode): void => {
  mode.value = next;
  if (next === 'system') {
    const matches = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark.value = matches;
    // useDark setter 会把选择固化成 light/dark，这里改写回 auto 以保持“跟随系统”
    localStorage.setItem(APPEARANCE_KEY, 'auto');
  } else {
    isDark.value = next === 'dark';
  }
  setTheme(isDark.value ? 'dark' : 'light');
};

const setMode = (next: Mode): void => {
  if (next === mode.value) return;
  apply(next);
};

const onMediaChange = (event: MediaQueryListEvent): void => {
  if (mode.value !== 'system') return;
  isDark.value = event.matches;
  setTheme(event.matches ? 'dark' : 'light');
};

let media: MediaQueryList | null = null;

onMounted(() => {
  media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onMediaChange);
  // 挂载时按持久化模式校准选中态，并把当前主题同步给组件库（data-theme）
  apply(readMode());
  ready.value = true;
});

onUnmounted(() => media?.removeEventListener('change', onMediaChange));

const labelOf = (value: Mode): string => {
  const topbar = ui.value.topbar;
  return value === 'light' ? topbar.light : value === 'dark' ? topbar.dark : topbar.system;
};

const isActive = (value: Mode): boolean => ready.value && mode.value === value;
</script>

<template>
  <ClientOnly>
    <div class="docs-theme-toggle" role="radiogroup" aria-label="主题模式">
      <button
        v-for="value in MODE_ORDER"
        :key="value"
        type="button"
        class="docs-theme-toggle__item"
        :class="{ 'is-active': isActive(value) }"
        role="radio"
        :aria-checked="isActive(value)"
        :title="labelOf(value)"
        @click="setMode(value)"
      >
        <!-- 太阳：明亮 -->
        <svg v-if="value === 'light'" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66l1.42-1.42M4.92 19.08l1.42-1.42m0-11.32L4.92 4.92m14.16 14.16l-1.42-1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
          />
        </svg>
        <!-- 月亮：暗黑 -->
        <svg
          v-else-if="value === 'dark'"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          />
        </svg>
        <!-- 显示器：跟随系统 -->
        <svg v-else viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm7 16h4m-2-4v4"
          />
        </svg>
      </button>
    </div>
  </ClientOnly>
</template>
