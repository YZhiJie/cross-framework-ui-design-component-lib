/**
 * 「主题定制」指南页数据：双端 demo 装配 + API 表格数据
 * 展示文案保持 LText 双语结构，由 DemoBlock / ApiSection 渲染层取值
 */
import type { ComponentMeta, DemoDefinition } from '../types';

import DarkVue from './demos/dark.vue';
import DarkReact from './demos/dark';
import TokensVue from './demos/tokens.vue';
import TokensReact from './demos/tokens';
import ScopedVue from './demos/component.vue';
import ScopedReact from './demos/component';

import darkVueSource from './demos/dark.vue?raw';
import darkReactSource from './demos/dark.tsx?raw';
import tokensVueSource from './demos/tokens.vue?raw';
import tokensReactSource from './demos/tokens.tsx?raw';
import scopedVueSource from './demos/component.vue?raw';
import scopedReactSource from './demos/component.tsx?raw';

export const themeGuideDemos: DemoDefinition[] = [
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

export const themeGuideApi: ComponentMeta['api'] = {
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
