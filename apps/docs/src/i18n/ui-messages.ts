/**
 * 文档站 UI 框架文案字典（zh-CN / en-US）
 *
 * 覆盖：侧边导航 / 顶部栏 / 组件页模板 / DemoBlock / ApiSection / TOC / 首页 / 缺省页。
 * 组件 meta 与指南页内容不在这里——meta.ts 内联 LText，指南页各自维护文案。
 */
import { computed, type ComputedRef } from 'vue';
import { docsLocale } from './index';

export interface UiMessages {
  nav: {
    start: string;
    intro: string;
    theme: string;
    i18n: string;
    floating: string;
    soon: string;
  };
  topbar: {
    light: string;
    dark: string;
    system: string;
    switchLang: string;
  };
  component: {
    features: string;
    scenarios: string;
    demos: string;
    demosHint: string;
    api: string;
    notes: string;
    a11y: string;
    notFoundTitle: string;
    notFoundDesc: string;
    backHome: string;
  };
  demo: {
    showCode: string;
    hideCode: string;
  };
  code: {
    copy: string;
    copied: string;
  };
  api: {
    prop: string;
    type: string;
    default: string;
    description: string;
    required: string;
    eventsTitle: string;
    vueEvent: string;
    reactCallback: string;
    payload: string;
    slotsTitle: string;
    vueSlot: string;
    methodsTitle: string;
    method: string;
    signature: string;
    typesTitle: string;
  };
  toc: {
    title: string;
  };
  home: {
    heroDesc: string;
    onlineBadge: string;
    featuresTitle: string;
    installTitle: string;
    quickStartTitle: string;
    overviewTitle: string;
    features: { title: string; desc: string }[];
    installCoreComment: string;
    installStyleComment: string;
    pendingDesc: string;
  };
}

const zhCN: UiMessages = {
  nav: {
    start: '开始',
    intro: '介绍',
    theme: '主题定制',
    i18n: '国际化',
    floating: '浮层视口避让',
    soon: '待补充',
  },
  topbar: {
    light: '明亮',
    dark: '暗黑',
    system: '跟随系统',
    switchLang: 'English',
  },
  component: {
    features: '功能特性',
    scenarios: '使用场景',
    demos: '代码演示',
    demosHint: '每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。',
    api: 'API 文档',
    notes: '注意事项',
    a11y: '无障碍',
    notFoundTitle: '该组件文档尚未上线',
    notFoundDesc: '组件已在规划清单中，文档正在陆续补充。',
    backHome: '返回首页',
  },
  demo: {
    showCode: '查看代码',
    hideCode: '隐藏代码',
  },
  code: {
    copy: '复制',
    copied: '已复制',
  },
  api: {
    prop: '属性',
    type: '类型',
    default: '默认值',
    description: '说明',
    required: '必填',
    eventsTitle: 'Events / 回调',
    vueEvent: 'Events（Vue）',
    reactCallback: '回调（React）',
    payload: '载荷',
    slotsTitle: 'Slots / 渲染回调',
    vueSlot: '插槽（Vue）',
    methodsTitle: '命令式方法',
    method: '方法',
    signature: '签名',
    typesTitle: '契约类型',
  },
  toc: {
    title: '目录',
  },
  home: {
    heroDesc: '一套核心契约，Vue 3 与 React 19 双端同构的通用组件库',
    onlineBadge: '组件文档已上线',
    featuresTitle: '特性',
    installTitle: '安装',
    quickStartTitle: '快速开始',
    overviewTitle: '组件总览',
    features: [
      {
        title: '单一契约 @xui-design/core',
        desc: 'ComponentSpec 是双端唯一合同，Props / Events / Slots 由契约层定义，适配层不得新增分歧。',
      },
      {
        title: 'Vue / React 双端同构',
        desc: '同名组件、同 API 口径：Vue 事件 ↔ React 回调、Vue 插槽 ↔ React renderXxx 一一映射。',
      },
      {
        title: '样式单一来源',
        desc: '@xui-design/styles 统一输出 BEM 类名与 CSS 变量主题，双端零样式漂移。',
      },
      {
        title: '核心逻辑单份实现',
        desc: '@xui-design/shared 承载状态与交互逻辑，双端只做薄适配；TypeScript 严格模式全量类型贯通。',
      },
    ],
    installCoreComment: '# 如需直接引用契约类型（TableColumn 等），再安装类型包',
    installStyleComment: '# 应用入口引入一次样式',
    pendingDesc: '文档建设中',
  },
};

const enUS: UiMessages = {
  nav: {
    start: 'Getting Started',
    intro: 'Introduction',
    theme: 'Theming',
    i18n: 'Internationalization',
    floating: 'Floating Positioning',
    soon: 'Soon',
  },
  topbar: {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    switchLang: '中文',
  },
  component: {
    features: 'Features',
    scenarios: 'When to Use',
    demos: 'Examples',
    demosHint:
      'Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.',
    api: 'API',
    notes: 'Notes',
    a11y: 'Accessibility',
    notFoundTitle: 'Documentation for this component is not available yet',
    notFoundDesc:
      'The component is on the roadmap and its documentation is being actively written.',
    backHome: 'Back to Home',
  },
  demo: {
    showCode: 'Show Code',
    hideCode: 'Hide Code',
  },
  code: {
    copy: 'Copy',
    copied: 'Copied',
  },
  api: {
    prop: 'Prop',
    type: 'Type',
    default: 'Default',
    description: 'Description',
    required: 'Required',
    eventsTitle: 'Events / Callbacks',
    vueEvent: 'Event (Vue)',
    reactCallback: 'Callback (React)',
    payload: 'Payload',
    slotsTitle: 'Slots / Render Callbacks',
    vueSlot: 'Slot (Vue)',
    methodsTitle: 'Imperative Methods',
    method: 'Method',
    signature: 'Signature',
    typesTitle: 'Contract Types',
  },
  toc: {
    title: 'On this page',
  },
  home: {
    heroDesc:
      'A universal component library with a single core contract, isomorphic across Vue 3 and React 19',
    onlineBadge: 'component docs available',
    featuresTitle: 'Features',
    installTitle: 'Installation',
    quickStartTitle: 'Quick Start',
    overviewTitle: 'Components Overview',
    features: [
      {
        title: 'Single Contract @xui-design/core',
        desc: 'ComponentSpec is the only contract for both frameworks. Props / Events / Slots are defined at the contract layer; adapters must not diverge.',
      },
      {
        title: 'Isomorphic Vue / React',
        desc: 'Same components, same API surface: Vue events map to React callbacks, Vue slots map to React renderXxx props one by one.',
      },
      {
        title: 'Single Source of Styles',
        desc: '@xui-design/styles ships unified BEM class names and CSS variable theming — zero style drift across frameworks.',
      },
      {
        title: 'Single Core Logic Implementation',
        desc: '@xui-design/shared holds state and interaction logic; both adapters stay thin. Fully typed under TypeScript strict mode.',
      },
    ],
    installCoreComment: '# Install the types package if you need contract types (e.g. TableColumn)',
    installStyleComment: '# Import styles once in your app entry',
    pendingDesc: 'Docs in progress',
  },
};

/**
 * 语言 → 文案映射（生成器等 Node 端工具可直接取值，无需 Vue 上下文）
 *
 * @public 由 gen-component-docs.ts 动态导入使用，静态分析无法解析
 */
export const messagesMap: Record<'zh-CN' | 'en-US', UiMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

/** 当前语言的 UI 文案（响应式） */
export const useUiMessages = (): ComputedRef<UiMessages> =>
  computed(() => messagesMap[docsLocale.locale]);
