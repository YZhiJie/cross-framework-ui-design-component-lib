import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import OptionsVue from './demos/options.vue';
import UpdateVue from './demos/update.vue';
import BasicReact from './demos/basic';
import OptionsReact from './demos/options';
import UpdateReact from './demos/update';

import basicVueSource from './demos/basic.vue?raw';
import optionsVueSource from './demos/options.vue?raw';
import updateVueSource from './demos/update.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import optionsReactSource from './demos/options.tsx?raw';
import updateReactSource from './demos/update.tsx?raw';

export const messageMeta: ComponentMeta = {
  name: 'Message',
  slug: 'message',
  title: '全局提示',
  category: 'feedback',
  summary: {
    'zh-CN': '命令式全局轻提示，双端同构 API，首次调用自动挂载容器，无需预置组件。',
    'en-US':
      'Imperative global toast with an isomorphic API across frameworks; the container mounts automatically on first call, no host component needed.',
  },
  features: [
    {
      'zh-CN': '命令式 API：info / success / warning / error / open / closeAll，双端同构',
      'en-US':
        'Imperative API: info / success / warning / error / open / closeAll, isomorphic across frameworks',
    },
    {
      'zh-CN': '4 种语义类型，各配图标与色板，3s 自动关闭（duration 可配，0 为常驻）',
      'en-US':
        'Four semantic types with matching icons and palettes; auto-closes after 3s (duration configurable, 0 keeps it open)',
    },
    {
      'zh-CN': 'closable 手动关闭；open 返回 { close } 句柄，重复关闭幂等',
      'en-US':
        'closable enables manual close; open returns a { close } handle and repeated closes are idempotent',
    },
    {
      'zh-CN': 'maxCount（默认 5）同屏上限，超限自动移除最早一条',
      'en-US': 'maxCount (default 5) caps on-screen messages; the oldest is removed when exceeded',
    },
    {
      'zh-CN': 'key 更新语义：相同 key 再次 open 原地更新该条（不新增、重置计时），适合进度类反馈',
      'en-US':
        'key-based updates: calling open again with the same key updates that message in place (no new entry, timer resets), ideal for progress feedback',
    },
    {
      'zh-CN': 'onClose 回调：消息被移除（自动 / 手动 / 挤出 / closeAll）时触发',
      'en-US': 'onClose fires whenever a message is removed (auto / manual / evicted / closeAll)',
    },
    {
      'zh-CN': '首次调用惰性挂载全局容器（页面顶部居中 fixed），应用中无需声明任何宿主组件',
      'en-US':
        'The global container mounts lazily on first call (fixed, top-center); no host component needs to be declared',
    },
  ],
  scenarios: [
    {
      'zh-CN': '保存成功、请求失败、复制完成等不打断操作流程的轻量全局反馈。',
      'en-US':
        'Lightweight global feedback that does not interrupt the flow, such as save success, request failure, or copy completion.',
    },
    {
      'zh-CN': '上传 / 导出等耗时任务的进度反馈（配合 key 更新语义，始终只有一条消息）。',
      'en-US':
        'Progress feedback for long tasks like upload / export (with key-based updates, always a single message).',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '四种语义类型', 'en-US': 'Four Semantic Types' },
      description: {
        'zh-CN': '直接从框架包导入 message 单例调用，容器首次调用时自动挂载。',
        'en-US':
          'Import the message singleton from the framework package and call it directly; the container mounts on first call.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'options',
      title: { 'zh-CN': '常驻与关闭全部', 'en-US': 'Persistent & Close All' },
      description: {
        'zh-CN': 'duration: 0 时不自动关闭；closeAll 清空当前所有消息及其定时器。',
        'en-US':
          'duration: 0 disables auto-close; closeAll clears all current messages and their timers.',
      },
      vueComponent: OptionsVue,
      reactComponent: OptionsReact,
      vueSource: optionsVueSource,
      reactSource: optionsReactSource,
    },
    {
      id: 'update',
      title: { 'zh-CN': 'key 更新与 onClose', 'en-US': 'key Updates & onClose' },
      description: {
        'zh-CN': '同 key 反复 open 原地刷新进度；消息关闭时触发 onClose 回调。',
        'en-US':
          'Repeated open calls with the same key refresh progress in place; onClose fires when the message closes.',
      },
      vueComponent: UpdateVue,
      reactComponent: UpdateReact,
      vueSource: updateVueSource,
      reactSource: updateReactSource,
    },
  ],
  api: {
    methods: [
      {
        name: 'message.info',
        signature: '(content: string, options?: MessageShortOptions) => MessageHandle',
        description: { 'zh-CN': '打开 info 消息', 'en-US': 'Open an info message' },
      },
      {
        name: 'message.success',
        signature: '(content: string, options?: MessageShortOptions) => MessageHandle',
        description: { 'zh-CN': '打开 success 消息', 'en-US': 'Open a success message' },
      },
      {
        name: 'message.warning',
        signature: '(content: string, options?: MessageShortOptions) => MessageHandle',
        description: { 'zh-CN': '打开 warning 消息', 'en-US': 'Open a warning message' },
      },
      {
        name: 'message.error',
        signature: '(content: string, options?: MessageShortOptions) => MessageHandle',
        description: { 'zh-CN': '打开 error 消息', 'en-US': 'Open an error message' },
      },
      {
        name: 'message.open',
        signature: '(options: MessageOptions) => MessageHandle',
        description: {
          'zh-CN': '按完整选项打开消息（支持 key / onClose）',
          'en-US': 'Open a message with full options (supports key / onClose)',
        },
      },
      {
        name: 'message.closeAll',
        signature: '() => void',
        description: { 'zh-CN': '关闭全部消息', 'en-US': 'Close all messages' },
      },
    ],
    types: [
      {
        name: 'MessageOptions',
        definition: `type MessageOptions = {
  type?: 'info' | 'success' | 'warning' | 'error'; // 默认 'info'
  content: string;        // 必填
  duration?: number;      // 默认 3000，0 表示不自动关闭
  closable?: boolean;     // 默认 false
  icon?: string;          // 自定义类型图标（内层 SVG 标记，与 @xui-design/icons 数据源同构）
  key?: string | number;  // 更新键：同 key 再次 open 原地更新该条
  onClose?: () => void;   // 消息移除回调
};`,
        description: {
          'zh-CN':
            'open 的完整参数；快捷方法的第二参仅支持 duration / closable（type 与 content 由方法注入，key / onClose 需走 message.open）。',
          'en-US':
            'Full options for open; shortcut methods only accept duration / closable as the second argument (type and content are injected by the method; key / onClose require message.open).',
        },
      },
      {
        name: 'MessageHandle',
        definition: `type MessageHandle = {
  close: () => void;
};`,
        description: {
          'zh-CN': 'open / 快捷方法返回的句柄，close() 手动关闭且幂等。',
          'en-US':
            'Handle returned by open / shortcut methods; close() closes manually and is idempotent.',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        'Message 是命令式 API 而非声明式组件：双端均未导出 Message 组件，也不进 contract-test 声明式校验矩阵。',
      'en-US':
        'Message is an imperative API, not a declarative component: neither framework exports a Message component, and it is excluded from the declarative contract-test matrix.',
    },
    {
      'zh-CN':
        'Vue 与 React 各自导出独立的 message 单例（@xui-design/vue / @xui-design/react），在对应框架入口直接调用即可。',
      'en-US':
        'Vue and React each export their own message singleton (@xui-design/vue / @xui-design/react); call it directly from the corresponding framework entry.',
    },
    {
      'zh-CN': 'maxCount 超限时连带移除最早消息的自动关闭定时器；closeAll 同时清空全部定时器。',
      'en-US':
        'When maxCount is exceeded, the oldest message is removed along with its auto-close timer; closeAll clears all timers.',
    },
    {
      'zh-CN':
        'key 更新：content 必填刷新，type / closable 未传保留原值；duration 以最新值重置计时，onClose 传入时替换旧回调。',
      'en-US':
        'key updates: content is required and always refreshed; type / closable keep their previous values when omitted; duration resets the timer with the latest value; onClose replaces the old callback when provided.',
    },
    {
      'zh-CN': 'onClose 触发时机统一：自动关闭 / 手动关闭 / maxCount 挤出 / closeAll 均触发。',
      'en-US':
        'onClose fires consistently for auto-close / manual close / maxCount eviction / closeAll.',
    },
    {
      'zh-CN':
        'icon 选项传内层 SVG 标记（不含 <svg> 壳，如 icons.close 的值），渲染时替换按 type 的内置图标。',
      'en-US':
        'The icon option takes inner SVG markup (without the <svg> wrapper, e.g. the value of icons.close), replacing the built-in type icon at render.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '消息容器 aria-live="polite"，新消息出现时读屏播报但不打断当前朗读；关闭按钮携带 aria-label。',
      'en-US':
        'The message container uses aria-live="polite" so screen readers announce new messages without interrupting the current reading; the close button carries an aria-label.',
    },
  ],
};
