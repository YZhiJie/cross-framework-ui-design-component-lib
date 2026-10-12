<script setup lang="ts">
/**
 * 主题定制指南页：明暗主题切换 / 全局 token / 组件级定制
 * 独立于组件文档页，走 /theme 路由
 */
import DemoBlock from '../components/DemoBlock.vue';
import ApiSection from '../components/ApiSection.vue';

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

const demos = [
  {
    id: 'dark',
    title: '全局明暗主题切换',
    description:
      'setTheme 写入 <html data-theme>，全部组件的语义色联动切换；toggleTheme 在 light / dark 间往返。',
    vueComponent: DarkVue,
    reactComponent: DarkReact,
    vueSource: darkVueSource,
    reactSource: darkReactSource,
  },
  {
    id: 'tokens',
    title: '全局品牌色 token（setThemeTokens）',
    description:
      'setThemeTokens 将 CSS 变量写入 <html>，全站所有组件生效；clearThemeTokens 仅清除本 API 写入的 token。',
    vueComponent: TokensVue,
    reactComponent: TokensReact,
    vueSource: tokensVueSource,
    reactSource: tokensReactSource,
  },
  {
    id: 'scoped',
    title: '组件级主题定制',
    description:
      '无需任何 API：在组件 style 上直接写 CSS 变量，级联仅作用于该子树，优先级高于全局 token。',
    vueComponent: ScopedVue,
    reactComponent: ScopedReact,
    vueSource: scopedVueSource,
    reactSource: scopedReactSource,
  },
];

const api = {
  methods: [
    {
      name: 'setTheme',
      signature: '(theme: XuiTheme) => void',
      description: '切换明暗主题（写入 <html data-theme>），值未变化时静默返回',
    },
    {
      name: 'getTheme',
      signature: '() => XuiTheme',
      description: '读取当前主题；SSR / 无 DOM 环境返回 light',
    },
    {
      name: 'toggleTheme',
      signature: '() => XuiTheme',
      description: '在 light / dark 间往返切换，返回切换后的主题',
    },
    {
      name: 'subscribeTheme',
      signature: '(listener: (theme: XuiTheme) => void) => () => void',
      description: '订阅主题变化，返回取消订阅函数',
    },
    {
      name: 'setThemeTokens',
      signature: '(tokens: ThemeTokens) => void',
      description:
        '写入全局主题 token（CSS 变量，作用于 <html> 全站生效）；仅接受 -- 开头的变量名，重复调用按合并语义追加 / 覆盖',
    },
    {
      name: 'clearThemeTokens',
      signature: '() => void',
      description: '清除全部通过 setThemeTokens 写入的 token（不影响 data-theme 与应用自身变量）',
    },
  ],
  types: [
    {
      name: 'XuiTheme',
      definition: `type XuiTheme = 'light' | 'dark';`,
      description: '主题名（light 为默认，dark 由 tokens.scss 的 [data-theme=dark] 提供）。',
    },
    {
      name: 'ThemeTokens',
      definition: `type ThemeTokens = Record<string, string>;`,
      description: '主题 token 集合：键为 CSS 自定义属性名（-- 开头），值为对应 CSS 值。',
    },
  ],
};

const notes = [
  '三层机制可叠加：明暗主题（data-theme）与全局 token（setThemeTokens）作用于全站，组件级 style 变量仅作用子树；作用域越小子树优先级越高。',
  'setThemeTokens 具备合并语义：重复调用只追加 / 覆盖提及的 token，不会清除未提及的既有 token；clearThemeTokens 只回收该 API 自己写入的键。',
  'token 名即 @xui/styles 暴露的 CSS 变量（如 --xui-color-primary / --xui-color-danger / --xui-color-radius-*），定制前请先查阅 tokens.scss 的完整清单。',
  '主题状态写在 <html> 上，对 Modal / Message 等挂载于 body 的浮层组件同样生效；SSR 环境下全部 API 安全降级（不写 DOM、getTheme 返回 light）。',
  '全局主题切换影响整个文档站演示区的所有组件示例，离开本页后主题状态仍保留，可在 demo 中一键恢复默认。',
];
</script>

<template>
  <div class="docs-content">
    <header class="page-head">
      <h1 class="page-head__title">
        主题定制
        <span class="page-head__en">Theming</span>
        <span class="doc-tag">指南</span>
      </h1>
      <p class="page-head__summary">
        基于 CSS 变量的三层主题体系：全局明暗主题切换、全站品牌 token 定制、单组件作用域覆盖，
        双端（@xui/vue / @xui/react）共享同一套运行时 API。
      </p>
    </header>

    <section>
      <h2 class="docs-section-title">工作机制</h2>
      <ul class="docs-list">
        <li>
          <strong>明暗主题</strong>：组件样式仅消费语义 token（<code class="inline-code">--xui-color-*</code>），
          暗色主题由 <code class="inline-code">[data-theme='dark']</code> 选择器整体覆盖语义色，
          切换主题即切换 <code class="inline-code">&lt;html&gt;</code> 上的属性。
        </li>
        <li>
          <strong>全局 token</strong>：<code class="inline-code">setThemeTokens</code> 把 CSS 变量写入
          <code class="inline-code">&lt;html&gt;</code> 内联样式，级联覆盖预设 token，全站即时生效、无需刷新。
        </li>
        <li>
          <strong>组件级定制</strong>：在组件根元素 <code class="inline-code">style</code> 上直接写 CSS 变量
          （双端 style 透传均支持自定义属性），级联仅作用于该子树。
        </li>
      </ul>
    </section>

    <section>
      <h2 class="docs-section-title">代码演示</h2>
      <p style="margin-bottom: 8px; color: var(--docs-text-secondary); font-size: 13px">
        每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。
      </p>
      <DemoBlock v-for="demo in demos" :key="demo.id" :demo="demo" />
    </section>

    <section>
      <h2 class="docs-section-title">API 文档</h2>
      <p style="margin-bottom: 16px; color: var(--docs-text-secondary); font-size: 13px">
        主题 API 由 <code class="inline-code">@xui/shared</code> 提供（框架无关实现），
        <code class="inline-code">@xui/vue</code> 与 <code class="inline-code">@xui/react</code> 同名导出，行为完全一致。
      </p>
      <ApiSection :api="api" />
    </section>

    <section>
      <h2 class="docs-section-title">注意事项</h2>
      <ul class="docs-list">
        <li v-for="note in notes" :key="note">{{ note }}</li>
      </ul>
    </section>
  </div>
</template>
