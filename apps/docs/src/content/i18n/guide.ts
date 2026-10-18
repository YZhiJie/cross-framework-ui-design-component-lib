/**
 * 「国际化」指南页数据：双端 demo 装配 + API 表格数据
 * 展示文案保持 LText 双语结构，由 DemoBlock / ApiSection 渲染层取值
 */
import type { ComponentMeta, DemoDefinition } from '../types';

import SwitchVue from './demos/switch.vue';
import SwitchReact from './demos/switch';
import CustomVue from './demos/custom.vue';
import CustomReact from './demos/custom';

import switchVueSource from './demos/switch.vue?raw';
import switchReactSource from './demos/switch.tsx?raw';
import customVueSource from './demos/custom.vue?raw';
import customReactSource from './demos/custom.tsx?raw';

export const i18nGuideDemos: DemoDefinition[] = [
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

export const i18nGuideApi: ComponentMeta['api'] = {
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
    confirm: string; cancel: string;
  };
  skeleton: { loading: string };
  breadcrumb: { nav: string };
  select: { searchPlaceholder: string; searchAriaLabel: string; triggerPlaceholder: string };
  timePicker: { panel: string; placeholder: string; confirm: string; cancel: string };
  cascader: { panel: string; placeholder: string };
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
