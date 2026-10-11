import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import VariantsVue from './demos/variants.vue';
import BasicReact from './demos/basic';
import VariantsReact from './demos/variants';

import basicVueSource from './demos/basic.vue?raw';
import variantsVueSource from './demos/variants.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import variantsReactSource from './demos/variants.tsx?raw';

export const skeletonMeta: ComponentMeta = {
  name: 'Skeleton',
  slug: 'skeleton',
  title: '骨架屏',
  category: 'display',
  summary: '数据加载中的占位屏，在内容就绪前提供结构感知，支持头像占位与自定义行数。',
  features: [
    'loading 控制骨架 / 真实内容切换，false 时渲染默认插槽内容',
    'avatar 显示头部头像占位，rows 配置段落行数（收敛为正整数，默认 3）',
  ],
  scenarios: ['卡片 / 列表 / 详情页首次加载、弱网等待数据等场景。'],
  demos: [
    {
      id: 'basic',
      title: '加载切换',
      description: 'loading=true 显示骨架，false 渲染插槽中的真实内容。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'variants',
      title: '头像占位与行数',
      description: 'avatar 渲染圆形头像占位；rows 控制文本段落条数。',
      vueComponent: VariantsVue,
      reactComponent: VariantsReact,
      vueSource: variantsVueSource,
      reactSource: variantsReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'loading',
        type: 'boolean',
        default: 'true',
        description: '加载中状态（true 渲染骨架，false 渲染插槽内容）',
      },
      { name: 'avatar', type: 'boolean', default: 'false', description: '是否显示头部头像占位' },
      { name: 'rows', type: 'number', default: '3', description: '段落行数（收敛为正整数）' },
    ],
    slots: [{ vue: 'default', react: 'children', description: '真实内容（loading=false 时渲染）' }],
  },
  notes: ['rows 传入 0 或负数等非法值会收敛为 1，保证至少渲染一行。'],
  a11y: ['骨架区域标记为忙碌状态（aria-busy），读屏可感知内容正在加载。'],
};
