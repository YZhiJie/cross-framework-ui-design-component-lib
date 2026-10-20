import type { ComponentMeta } from '../types';
import BasicVue from './demos/basic.vue';
import BasicTsx from './demos/basic';
import TiltVue from './demos/tilt.vue';
import TiltTsx from './demos/tilt';

import basicVueSource from './demos/basic.vue?raw';
import basicTsxSource from './demos/basic.tsx?raw';
import tiltVueSource from './demos/tilt.vue?raw';
import tiltTsxSource from './demos/tilt.tsx?raw';

/** Carousel 轮播图文档元数据 */
export const carouselMeta: ComponentMeta = {
  name: 'Carousel',
  slug: 'carousel',
  title: '轮播图',
  category: 'display',
  summary: {
    'zh-CN':
      '中心聚焦式轮播：激活项放大高亮、两侧项缩小变暗并部分露出（三图效果），支持无限循环、自动播放、箭头/指示点切换与倾斜变体。',
    'en-US':
      'Center-focused carousel: the active slide is enlarged and highlighted while side slides shrink, dim and partially peek in; supports infinite loop, autoplay, arrows/dots navigation and a skewed variant.',
  },
  features: [
    {
      'zh-CN': '中心聚焦：激活项按倍数放大铺满轨道，相邻项以 60% 宽度部分露出形成三图布局',
      'en-US':
        'Center focus: the active slide scales to fill the track while neighbors peek in at 60% width',
    },
    {
      'zh-CN': '无限循环：首尾克隆位无缝环绕，收敛帧无回跳闪烁',
      'en-US': 'Infinite loop via head/tail clones with a seamless snap-back frame',
    },
    {
      'zh-CN': '自动播放（悬停/页面隐藏时暂停，恢复可见自动续播）',
      'en-US': 'Autoplay pauses on hover / hidden tab and resumes automatically',
    },
    {
      'zh-CN': '箭头 / 指示点 / 命令式 API 三种导航方式',
      'en-US': 'Arrows, dots and imperative API navigation',
    },
    {
      'zh-CN': 'skewed 倾斜变体：幻灯片平行四边形裁切、内容反向矫正',
      'en-US': 'skewed variant: parallelogram slides with counter-skewed content',
    },
    {
      'zh-CN': '受控/非受控双模式（value + onChange 约定）',
      'en-US': 'Controlled and uncontrolled modes (value + onChange)',
    },
    {
      'zh-CN': '根节点 CSS 变量可覆盖几何与配色（高度/幻灯片宽度/缩放倍数/变暗程度）',
      'en-US':
        'Geometry and colors overridable via root CSS variables (height/slide width/scale/dim)',
    },
  ],
  scenarios: [
    {
      'zh-CN': '官网首页 / 营销页的首屏 Banner 轮播',
      'en-US': 'Hero banner carousels on marketing sites',
    },
    { 'zh-CN': '运营活动页的推荐内容卡片轮播', 'en-US': 'Promotional content card carousels' },
    {
      'zh-CN': '大屏展示中的宽幅图文轮播（配合倾斜变体）',
      'en-US': 'Wide banner showcases on large screens (with the skewed variant)',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic Usage' },
      description: {
        'zh-CN':
          '默认无限循环 + 自动播放（3s，悬停暂停），箭头与指示点切换；通过 v-model:value 受控展示当前索引。',
        'en-US':
          'Infinite loop and autoplay (3s, pauses on hover) by default; navigate via arrows and dots. Current index is controlled through v-model:value.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicTsx,
      vueSource: basicVueSource,
      reactSource: basicTsxSource,
    },
    {
      id: 'tilt',
      title: { 'zh-CN': '倾斜变体', 'en-US': 'Skewed Variant' },
      description: {
        'zh-CN':
          'skewed 开启倾斜效果（对应「有倾斜」版本）：幻灯片以平行四边形裁切、内容反向矫正保持图片水平；几何经根节点 CSS 变量自定义。',
        'en-US':
          'skewed enables the tilted look: slides are clipped as parallelograms with counter-skewed content keeping images level; geometry is customized via root CSS variables.',
      },
      vueComponent: TiltVue,
      reactComponent: TiltTsx,
      vueSource: tiltVueSource,
      reactSource: tiltTsxSource,
    },
  ],
  api: {
    props: [
      {
        name: 'items',
        type: 'CarouselItem[]',
        default: '—',
        required: true,
        description: {
          'zh-CN': '轮播数据（key/image/alt）',
          'en-US': 'Slide data (key/image/alt)',
        },
      },
      {
        name: 'value',
        type: 'number',
        default: '—',
        description: {
          'zh-CN': '受控当前索引（提供即受控，0 起）',
          'en-US': 'Controlled current index (0-based)',
        },
      },
      {
        name: 'defaultValue',
        type: 'number',
        default: '0',
        description: {
          'zh-CN': '非受控初始索引（越界钳制）',
          'en-US': 'Initial uncontrolled index (clamped)',
        },
      },
      {
        name: 'autoplay',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '自动播放（悬停 / 页面隐藏时暂停，恢复后自动续播）',
          'en-US': 'Autoplay (pauses on hover / hidden tab, resumes automatically)',
        },
      },
      {
        name: 'interval',
        type: 'number',
        default: '3000',
        description: { 'zh-CN': '自动播放间隔（ms）', 'en-US': 'Autoplay interval (ms)' },
      },
      {
        name: 'loop',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '无限循环（首尾克隆实现无缝环绕；关闭后首末位 prev/next no-op）',
          'en-US': 'Infinite loop via head/tail clones; when off, prev/next no-op at the edges',
        },
      },
      {
        name: 'duration',
        type: 'number',
        default: '500',
        description: {
          'zh-CN': '切换动画时长（ms，动画期间再次切换会被丢弃）',
          'en-US': 'Transition duration (ms; moves during a transition are dropped)',
        },
      },
      {
        name: 'showArrows',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '显示前后箭头（单张时不渲染）',
          'en-US': 'Show prev/next arrows (not rendered for a single slide)',
        },
      },
      {
        name: 'showDots',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '显示指示点（单张时不渲染）',
          'en-US': 'Show indicator dots (not rendered for a single slide)',
        },
      },
      {
        name: 'pauseOnHover',
        type: 'boolean',
        default: 'true',
        description: { 'zh-CN': '悬停暂停自动播放', 'en-US': 'Pause autoplay on hover' },
      },
      {
        name: 'skewed',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '倾斜变体：幻灯片平行四边形裁切、内容反向矫正（适合横向宽幅图）',
          'en-US':
            'Skewed variant: parallelogram slides with counter-skewed content (best for wide banners)',
        },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的自定义类名',
          'en-US': 'Extra class on the root element',
        },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的内联样式（支持 CSS 自定义属性）',
          'en-US': 'Inline style on the root element (CSS custom properties supported)',
        },
      },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'number',
        description: {
          'zh-CN': '当前索引变更时触发（箭头 / 指示点 / 命令式 API / 自动播放）',
          'en-US':
            'Fires when the current index changes (arrows / dots / imperative API / autoplay)',
        },
      },
    ],
    slots: [],
    methods: [
      {
        name: 'prev',
        signature: '() => void',
        description: {
          'zh-CN': '切换到上一张（非循环且在首位时 no-op；动画进行中丢弃）',
          'en-US':
            'Go to the previous slide (no-op at the first slide when loop is off; dropped during a transition)',
        },
      },
      {
        name: 'next',
        signature: '() => void',
        description: {
          'zh-CN': '切换到下一张（非循环且在末位时 no-op；动画进行中丢弃）',
          'en-US':
            'Go to the next slide (no-op at the last slide when loop is off; dropped during a transition)',
        },
      },
      {
        name: 'goTo',
        signature: '(index: number) => void',
        description: {
          'zh-CN': '切换到指定索引（越界钳制；动画进行中丢弃）',
          'en-US': 'Go to the given index (clamped; dropped during a transition)',
        },
      },
      {
        name: 'play',
        signature: '() => void',
        description: {
          'zh-CN': '启动自动播放（autoplay 关闭 / 只有单张 / 悬停暂停中时 no-op）',
          'en-US': 'Start autoplay (no-op when autoplay is off / single slide / hover-paused)',
        },
      },
      {
        name: 'stop',
        signature: '() => void',
        description: { 'zh-CN': '停止自动播放', 'en-US': 'Stop autoplay' },
      },
    ],
    types: [
      {
        name: 'CarouselItem',
        definition: `type CarouselItem = {
  key: string;
  image: string;
  alt?: string;
};`,
        description: {
          'zh-CN': '轮播项结构；key 需在 items 内唯一（克隆位与指示点均依赖它）',
          'en-US': 'Slide shape; key must be unique within items (clones and dots depend on it)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        '无限循环通过首尾克隆位实现：环绕切换时轨道瞬时指向克隆位，动画结束后无感回跳归一化位。',
      'en-US':
        'Infinite loop is implemented with head/tail clones: wrap moves target a clone during the transition, then snap back to the normalized index seamlessly.',
    },
    {
      'zh-CN':
        '切换动画进行中（duration 内）的再次切换会被丢弃，避免克隆位越界；自动播放间隔应大于动画时长。',
      'en-US':
        'Moves issued during a transition (within duration) are dropped to keep clone positions in range; keep interval greater than duration.',
    },
    {
      'zh-CN':
        '受控模式下 update:value/change 在切换开始时即触发；若外部未回写 value，指示点保持受控值。',
      'en-US':
        'In controlled mode update:value/change fire when the move starts; dots stay on the controlled value if the prop is not written back.',
    },
    {
      'zh-CN':
        '几何与配色可经根节点 CSS 变量覆盖：--xui-carousel-height（轨道高度，默认 400px）、--xui-carousel-slide-width（幻灯片宽度，默认 60%）、--xui-carousel-active-scale（激活缩放，默认 1.3 / skewed 1.1）、--xui-carousel-dim-opacity（非激活透明度，默认 0.5）。',
      'en-US':
        'Geometry and colors are overridable via root CSS variables: --xui-carousel-height (400px), --xui-carousel-slide-width (60%), --xui-carousel-active-scale (1.3 / 1.1 when skewed), --xui-carousel-dim-opacity (0.5).',
    },
    {
      'zh-CN':
        'skewed 变体内容层统一放大以覆盖倾斜裁切的边角，适合横向宽幅图；极端窄高容器可能出现边角空隙。',
      'en-US':
        'The skewed variant zooms content to cover the clipped corners, best for wide banners; extremely tall-narrow containers may show corner gaps.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '根节点为 region 角色（aria-roledescription="carousel"），语言包提供区域文案；非激活幻灯片带 aria-hidden。',
      'en-US':
        'Root uses the region role (aria-roledescription="carousel") with localized region text; inactive slides carry aria-hidden.',
    },
    {
      'zh-CN':
        '箭头与指示点为原生 button（type="button"），aria-label 由语言包提供（上一张/下一张/第 n 张）。',
      'en-US':
        'Arrows and dots are native buttons (type="button") with localized aria-labels (previous / next / go to slide n).',
    },
  ],
};
