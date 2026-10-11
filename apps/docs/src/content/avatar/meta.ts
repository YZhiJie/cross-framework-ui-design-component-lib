import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import ShapeVue from './demos/shape.vue';
import BasicReact from './demos/basic';
import ShapeReact from './demos/shape';

import basicVueSource from './demos/basic.vue?raw';
import shapeVueSource from './demos/shape.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import shapeReactSource from './demos/shape.tsx?raw';

export const avatarMeta: ComponentMeta = {
  name: 'Avatar',
  slug: 'avatar',
  title: '头像',
  category: 'display',
  summary: '展示用户或事物的图片 / 文字头像，支持三种尺寸、圆形方形与图片失败回退。',
  features: [
    'size 支持 sm / md / lg，shape 支持 circle / square',
    '内容优先级：加载成功的图片 ＞ 默认插槽 / children（文字图标）＞ 默认图标',
    'src 加载失败自动回退并触发 error 事件',
  ],
  scenarios: ['用户信息、评论列表、导航栏账号入口等需要形象标识的场景。'],
  demos: [
    {
      id: 'basic',
      title: '图片 / 文字 / 尺寸',
      description: 'src 为图片地址；无图时显示插槽文字；size 控制三档尺寸。',
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'shape',
      title: '形状与失败回退',
      description: 'shape 切换方形 / 圆形；图片加载失败时回退为插槽内容或默认图标。',
      vueComponent: ShapeVue,
      reactComponent: ShapeReact,
      vueSource: shapeVueSource,
      reactSource: shapeReactSource,
    },
  ],
  api: {
    props: [
      { name: 'size', type: `'sm' | 'md' | 'lg'`, default: `'md'`, description: '头像尺寸' },
      { name: 'shape', type: `'circle' | 'square'`, default: `'circle'`, description: '头像形状' },
      {
        name: 'src',
        type: 'string',
        default: '—',
        description: '图片地址（加载失败时回退默认图标或插槽内容）',
      },
      {
        name: 'alt',
        type: 'string',
        default: '—',
        description: '图片 alt（未提供时按装饰图处理，读屏跳过）',
      },
      { name: 'onError', type: '() => void', default: '—', description: '图片加载失败回调' },
    ],
    events: [{ vue: 'error', react: 'onError', payload: '—', description: '图片加载失败时触发' }],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: '自定义内容（文字 / 图标；优先级低于成功的图片）',
      },
    ],
  },
  notes: ['同时提供 src 与插槽内容时，图片加载成功只显示图片；失败后才显示插槽回退内容。'],
  a11y: ['提供 alt 时图片具备替代文本；纯装饰头像建议省略 alt，由读屏跳过。'],
};
