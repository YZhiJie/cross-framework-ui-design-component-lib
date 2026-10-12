<script setup lang="ts">
/**
 * 国际化指南页：内置语言包 / setLocale 切换 / registerLocale 扩展
 * 独立于组件文档页，走 /i18n 路由
 * 展示文案全部为 LText 双语结构，经 t() 按当前语言取值（模板内调用即响应式）
 */
import DemoBlock from '../components/DemoBlock.vue';
import ApiSection from '../components/ApiSection.vue';
import type { ComponentMeta, DemoDefinition } from '../content/types';
import { isZh, t, type LText } from '../i18n';
import { useUiMessages } from '../i18n/ui-messages';

import SwitchVue from '../content/i18n/demos/switch.vue';
import SwitchReact from '../content/i18n/demos/switch';
import CustomVue from '../content/i18n/demos/custom.vue';
import CustomReact from '../content/i18n/demos/custom';

import switchVueSource from '../content/i18n/demos/switch.vue?raw';
import switchReactSource from '../content/i18n/demos/switch.tsx?raw';
import customVueSource from '../content/i18n/demos/custom.vue?raw';
import customReactSource from '../content/i18n/demos/custom.tsx?raw';

const ui = useUiMessages();

/** 页面级文案（ui-messages 未覆盖的部分） */
const pageText = {
  summary: {
    'zh-CN':
      '组件库内置中文（zh-CN）与英文（en-US）语言包：setLocale 一行切换全部组件文案，registerLocale 支持扩展任意语言，双端（@xui-design/vue / @xui-design/react）共享同一套运行时 API。',
    'en-US':
      'The library ships built-in Chinese (zh-CN) and English (en-US) locale packs: switch all component messages with one setLocale call, extend to any language via registerLocale, and share the same runtime API on both frameworks (@xui-design/vue / @xui-design/react).',
  },
  mechanismTitle: {
    'zh-CN': '工作机制',
    'en-US': 'How It Works',
  },
  builtinTitle: {
    'zh-CN': '内置文案清单（zh-CN）',
    'en-US': 'Built-in Messages (zh-CN)',
  },
  apiIntroA: {
    'zh-CN': '国际化 API 由 ',
    'en-US': 'The i18n API is provided by ',
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
    { strong: { 'zh-CN': '文案分层', 'en-US': 'Message Layers' } },
    {
      text: {
        'zh-CN':
          '：组件内置文案（Modal 按钮文本、Table 空态、DatePicker 面板标题与星期、Pagination / Breadcrumb / Skeleton / Select 的 aria 与占位符）统一从全局语言包读取；用户显式传入的文案 prop 始终优先。',
        'en-US':
          ': built-in component messages (Modal button text, Table empty state, DatePicker panel titles and weekdays, aria and placeholder text for Pagination / Breadcrumb / Skeleton / Select) are all read from the global locale pack; explicitly passed message props always take precedence.',
      },
    },
  ],
  [
    { strong: { 'zh-CN': '响应式切换', 'en-US': 'Reactive Switching' } },
    { text: { 'zh-CN': '：', 'en-US': ': ' } },
    { code: 'setLocale' },
    {
      text: {
        'zh-CN': ' 通知所有订阅组件重渲染，Vue 端经 ',
        'en-US': ' notifies all subscribed components to re-render — via the ',
      },
    },
    { code: 'useLocaleData' },
    {
      text: {
        'zh-CN': ' 组合式函数、React 端经 ',
        'en-US': ' composable on Vue and ',
      },
    },
    { code: 'useSyncExternalStore' },
    {
      text: {
        'zh-CN': ' 同步，已挂载组件即时更新。',
        'en-US': ' on React — so mounted components update immediately.',
      },
    },
  ],
  [
    { strong: { 'zh-CN': '扩展语言', 'en-US': 'Extending Languages' } },
    { text: { 'zh-CN': '：', 'en-US': ': ' } },
    { code: 'registerLocale' },
    {
      text: {
        'zh-CN':
          ' 以组件分组提供部分语言包，组级浅合并到基底包上，可只翻译关心的分组；函数型字段（如 selectRow / titleFormat）便于适配不同语序。',
        'en-US':
          ' accepts a partial locale pack grouped by component, shallow-merged group by group onto the base pack, so you only translate the groups you care about; function fields (e.g. selectRow / titleFormat) adapt to different word orders.',
      },
    },
  ],
];

