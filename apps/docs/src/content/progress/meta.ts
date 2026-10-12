import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StatusVue from './demos/status.vue';
import BasicReact from './demos/basic';
import StatusReact from './demos/status';

import basicVueSource from './demos/basic.vue?raw';
import statusVueSource from './demos/status.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import statusReactSource from './demos/status.tsx?raw';

export const progressMeta: ComponentMeta = {
  name: 'Progress',
  slug: 'progress',
  title: '进度条',
  category: 'display',
  summary: {
    'zh-CN': '展示任务进度百分比，支持线性与环形两种形态及成功 / 失败状态色。',
    'en-US':
      'Displays task progress as a percentage, in linear or circular form, with success / error status colors.',
  },
  features: [
    {
      'zh-CN': "type 支持 'line' 线性与 'circle' 环形（SVG 描边）",
      'en-US': "type supports 'line' (linear) and 'circle' (circular, SVG stroke)",
    },
    {
      'zh-CN': 'percent 自动收敛到 [0, 100]，非数值按 0 处理',
      'en-US': 'percent is clamped to [0, 100] automatically; non-numeric input is treated as 0',
    },
    {
      'zh-CN':
        'status 支持 normal / success / error；percent 达到 100 且未显式指定时自动派生 success',
      'en-US':
        'status supports normal / success / error; success is derived automatically when percent reaches 100 and no status is set explicitly',
    },
    {
      'zh-CN': 'strokeWidth 自定义条粗 / 描边宽度，showText 控制百分比文本',
      'en-US':
        'strokeWidth customizes the bar / stroke width; showText toggles the percentage text',
    },
  ],
  scenarios: [
    {
      'zh-CN': '文件上传 / 下载、任务处理进度、加载完成度展示等场景。',
      'en-US':
        'File upload / download, task processing progress, loading completion display, and more.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '线性与环形', 'en-US': 'Line & Circle' },
      description: {
        'zh-CN': '同一百分比驱动 line 与 circle 两种形态，按钮模拟进度变化。',
        'en-US':
          'One percentage drives both the line and circle forms; buttons simulate progress changes.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'status',
      title: { 'zh-CN': '成功与失败状态', 'en-US': 'Success & Error States' },
      description: {
        'zh-CN': '100% 默认派生 success；显式 status="error" 显示失败色。',
        'en-US':
          '100% derives success by default; an explicit status="error" shows the error color.',
      },
      vueComponent: StatusVue,
      reactComponent: StatusReact,
      vueSource: statusVueSource,
      reactSource: statusReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'percent',
        type: 'number',
        default: '0',
        description: {
          'zh-CN': '进度百分比（0-100，越界自动收敛）',
          'en-US': 'Progress percentage (0-100; out-of-range values are clamped)',
        },
      },
      {
        name: 'type',
        type: `'line' | 'circle'`,
        default: `'line'`,
        description: { 'zh-CN': '进度条类型', 'en-US': 'Progress bar type' },
      },
      {
        name: 'strokeWidth',
        type: 'number',
        default: '6',
        description: {
          'zh-CN': '条粗（px）；circle 类型为 SVG 描边宽度',
          'en-US': 'Bar thickness (px); the SVG stroke width for the circle type',
        },
      },
      {
        name: 'showText',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '是否显示百分比文本',
          'en-US': 'Whether to show the percentage text',
        },
      },
      {
        name: 'status',
        type: `'normal' | 'success' | 'error'`,
        default: `'normal'`,
        description: {
          'zh-CN': '进度状态（100% 自动派生 success）',
          'en-US': 'Progress status (success is derived automatically at 100%)',
        },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的自定义类名',
          'en-US': 'Custom class name appended to the root element',
        },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的自定义样式',
          'en-US': 'Custom styles appended to the root element',
        },
      },
    ],
    types: [
      {
        name: 'ProgressStatus',
        definition: `type ProgressType = 'line' | 'circle'
type ProgressStatus = 'normal' | 'success' | 'error'`,
        description: {
          'zh-CN': '进度条形态与状态枚举。',
          'en-US': 'Enums of the progress form and status.',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '纯展示组件，无事件；达到 100% 时若未显式传入 status，颜色自动切换为成功色。',
      'en-US':
        'A purely presentational component with no events; at 100% the color switches to the success color unless status is passed explicitly.',
    },
  ],
  a11y: [
    {
      'zh-CN': '进度根节点携带进度百分比语义（role="progressbar" 及 aria-valuenow / min / max）。',
      'en-US':
        'The root element carries progress semantics (role="progressbar" with aria-valuenow / min / max).',
    },
  ],
};
