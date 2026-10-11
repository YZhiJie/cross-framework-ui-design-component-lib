import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import VariantsVue from './demos/variants.vue';
import BasicReact from './demos/basic';
import VariantsReact from './demos/variants';

import basicVueSource from './demos/basic.vue?raw';
import variantsVueSource from './demos/variants.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import variantsReactSource from './demos/variants.tsx?raw';

export const paginationMeta: ComponentMeta = {
  name: 'Pagination',
  slug: 'pagination',
  title: '分页',
  category: 'navigation',
  summary: '数据分页导航，页码从 1 开始，自动计算总页数并收敛越界操作。',
  features: [
    '受控 value / 非受控 defaultValue，页码从 1 开始，Vue 端支持 v-model:value',
    'total 总条数 + pageSize 每页条数（默认 10）自动计算总页数',
    '上一页 / 下一页在边界自动 no-op，越界页码自动 clamp',
    'disabled 禁用整个分页器',
  ],
  scenarios: ['长列表 / 表格 / 搜索结果等数据量较大需要分页浏览的场景。'],
  demos: [
    {
      id: 'basic',
      title: '受控分页',
      description: '285 条数据、每页 10 条共 29 页，外部同步当前页码。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'variants',
      title: '每页条数与禁用',
      description: 'pageSize 改变分页粒度；disabled 下所有翻页操作无效。',
      vueComponent: VariantsVue,
      reactComponent: VariantsReact,
      vueSource: variantsVueSource,
      reactSource: variantsReactSource,
    },
  ],
  api: {
    props: [
      { name: 'value', type: 'number', default: '—', description: '受控当前页（从 1 开始）' },
      { name: 'defaultValue', type: 'number', default: '1', description: '非受控初始页码' },
      { name: 'total', type: 'number', default: '—', required: true, description: '数据总条数' },
      { name: 'pageSize', type: 'number', default: '10', description: '每页条数' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      {
        name: 'onChange',
        type: '(page: number) => void',
        default: '—',
        description: '页码变更回调',
      },
      { name: 'className', type: 'string', default: '—', description: '附加到根节点的自定义类名' },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: '附加到根节点的自定义样式',
      },
    ],
    events: [
      { vue: 'change', react: 'onChange', payload: 'page: number', description: '页码变更' },
      { vue: 'update:value', react: '—', payload: 'number', description: 'v-model:value 回写' },
    ],
  },
  notes: [
    '当前页超出总页数时（如 total 变小）会自动 clamp 到有效范围并触发一次 change。',
    'total 变化后总页数自动重算，无需外部维护页数。',
  ],
  a11y: ['导航区域具备分页语义，页码按钮可键盘聚焦，当前页携带 aria-current，边界按钮自动禁用。'],
};