/** 内置文案清单：列出 zh-CN 包原文，英文模式下附括号注释 */
const builtinItems: LText[] = [
  {
    'zh-CN': 'Modal：确认 / 取消；Popconfirm：确定 / 取消',
    'en-US': 'Modal: 确认 (OK) / 取消 (Cancel); Popconfirm: 确定 (Confirm) / 取消 (Cancel)',
  },
  {
    'zh-CN': 'Table：暂无数据、全选、选择第 N 行',
    'en-US': 'Table: 暂无数据 (No data), 全选 (Select all), 选择第 N 行 (Select row N)',
  },
  {
    'zh-CN': 'DatePicker：请选择日期、选择日期、上个月 / 下个月、YYYY 年 MM 月、日 一 二 … 六',
    'en-US':
      'DatePicker: 请选择日期 (placeholder), 选择日期 (panel title), 上个月 / 下个月 (prev / next month), YYYY 年 MM 月 (title format), 日 一 二 … 六 (weekdays)',
  },
  {
    'zh-CN': 'Select：请选择（触发器占位）、搜索...（搜索框占位与 aria）',
    'en-US': 'Select: 请选择 (trigger placeholder), 搜索... (search box placeholder and aria)',
  },
  {
    'zh-CN': 'Pagination：分页 / 上一页 / 下一页；Breadcrumb：面包屑；Skeleton：加载中',
    'en-US':
      'Pagination: 分页 (nav) / 上一页 (prev) / 下一页 (next); Breadcrumb: 面包屑 (nav); Skeleton: 加载中 (loading)',
  },
];

const demos: DemoDefinition[] = [
  {
    id: 'switch',
    title: {
      'zh-CN': '内置语言切换（setLocale）',
      'en-US': 'Built-in Locale Switching (setLocale)',
    },
    description: {
      'zh-CN':
        "setLocale('zh-CN' / 'en-US') 即时切换全部组件的内置文案：Modal 按钮、Table 空态与行选择提示、DatePicker 面板标题与星期等。",
      'en-US':
        "setLocale('zh-CN' / 'en-US') instantly switches the built-in messages of every component: Modal buttons, Table empty state and row selection hints, DatePicker panel titles and weekdays, etc.",
    },
    vueComponent: SwitchVue,
    reactComponent: SwitchReact,
    vueSource: switchVueSource,
    reactSource: switchReactSource,
  },
  {
    id: 'custom',
    title: {
      'zh-CN': '注册自定义语言包（registerLocale）',
      'en-US': 'Registering Custom Locales (registerLocale)',
    },
    description: {
      'zh-CN':
        'registerLocale 按组件分组注册任意语言（组级浅合并，未覆盖分组回退注册时的基底包），setLocale 切换后立即生效。',
      'en-US':
        'registerLocale registers any language grouped by component (shallow merge per group; uncovered groups fall back to the base pack at registration time) and takes effect immediately after setLocale switches to it.',
    },
    vueComponent: CustomVue,
    reactComponent: CustomReact,
    vueSource: customVueSource,
    reactSource: customReactSource,
  },
];

