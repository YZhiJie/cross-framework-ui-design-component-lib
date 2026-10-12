<script setup lang="ts">
/**
 * 主题定制指南页：明暗主题切换 / 全局 token / 组件级定制
 * 独立于组件文档页，走 /theme 路由
 * 展示文案全部为 LText 双语结构，经 t() 按当前语言取值（模板内调用即响应式）
 */
import DemoBlock from '../components/DemoBlock.vue';
import ApiSection from '../components/ApiSection.vue';
import type { ComponentMeta, DemoDefinition } from '../content/types';
import { isZh, t, type LText } from '../i18n';
import { useUiMessages } from '../i18n/ui-messages';

import DarkVue from '../content/theme/demos/dark.vue';
import DarkReact from '../content/theme/demos/dark';
import TokensVue from '../content/theme/demos/tokens.vue';
import TokensReact from '../content/theme/demos/tokens';
import ScopedVue from '../content/theme/demos/component.vue';
import ScopedReact from '../content/theme/demos/component';

import darkVueSource from '../content/theme/demos/dark.vue?raw';
import darkReactSource from '../content/theme/demos/dark.tsx?raw';
import tokensVueSource from '../content/theme/demos/tokens.vue?raw';
import tokensReactSource from '../content/theme/demos/tokens.tsx?raw';
import scopedVueSource from '../content/theme/demos/component.vue?raw';
import scopedReactSource from '../content/theme/demos/component.tsx?raw';

const ui = useUiMessages();

/** 页面级文案（ui-messages 未覆盖的部分） */
const pageText = {
  summary: {
    'zh-CN':
      '基于 CSS 变量的三层主题体系：全局明暗主题切换、全站品牌 token 定制、单组件作用域覆盖，双端（@xui-design/vue / @xui-design/react）共享同一套运行时 API。',
    'en-US':
      'A three-layer theming system based on CSS variables: global light/dark switching, site-wide brand token customization, and per-component scoped overrides — both frameworks (@xui-design/vue / @xui-design/react) share the same runtime API.',
  },
  mechanismTitle: {
    'zh-CN': '工作机制',
    'en-US': 'How It Works',
  },
  apiIntroA: {
    'zh-CN': '主题 API 由 ',
    'en-US': 'The theming API is provided by ',
  },
  apiIntroB: {
    'zh-CN': ' 提供（框架无关实现），',
    'en-US': ' (framework-agnostic implementation). ',
  },
  apiIntroC: {
    'zh-CN': ' 与 ',
    'en-US': ' and ',
  },
  apiIntroD: {
    'zh-CN': ' 同名导出，行为完全一致。',
    'en-US': ' re-export it under the same names with identical behavior.',
  },
} satisfies Record<string, LText>;

/** 工作机制列表片段：strong 加粗 / code 行内代码 / text 普通文本，按序拼接成句 */
interface Segment {
  strong?: LText;
  code?: string;
  text?: LText;
}

const mechanismItems: Segment[][] = [
  [
    { strong: { 'zh-CN': '明暗主题', 'en-US': 'Light & Dark Themes' } },
    {
      text: {
        'zh-CN': '：组件样式仅消费语义 token（',
        'en-US': ': component styles only consume semantic tokens (',
      },
    },
    { code: '--xui-color-*' },
    {
      text: {
        'zh-CN': '），暗色主题由 ',
        'en-US': '); the dark theme overrides all semantic colors through the ',
      },
    },
    { code: "[data-theme='dark']" },
    {
      text: {
        'zh-CN': ' 选择器整体覆盖语义色，切换主题即切换 ',
        'en-US': ' selector. Switching themes simply toggles an attribute on ',
      },
    },
    { code: '<html>' },
    { text: { 'zh-CN': ' 上的属性。', 'en-US': '.' } },
  ],
  [
    { strong: { 'zh-CN': '全局 token', 'en-US': 'Global Tokens' } },
    { text: { 'zh-CN': '：', 'en-US': ': ' } },
    { code: 'setThemeTokens' },
    {
      text: {
        'zh-CN': ' 把 CSS 变量写入 ',
        'en-US': ' writes CSS variables as inline styles on ',
      },
    },
    { code: '<html>' },
    {
      text: {
        'zh-CN': ' 内联样式，级联覆盖预设 token，全站即时生效、无需刷新。',
        'en-US':
          ', cascading over the preset tokens — effective site-wide instantly, no refresh needed.',
      },
    },
  ],
  [
    {
      strong: { 'zh-CN': '组件级定制', 'en-US': 'Component-Level Customization' },
    },
    {
      text: {
        'zh-CN': '：在组件根元素 ',
        'en-US': ': write CSS variables directly on the root element ',
      },
    },
    { code: 'style' },
    {
      text: {
        'zh-CN': ' 上直接写 CSS 变量（双端 style 透传均支持自定义属性），级联仅作用于该子树。',
        'en-US':
          ' (both frameworks pass custom properties through style); the cascade applies only to that subtree.',
      },
    },
  ],
];

