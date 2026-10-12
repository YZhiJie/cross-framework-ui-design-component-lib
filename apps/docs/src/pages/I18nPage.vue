<script setup lang="ts">
/**
 * 国际化指南页：内置语言包 / setLocale 切换 / registerLocale 扩展
 * 独立于组件文档页，走 /i18n 路由
 */
import DemoBlock from '../components/DemoBlock.vue';
import ApiSection from '../components/ApiSection.vue';

import SwitchVue from '../content/i18n/demos/switch.vue';
import SwitchReact from '../content/i18n/demos/switch';
import CustomVue from '../content/i18n/demos/custom.vue';
import CustomReact from '../content/i18n/demos/custom';

import switchVueSource from '../content/i18n/demos/switch.vue?raw';
import switchReactSource from '../content/i18n/demos/switch.tsx?raw';
import customVueSource from '../content/i18n/demos/custom.vue?raw';
import customReactSource from '../content/i18n/demos/custom.tsx?raw';

const demos = [
  {
    id: 'switch',
    title: '内置语言切换（setLocale）',
    description:
      "setLocale('zh-CN' / 'en-US') 即时切换全部组件的内置文案：Modal 按钮、Table 空态与行选择提示、DatePicker 面板标题与星期等。",
    vueComponent: SwitchVue,
    reactComponent: SwitchReact,
    vueSource: switchVueSource,
    reactSource: switchReactSource,
  },
  {
    id: 'custom',
    title: '注册自定义语言包（registerLocale）',
    description:
      'registerLocale 按组件分组注册任意语言（组级浅合并，未覆盖分组回退注册时的基底包），setLocale 切换后立即生效。',
    vueComponent: CustomVue,
    reactComponent: CustomReact,
    vueSource: customVueSource,
    reactSource: customReactSource,
  },
];

const api = {
  methods: [
    {
      name: 'setLocale',
      signature: '(locale: string) => void',
      description: '切换当前语言；未注册的语言名静默忽略，值未变化时同样静默返回',
    },
    {
      name: 'getLocale',
      signature: '() => string',
      description: '读取当前语言名（默认 DEFAULT_LOCALE）',
    },
    {
      name: 'getLocaleData',
      signature: '() => XuiLocaleData',
      description: '读取当前语言包（返回稳定引用，切换语言时重建）；SSR / 无 DOM 环境同样可用',
    },
    {
      name: 'registerLocale',
      signature: '(locale: string, data: XuiLocaleInput) => void',
      description:
        '注册或覆盖语言包：按组件分组浅合并到该语言的既有包上，未覆盖分组回退基底；无有效变更时不触发通知',
    },
    {
      name: 'subscribeLocale',
      signature: '(listener: (locale: string) => void) => () => void',
      description: '订阅语言变化（回调收到新语言名），返回取消订阅函数',
    },
    {
      name: 'useLocaleData',
      signature: '() => XuiLocaleData',
      description:
        '双端组件级 Hook（Vue 组合式 / React useSyncExternalStore），组件内读取语言包并响应切换',
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
      description: '完整语言包结构（按组件分组；函数型字段便于跨语序翻译）。',
    },
    {
      name: 'XuiLocaleInput',
      definition: `type XuiLocaleInput = Partial<XuiLocaleData>;`,
      description: 'registerLocale 的入参：只提供需要覆盖的分组，组内字段同为部分覆盖（浅合并）。',
    },
    {
      name: 'DEFAULT_LOCALE',
      definition: `const DEFAULT_LOCALE = 'zh-CN';`,
      description: '默认语言常量；内置 zh-CN / en-US 两套语言包。',
    },
  ],
};

const notes = [
  '默认语言为 zh-CN，内置文案与历史硬编码逐字一致，升级零行为变化；en-US 为内置英文包，均可通过 registerLocale 覆盖。',
  '组件显式传入的文案 prop（如 Modal 的 okText、Select 的 placeholder）永远优先于语言包；只有未提供时才回退语言包默认值。',
  '语言状态纯内存（不写 DOM），SSR 环境下所有 API 安全可用；切换语言即时通知全部已挂载组件重渲染，无需刷新。',
  'registerLocale 采用组级浅合并：未覆盖的分组回退注册时的基底包；覆盖"当前语言"会立即重建缓存并通知，覆盖其他语言则静默生效到下次切换。',
  '语言切换影响整个文档站演示区的所有组件示例，离开本页后语言状态仍保留，可在 demo 中一键回到中文。',
];
</script>

<template>
  <div class="docs-content">
    <header class="page-head">
      <h1 class="page-head__title">
        国际化
        <span class="page-head__en">Internationalization</span>
        <span class="doc-tag">指南</span>
      </h1>
      <p class="page-head__summary">
        组件库内置中文（zh-CN）与英文（en-US）语言包：setLocale 一行切换全部组件文案，
        registerLocale 支持扩展任意语言，双端（@xui-design/vue / @xui-design/react）共享同一套运行时 API。
      </p>
    </header>

    <section>
      <h2 class="docs-section-title">工作机制</h2>
      <ul class="docs-list">
        <li>
          <strong>文案分层</strong>：组件内置文案（Modal 按钮文本、Table 空态、DatePicker
          面板标题与星期、 Pagination / Breadcrumb / Skeleton / Select 的 aria
          与占位符）统一从全局语言包读取； 用户显式传入的文案 prop 始终优先。
        </li>
        <li>
          <strong>响应式切换</strong>：<code class="inline-code">setLocale</code>
          通知所有订阅组件重渲染， Vue 端经
          <code class="inline-code">useLocaleData</code> 组合式函数、React 端经
          <code class="inline-code">useSyncExternalStore</code> 同步，已挂载组件即时更新。
        </li>
        <li>
          <strong>扩展语言</strong>：<code class="inline-code">registerLocale</code>
          以组件分组提供部分语言包， 组级浅合并到基底包上，可只翻译关心的分组；函数型字段（如
          selectRow / titleFormat）便于适配不同语序。
        </li>
      </ul>
    </section>

    <section>
      <h2 class="docs-section-title">内置文案清单（zh-CN）</h2>
      <ul class="docs-list">
        <li>Modal：确认 / 取消；Popconfirm：确定 / 取消</li>
        <li>Table：暂无数据、全选、选择第 N 行</li>
        <li>DatePicker：请选择日期、选择日期、上个月 / 下个月、YYYY 年 MM 月、日 一 二 … 六</li>
        <li>Select：请选择（触发器占位）、搜索...（搜索框占位与 aria）</li>
        <li>Pagination：分页 / 上一页 / 下一页；Breadcrumb：面包屑；Skeleton：加载中</li>
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
        国际化 API 由 <code class="inline-code">@xui-design/shared</code> 提供（框架无关实现），
        <code class="inline-code">@xui-design/vue</code> 与
        <code class="inline-code">@xui-design/react</code> 同名导出，行为完全一致。
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
