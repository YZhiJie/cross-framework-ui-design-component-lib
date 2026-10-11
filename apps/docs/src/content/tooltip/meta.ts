import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import TriggerVue from './demos/trigger.vue';
import BasicReact from './demos/basic';
import TriggerReact from './demos/trigger';

import basicVueSource from './demos/basic.vue?raw';
import triggerVueSource from './demos/trigger.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import triggerReactSource from './demos/trigger.tsx?raw';

export const tooltipMeta: ComponentMeta = {
  name: 'Tooltip',
  slug: 'tooltip',
  title: '文字提示',
  category: 'feedback',
  summary: '鼠标悬停或聚焦时展示的简单文字气泡，CSS 包裹定位（非 portal），支持四方位与两种触发。',
  features: [
    'placement 支持 top / bottom / left / right 四个方位',
    'trigger 支持 hover（默认）与 focus；disabled 后不再响应触发',
    'content 属性或 content 插槽 / renderContent 自定义提示内容',
  ],
  scenarios: ['图标按钮说明、字段含义解释、快捷操作提示等轻量辅助说明场景。'],
  demos: [
    {
      id: 'basic',
      title: '四个方位',
      description: '鼠标悬停（或键盘聚焦）触发元素查看对应方位的气泡。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'trigger',
      title: 'focus 触发与禁用',
      description: 'trigger="focus" 适合输入框；disabled 完全关闭提示能力。',
      vueComponent: TriggerVue,
      reactComponent: TriggerReact,
      vueSource: triggerVueSource,
      reactSource: triggerReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'content',
        type: 'string',
        default: '—',
        description: '提示内容（content 插槽 / renderContent 优先）',
      },
      {
        name: 'placement',
        type: `'top' | 'bottom' | 'left' | 'right'`,
        default: `'top'`,
        description: '弹出位置',
      },
      { name: 'trigger', type: `'hover' | 'focus'`, default: `'hover'`, description: '触发方式' },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: '禁用状态（禁用后不响应触发）',
      },
      { name: 'className', type: 'string', default: '—', description: '附加到根节点的自定义类名' },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: '附加到根节点的自定义样式',
      },
    ],
    slots: [
      { vue: 'default', react: 'children', description: '触发元素' },
      { vue: 'content', react: 'renderContent', description: '提示内容（优先于 content prop）' },
    ],
  },
  notes: [
    '气泡采用 CSS 包裹定位而非 portal，父容器存在 overflow: hidden 时可能被裁剪，布局时需留意。',
    '自带视口避让：首选方位空间不足时自动翻转到对侧，横向 / 纵向溢出视口边缘时自动钳制，滚动与窗口 resize 时实时重算。',
  ],
  a11y: [
    'focus 触发天然支持键盘；hover 触发元素同样可聚焦，提示与触发元素通过 aria-describedby 关联。',
  ],
};