const demos: DemoDefinition[] = [
  {
    id: 'dark',
    title: {
      'zh-CN': '全局明暗主题切换',
      'en-US': 'Global Light & Dark Switching',
    },
    description: {
      'zh-CN':
        'setTheme 写入 <html data-theme>，全部组件的语义色联动切换；toggleTheme 在 light / dark 间往返。',
      'en-US':
        'setTheme writes <html data-theme> and every component switches semantic colors accordingly; toggleTheme alternates between light and dark.',
    },
    vueComponent: DarkVue,
    reactComponent: DarkReact,
    vueSource: darkVueSource,
    reactSource: darkReactSource,
  },
  {
    id: 'tokens',
    title: {
      'zh-CN': '全局品牌色 token（setThemeTokens）',
      'en-US': 'Global Brand Tokens (setThemeTokens)',
    },
    description: {
      'zh-CN':
        'setThemeTokens 将 CSS 变量写入 <html>，全站所有组件生效；clearThemeTokens 仅清除本 API 写入的 token。',
      'en-US':
        'setThemeTokens writes CSS variables to <html>, affecting every component site-wide; clearThemeTokens only removes tokens written by this API.',
    },
    vueComponent: TokensVue,
    reactComponent: TokensReact,
    vueSource: tokensVueSource,
    reactSource: tokensReactSource,
  },
  {
    id: 'scoped',
    title: {
      'zh-CN': '组件级主题定制',
      'en-US': 'Component-Level Theming',
    },
    description: {
      'zh-CN':
        '无需任何 API：在组件 style 上直接写 CSS 变量，级联仅作用于该子树，优先级高于全局 token。',
      'en-US':
        'No API needed: write CSS variables directly on a component style; the cascade applies only to that subtree and takes precedence over global tokens.',
    },
    vueComponent: ScopedVue,
    reactComponent: ScopedReact,
    vueSource: scopedVueSource,
    reactSource: scopedReactSource,
  },
];

const api: ComponentMeta['api'] = {
  methods: [
    {
      name: 'setTheme',
      signature: '(theme: XuiTheme) => void',
      description: {
        'zh-CN': '切换明暗主题（写入 <html data-theme>），值未变化时静默返回',
        'en-US':
          'Switches the light/dark theme (writes <html data-theme>); returns silently when the value is unchanged',
      },
    },
    {
      name: 'getTheme',
      signature: '() => XuiTheme',
      description: {
        'zh-CN': '读取当前主题；SSR / 无 DOM 环境返回 light',
        'en-US': 'Reads the current theme; returns light in SSR / DOM-less environments',
      },
    },
    {
      name: 'toggleTheme',
      signature: '() => XuiTheme',
      description: {
        'zh-CN': '在 light / dark 间往返切换，返回切换后的主题',
        'en-US': 'Toggles between light and dark, returning the new theme',
      },
    },
    {
      name: 'subscribeTheme',
      signature: '(listener: (theme: XuiTheme) => void) => () => void',
      description: {
        'zh-CN': '订阅主题变化，返回取消订阅函数',
        'en-US': 'Subscribes to theme changes; returns an unsubscribe function',
      },
    },
    {
      name: 'setThemeTokens',
      signature: '(tokens: ThemeTokens) => void',
      description: {
        'zh-CN':
          '写入全局主题 token（CSS 变量，作用于 <html> 全站生效）；仅接受 -- 开头的变量名，重复调用按合并语义追加 / 覆盖',
        'en-US':
          'Writes global theme tokens (CSS variables on <html>, effective site-wide); only accepts names starting with --; repeated calls merge, adding or overriding incrementally',
      },
    },
    {
      name: 'clearThemeTokens',
      signature: '() => void',
      description: {
        'zh-CN': '清除全部通过 setThemeTokens 写入的 token（不影响 data-theme 与应用自身变量）',
        'en-US':
          'Removes all tokens written by setThemeTokens (does not affect data-theme or app-defined variables)',
      },
    },
  ],
  types: [
    {
      name: 'XuiTheme',
      definition: `type XuiTheme = 'light' | 'dark';`,
      description: {
        'zh-CN': '主题名（light 为默认，dark 由 tokens.scss 的 [data-theme=dark] 提供）。',
        'en-US':
          'Theme name (light is the default; dark is provided by the [data-theme=dark] block in tokens.scss).',
      },
    },
    {
      name: 'ThemeTokens',
      definition: `type ThemeTokens = Record<string, string>;`,
      description: {
        'zh-CN': '主题 token 集合：键为 CSS 自定义属性名（-- 开头），值为对应 CSS 值。',
        'en-US':
          'A set of theme tokens: keys are CSS custom property names (starting with --), values are the corresponding CSS values.',
      },
    },
  ],
};