const api: ComponentMeta['api'] = {
  methods: [
    {
      name: 'setLocale',
      signature: '(locale: string) => void',
      description: {
        'zh-CN': '切换当前语言；未注册的语言名静默忽略，值未变化时同样静默返回',
        'en-US':
          'Switches the current locale; unregistered names are silently ignored, and unchanged values return silently',
      },
    },
    {
      name: 'getLocale',
      signature: '() => string',
      description: {
        'zh-CN': '读取当前语言名（默认 DEFAULT_LOCALE）',
        'en-US': 'Reads the current locale name (defaults to DEFAULT_LOCALE)',
      },
    },
    {
      name: 'getLocaleData',
      signature: '() => XuiLocaleData',
      description: {
        'zh-CN': '读取当前语言包（返回稳定引用，切换语言时重建）；SSR / 无 DOM 环境同样可用',
        'en-US':
          'Reads the current locale pack (stable reference, rebuilt on locale change); also safe in SSR / DOM-less environments',
      },
    },
    {
      name: 'registerLocale',
      signature: '(locale: string, data: XuiLocaleInput) => void',
      description: {
        'zh-CN':
          '注册或覆盖语言包：按组件分组浅合并到该语言的既有包上，未覆盖分组回退基底；无有效变更时不触发通知',
        'en-US':
          'Registers or overrides a locale pack: shallow-merged per component group onto the existing pack of that locale, with uncovered groups falling back to the base; no notification when nothing actually changes',
      },
    },
    {
      name: 'subscribeLocale',
      signature: '(listener: (locale: string) => void) => () => void',
      description: {
        'zh-CN': '订阅语言变化（回调收到新语言名），返回取消订阅函数',
        'en-US':
          'Subscribes to locale changes (the callback receives the new locale name); returns an unsubscribe function',
      },
    },
    {
      name: 'useLocaleData',
      signature: '() => XuiLocaleData',
      description: {
        'zh-CN':
          '双端组件级 Hook（Vue 组合式 / React useSyncExternalStore），组件内读取语言包并响应切换',
        'en-US':
          'Component-level hook for both frameworks (Vue composable / React useSyncExternalStore); reads the locale pack inside components and reacts to switches',
      },
    },
  ],
  types: [
    {
      name: 'XuiLocaleData',
      definition: `type XuiLocaleData = {
  modal: { ok: string; cancel: string };
  popconfirm: { confirm: string; cancel: string };
  table: { empty: string; selectAll: string; selectRow: (index: number) => string };
  pagination: { nav: string; prev: string; next: string };
  datePicker: {
    panel: string; prevMonth: string; nextMonth: string; placeholder: string;
    titleFormat: (year: number, month: number) => string; weekdays: string[];
  };
  skeleton: { loading: string };
  breadcrumb: { nav: string };
  select: { searchPlaceholder: string; searchAriaLabel: string; triggerPlaceholder: string };
};`,
      description: {
        'zh-CN': '完整语言包结构（按组件分组；函数型字段便于跨语序翻译）。',
        'en-US':
          'The full locale pack structure (grouped by component; function fields ease translation across word orders).',
      },
    },
    {
      name: 'XuiLocaleInput',
      definition: `type XuiLocaleInput = Partial<XuiLocaleData>;`,
      description: {
        'zh-CN': 'registerLocale 的入参：只提供需要覆盖的分组，组内字段同为部分覆盖（浅合并）。',
        'en-US':
          'The input of registerLocale: provide only the groups to override; fields within a group are also partially overridden (shallow merge).',
      },
    },
    {
      name: 'DEFAULT_LOCALE',
      definition: `const DEFAULT_LOCALE = 'zh-CN';`,
      description: {
        'zh-CN': '默认语言常量；内置 zh-CN / en-US 两套语言包。',
        'en-US': 'The default locale constant; zh-CN and en-US packs are built in.',
      },
    },
  ],
};

const notes: LText[] = [
  {
    'zh-CN':
      '默认语言为 zh-CN，内置文案与历史硬编码逐字一致，升级零行为变化；en-US 为内置英文包，均可通过 registerLocale 覆盖。',
    'en-US':
      'The default locale is zh-CN, with built-in messages identical to the historical hard-coded strings — zero behavior change on upgrade; en-US is built in as well, and both can be overridden via registerLocale.',
  },
  {
    'zh-CN':
      '组件显式传入的文案 prop（如 Modal 的 okText、Select 的 placeholder）永远优先于语言包；只有未提供时才回退语言包默认值。',
    'en-US':
      'Explicitly passed message props (e.g. Modal okText, Select placeholder) always take precedence over the locale pack; pack defaults apply only when a prop is not provided.',
  },
  {
    'zh-CN':
      '语言状态纯内存（不写 DOM），SSR 环境下所有 API 安全可用；切换语言即时通知全部已挂载组件重渲染，无需刷新。',
    'en-US':
      'Locale state is purely in-memory (no DOM writes), so all APIs are safe under SSR; switching the locale immediately re-renders every mounted component without a refresh.',
  },
  {
    'zh-CN':
      'registerLocale 采用组级浅合并：未覆盖的分组回退注册时的基底包；覆盖"当前语言"会立即重建缓存并通知，覆盖其他语言则静默生效到下次切换。',
    'en-US':
      'registerLocale merges shallowly per group: uncovered groups fall back to the base pack at registration time; overriding the current locale rebuilds the cache and notifies immediately, while overriding other locales applies silently until the next switch.',
  },
  {
    'zh-CN':
      '语言切换影响整个文档站演示区的所有组件示例，离开本页后语言状态仍保留，可在 demo 中一键回到中文。',
    'en-US':
      'Switching the locale affects every component demo on this site; the locale persists after leaving this page and can be reset to Chinese with one click inside the demo.',
  },
];
</script>

<template>
  <div class="docs-content">
    <header class="page-head">
      <h1 class="page-head__title">
        {{ isZh() ? '国际化' : 'Internationalization' }}
        <span class="page-head__en">{{ isZh() ? 'Internationalization' : '国际化' }}</span>
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
      <h2 class="docs-section-title">{{ t(pageText.builtinTitle) }}</h2>
      <ul class="docs-list">
        <li v-for="item in builtinItems" :key="item['zh-CN']">{{ t(item) }}</li>
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
