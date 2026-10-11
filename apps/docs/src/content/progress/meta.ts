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
  summary: '展示任务进度百分比，支持线性与环形两种形态及成功 / 失败状态色。',
  features: [
    "type 支持 'line' 线性与 'circle' 环形（SVG 描边）",
    'percent 自动收敛到 [0, 100]，非数值按 0 处理',
    'status 支持 normal / success / error；percent 达到 100 且未显式指定时自动派生 success',
    'strokeWidth 自定义条粗 / 描边宽度，showText 控制百分比文本',
  ],
  scenarios: ['文件上传 / 下载、任务处理进度、加载完成度展示等场景。'],
  demos: [
    {
      id: 'basic',
      title: '线性与环形',
      description: '同一百分比驱动 line 与 circle 两种形态，按钮模拟进度变化。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'status',
      title: '成功与失败状态',
      description: '100% 默认派生 success；显式 status="error" 显示失败色。',
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
        description: '进度百分比（0-100，越界自动收敛）',
      },
      { name: 'type', type: `'line' | 'circle'`, default: `'line'`, description: '进度条类型' },
      {
        name: 'strokeWidth',
        type: 'number',
        default: '6',
        description: '条粗（px）；circle 类型为 SVG 描边宽度',
      },
      { name: 'showText', type: 'boolean', default: 'true', description: '是否显示百分比文本' },
      {
        name: 'status',
        type: `'normal' | 'success' | 'error'`,
        default: `'normal'`,
        description: '进度状态（100% 自动派生 success）',
      },
    ],
    types: [
      {
        name: 'ProgressStatus',
        definition: `type ProgressType = 'line' | 'circle'
type ProgressStatus = 'normal' | 'success' | 'error'`,
        description: '进度条形态与状态枚举。',
      },
    ],
  },
  notes: ['纯展示组件，无事件；达到 100% 时若未显式传入 status，颜色自动切换为成功色。'],
  a11y: ['进度根节点携带进度百分比语义（role="progressbar" 及 aria-valuenow / min / max）。'],
};