const notes: LText[] = [
  {
    'zh-CN':
      '三层机制可叠加：明暗主题（data-theme）与全局 token（setThemeTokens）作用于全站，组件级 style 变量仅作用子树；作用域越小子树优先级越高。',
    'en-US':
      'The three layers compose: the light/dark theme (data-theme) and global tokens (setThemeTokens) apply site-wide, while component-level style variables apply only to their subtree; the smaller the scope, the higher the precedence.',
  },
  {
    'zh-CN':
      'setThemeTokens 具备合并语义：重复调用只追加 / 覆盖提及的 token，不会清除未提及的既有 token；clearThemeTokens 只回收该 API 自己写入的键。',
    'en-US':
      'setThemeTokens has merge semantics: repeated calls only add or override the tokens you pass and never remove existing ones; clearThemeTokens only reclaims keys written by this API.',
  },
  {
    'zh-CN':
      'token 名即 @xui-design/styles 暴露的 CSS 变量（如 --xui-color-primary / --xui-color-danger / --xui-color-radius-*），定制前请先查阅 tokens.scss 的完整清单。',
    'en-US':
      'Token names are the CSS variables exposed by @xui-design/styles (e.g. --xui-color-primary / --xui-color-danger / --xui-color-radius-*); check tokens.scss for the full list before customizing.',
  },
  {
    'zh-CN':
      '主题状态写在 <html> 上，对 Modal / Message 等挂载于 body 的浮层组件同样生效；SSR 环境下全部 API 安全降级（不写 DOM、getTheme 返回 light）。',
    'en-US':
      'Theme state lives on <html>, so it also affects overlay components mounted on body such as Modal / Message; all APIs degrade safely under SSR (no DOM writes, getTheme returns light).',
  },
  {
    'zh-CN':
      '全局主题切换影响整个文档站演示区的所有组件示例，离开本页后主题状态仍保留，可在 demo 中一键恢复默认。',
    'en-US':
      'Switching the global theme affects every component demo on this site; the theme persists after leaving this page and can be reset with one click inside the demo.',
  },
];
</script>

<template>
  <div class="docs-content">
    <header class="page-head">
      <h1 class="page-head__title">
        {{ isZh() ? '主题定制' : 'Theming' }}
        <span class="page-head__en">{{ isZh() ? 'Theming' : '主题定制' }}</span>
        <span class="doc-tag">{{ isZh() ? '指南' : 'Guide' }}</span>
      </h1>
      <p class="page-head__summary">
        {{ t(pageText.summary) }}
      </p>
    </header>

    <section>
      <h2 class="docs-section-title">{{ t(pageText.mechanismTitle) }}</h2>
      <ul class="docs-list">
        <li v-for="(item, index) in mechanismItems" :key="index">
          <template v-for="(segment, i) in item" :key="i">
            <strong v-if="segment.strong">{{ t(segment.strong) }}</strong>
            <code v-else-if="segment.code" class="inline-code">{{ segment.code }}</code>
            <template v-else-if="segment.text">{{ t(segment.text) }}</template>
          </template>
        </li>
      </ul>
    </section>

    <section>
      <h2 class="docs-section-title">{{ ui.component.demos }}</h2>
      <p style="margin-bottom: 8px; color: var(--docs-text-secondary); font-size: 13px">
        {{ ui.component.demosHint }}
      </p>
      <DemoBlock v-for="demo in demos" :key="demo.id" :demo="demo" />
    </section>

    <section>
      <h2 class="docs-section-title">{{ ui.component.api }}</h2>
      <p style="margin-bottom: 16px; color: var(--docs-text-secondary); font-size: 13px">
        {{ t(pageText.apiIntroA) }}<code class="inline-code">@xui-design/shared</code
        >{{ t(pageText.apiIntroB) }}<code class="inline-code">@xui-design/vue</code
        >{{ t(pageText.apiIntroC) }}<code class="inline-code">@xui-design/react</code
        >{{ t(pageText.apiIntroD) }}
      </p>
      <ApiSection :api="api" />
    </section>

    <section>
      <h2 class="docs-section-title">{{ ui.component.notes }}</h2>
      <ul class="docs-list">
        <li v-for="note in notes" :key="note['zh-CN']">{{ t(note) }}</li>
      </ul>
    </section>
  </div>
</template>
