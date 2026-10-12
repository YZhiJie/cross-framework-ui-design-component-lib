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
  summary: {
    'zh-CN': '展示用户或事物的图片 / 文字头像，支持三种尺寸、圆形方形与图片失败回退。',
    'en-US':
      'Displays an image or text avatar for a user or entity, with three sizes, circle / square shapes, and image-failure fallback.',
  },
  features: [
    {
      'zh-CN': 'size 支持 sm / md / lg，shape 支持 circle / square',
      'en-US': 'size supports sm / md / lg; shape supports circle / square',
    },
    {
      'zh-CN': '内容优先级：加载成功的图片 ＞ 默认插槽 / children（文字图标）＞ 默认图标',
      'en-US':
        'Content priority: a successfully loaded image > default slot / children (text or icon) > default icon',
    },
    {
      'zh-CN': 'src 加载失败自动回退并触发 error 事件',
      'en-US': 'Falls back automatically and fires the error event when src fails to load',
    },
  ],
  scenarios: [
    {
      'zh-CN': '用户信息、评论列表、导航栏账号入口等需要形象标识的场景。',
      'en-US':
        'User profiles, comment lists, navbar account entries, and other scenarios needing a visual identity.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '图片 / 文字 / 尺寸', 'en-US': 'Image / Text / Sizes' },
      description: {
        'zh-CN': 'src 为图片地址；无图时显示插槽文字；size 控制三档尺寸。',
        'en-US':
          'src sets the image URL; slot text shows when there is no image; size controls the three size options.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'shape',
      title: { 'zh-CN': '形状与失败回退', 'en-US': 'Shapes & Failure Fallback' },
      description: {
        'zh-CN': 'shape 切换方形 / 圆形；图片加载失败时回退为插槽内容或默认图标。',
        'en-US':
          'shape switches between square and circle; falls back to slot content or the default icon when the image fails to load.',
      },
      vueComponent: ShapeVue,
      reactComponent: ShapeReact,
      vueSource: shapeVueSource,
      reactSource: shapeReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: { 'zh-CN': '头像尺寸', 'en-US': 'Avatar size' },
      },
      {
        name: 'shape',
        type: `'circle' | 'square'`,
        default: `'circle'`,
        description: { 'zh-CN': '头像形状', 'en-US': 'Avatar shape' },
      },
      {
        name: 'src',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '图片地址（加载失败时回退默认图标或插槽内容）',
          'en-US': 'Image URL (falls back to the default icon or slot content on load failure)',
        },
      },
      {
        name: 'alt',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '图片 alt（未提供时按装饰图处理，读屏跳过）',
          'en-US':
            'Image alt (treated as decorative and skipped by screen readers when not provided)',
        },
      },
      {
        name: 'onError',
        type: '() => void',
        default: '—',
        description: {
          'zh-CN': '图片加载失败回调',
          'en-US': 'Callback when the image fails to load',
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
    events: [
      {
        vue: 'error',
        react: 'onError',
        payload: '—',
        description: {
          'zh-CN': '图片加载失败时触发',
          'en-US': 'Fired when the image fails to load',
        },
      },
    ],
    slots: [
      {
        vue: 'icon',
        react: 'renderIcon',
        description: {
          'zh-CN': '自定义占位图标（无 src / 加载失败时替换内置 user 图标）',
          'en-US':
            'Custom placeholder icon (replaces the built-in user icon when there is no src or loading fails)',
        },
      },
      {
        vue: 'default',
        react: 'children',
        description: {
          'zh-CN': '自定义内容（文字 / 图标；优先级低于成功的图片）',
          'en-US': 'Custom content (text / icon; lower priority than a successfully loaded image)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '同时提供 src 与插槽内容时，图片加载成功只显示图片；失败后才显示插槽回退内容。',
      'en-US':
        'When both src and slot content are provided, only the image shows on successful load; the slot fallback appears only after a failure.',
    },
  ],
  a11y: [
    {
      'zh-CN': '提供 alt 时图片具备替代文本；纯装饰头像建议省略 alt，由读屏跳过。',
      'en-US':
        'The image gets alternative text when alt is provided; omit alt for purely decorative avatars so screen readers skip them.',
    },
  ],
};
