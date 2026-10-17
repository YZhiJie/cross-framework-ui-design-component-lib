/**
 * 「浮层视口避让」指南页数据：双端 demo 装配 + API 表格数据
 * 展示文案保持 LText 双语结构，由 DemoBlock / ApiSection 渲染层取值
 */
import type { ComponentMeta, DemoDefinition } from '../types';

import FlipVue from './demos/flip.vue';
import FlipReact from './demos/flip';
import MultiVue from './demos/multi.vue';
import MultiReact from './demos/multi';

import flipVueSource from './demos/flip.vue?raw';
import flipReactSource from './demos/flip.tsx?raw';
import multiVueSource from './demos/multi.vue?raw';
import multiReactSource from './demos/multi.tsx?raw';

export const floatingGuideDemos: DemoDefinition[] = [
  {
    id: 'flip',
    title: {
      'zh-CN': '方位翻转（flip）',
      'en-US': 'Placement Flipping (flip)',
    },
    description: {
      'zh-CN':
        '首选方位空间不足且对侧更充足时自动翻转：placement="top" 在视口顶部翻转到 bottom，placement="bottom" 在视口底部翻转到 top。',
      'en-US':
        'Flips automatically when the preferred placement lacks space and the opposite side has more: placement="top" flips to bottom at the top of the viewport, and placement="bottom" flips to top at the bottom.',
    },
    vueComponent: FlipVue,
    reactComponent: FlipReact,
    vueSource: flipVueSource,
    reactSource: flipReactSource,
  },
  {
    id: 'multi',
    title: {
      'zh-CN': '三组件共用避让逻辑',
      'en-US': 'Three Components, One Avoidance Logic',
    },
    description: {
      'zh-CN':
        'Tooltip / Popconfirm / Select 双端共用 @xui-design/shared/floating 的翻转与钳制算法，不重复实现。',
      'en-US':
        'Tooltip / Popconfirm / Select share the flip and clamp algorithms from @xui-design/shared/floating on both frameworks — implemented once.',
    },
    vueComponent: MultiVue,
    reactComponent: MultiReact,
    vueSource: multiVueSource,
    reactSource: multiReactSource,
  },
];

export const floatingGuideApi: ComponentMeta['api'] = {
  methods: [
    {
      name: 'resolveFloatingPosition',
      signature:
        '(trigger: FloatingRect, popper: FloatingRect, viewport: FloatingViewport, options: ResolveFloatingOptions) => FloatingPosition',
      description: {
        'zh-CN':
          '纯函数：输入触发器 / 浮层 / 视口的坐标矩形，输出最终方位（可能已翻转）与交叉轴平移量；不读 DOM、不写样式，便于单测。',
        'en-US':
          'Pure function: takes the trigger / popper / viewport rects and returns the final placement (possibly flipped) plus the cross-axis shift; never reads the DOM or writes styles, making it easy to unit test.',
      },
    },
    {
      name: 'getViewport',
      signature: '() => FloatingViewport',
      description: {
        'zh-CN':
          '获取当前视口边界（整页可视区域）；SSR / 无 window 环境返回零矩形（计算结果等价于不翻转不偏移）。',
        'en-US':
          'Returns the current viewport bounds (the visible page area); returns a zero rect in SSR / window-less environments (equivalent to no flip and no shift).',
      },
    },
    {
      name: 'bindViewportUpdate',
      signature: '(callback: () => void) => () => void',
      description: {
        'zh-CN':
          '订阅视口变化（scroll capture + resize），回调经 rAF 合并（一帧最多一次）；返回解绑函数，组件卸载时调用即可彻底清理。',
        'en-US':
          'Subscribes to viewport changes (scroll capture + resize) with callbacks batched via rAF (at most once per frame); returns an unbind function — call it on component unmount for full cleanup.',
      },
    },
  ],
  types: [
    {
      name: 'FloatingPlacement',
      definition: `type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';`,
      description: {
        'zh-CN': '四方位联合类型，与 core 契约的 placement 对齐。',
        'en-US': 'Union of the four placements, aligned with the placement contract in core.',
      },
    },
    {
      name: 'FloatingRect',
      definition: `type FloatingRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};`,
      description: {
        'zh-CN': '视口坐标矩形，可直接传 getBoundingClientRect() 的结果。',
        'en-US':
          'A viewport-coordinate rect; accepts the result of getBoundingClientRect() directly.',
      },
    },
    {
      name: 'ResolveFloatingOptions',
      definition: `type ResolveFloatingOptions = {
  placement: FloatingPlacement;
  gap?: number;        // 触发器与浮层间距，默认 8
  viewportPadding?: number; // 视口边缘安全区，默认 8
};`,
      description: {
        'zh-CN': 'resolveFloatingPosition 的入参选项。',
        'en-US': 'Options for resolveFloatingPosition.',
      },
    },
    {
      name: 'FloatingPosition',
      definition: `type FloatingPosition = {
  placement: FloatingPlacement; // 实际方位（可能已翻转）
  shift: number;                // 交叉轴平移量（px）
};`,
      description: {
        'zh-CN':
          '避让计算结果：top/bottom 方位 shift 为水平位移（正向右移），left/right 方位为垂直位移（正向下移）。',
        'en-US':
          'The avoidance result: for top/bottom placements, shift is horizontal (positive moves right); for left/right placements, it is vertical (positive moves down).',
      },
    },
  ],
};
